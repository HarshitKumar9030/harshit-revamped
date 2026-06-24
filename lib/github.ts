import "server-only";

type GithubProfile = {
  login: string;
  name: string | null;
  htmlUrl: string;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
};

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type GithubMetrics = {
  profile: GithubProfile | null;
  days: ContributionDay[];
  totalContributions: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  peakDay: ContributionDay | null;
  recentDays: ContributionDay[];
};

const DEFAULT_USERNAME = "harshitkumar9030";
const REQUEST_TIMEOUT_MS = 5000;

function withTimeoutSignal() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

async function fetchText(url: string): Promise<string | null> {
  const { signal, clear } = withTimeoutSignal();

  try {
    const response = await fetch(url, {
      signal,
      headers: {
        Accept: "text/html;q=0.9,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.text();
  } catch {
    return null;
  } finally {
    clear();
  }
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const { signal, clear } = withTimeoutSignal();

  try {
    const response = await fetch(url, {
      signal,
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "Mozilla/5.0",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clear();
  }
}

function readAttr(tag: string, attribute: string): string {
  const match = tag.match(new RegExp(`${attribute}="([^"]*)"`));
  return match?.[1] ?? "";
}

function parseContributionDays(html: string): ContributionDay[] {
  const days: ContributionDay[] = [];
  
  // 1. Modern GitHub DOM (Uses <td class="ContributionCalendar-day">)
  const tdRegex = /<td\b([^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*)>/g;
  let match;
  
  while ((match = tdRegex.exec(html)) !== null) {
    const tagProps = match[1];
    const date = readAttr(tagProps, "data-date");
    const level = readAttr(tagProps, "data-level");
    const id = readAttr(tagProps, "id");
    
    if (!date) continue;

    let count = 0;
    if (id) {
      // Find the associated tooltip to extract the commit count string
      const tooltipRegex = new RegExp(`<tool-tip[^>]*for="${id}"[^>]*>([^<]+)<\/tool-tip>`);
      const tooltipMatch = html.match(tooltipRegex);
      
      if (tooltipMatch) {
        const text = tooltipMatch[1]; // e.g. "7 contributions on Jan 1st"
        if (!text.toLowerCase().includes("no contributions")) {
          // Replace commas for counts >= 1,000 to ensure proper parsing
          const numMatch = text.replace(/,/g, "").match(/\d+/);
          count = numMatch ? parseInt(numMatch[0], 10) : 0;
        }
      } else {
         // Fallback inside the tag itself
         const fallbackCount = readAttr(tagProps, "data-count");
         if (fallbackCount) count = parseInt(fallbackCount, 10);
      }
    }
    
    days.push({
      date,
      count,
      level: parseInt(level, 10) || 0
    });
  }

  // 2. Fallback for older <rect> based graphs (Just in case they revert or you use GitHub Enterprise)
  if (days.length === 0) {
    const rectTags = html.match(/<rect\b[^>]*data-date="[^"]+"[^>]*>/g) ?? [];
    for (const tag of rectTags) {
      days.push({
        date: readAttr(tag, "data-date"),
        count: Number(readAttr(tag, "data-count") || 0),
        level: Number(readAttr(tag, "data-level") || 0),
      });
    }
  }

  return days.sort((left, right) => Date.parse(left.date) - Date.parse(right.date));
}

function calculateCurrentStreak(days: ContributionDay[]): number {
  let streak = 0;

  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count > 0) {
      streak += 1;
    } else if (streak > 0) {
      break;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(days: ContributionDay[]): number {
  let current = 0;
  let longest = 0;

  for (const day of days) {
    if (day.count > 0) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

export async function getGithubMetrics(username = DEFAULT_USERNAME): Promise<GithubMetrics> {
  // Removing the ?from and ?to parameters makes GitHub default to retrieving the trailing 365 days.
  // This solves a nasty edge-case where if you checked your portfolio in February, it would only 
  // return 30 total days, completely breaking the 56-day heatmap visualizer grid.
  const contributionsUrl = `https://github.com/users/${username}/contributions`;

  const [profile, html] = await Promise.all([
    fetchJson<GithubProfile & { html_url?: string; avatar_url?: string; public_repos?: number }>(
      `https://api.github.com/users/${username}`
    ),
    fetchText(contributionsUrl),
  ]);

  const normalizedProfile = profile
    ? {
        login: profile.login,
        name: profile.name ?? null,
        htmlUrl: profile.html_url ?? `https://github.com/${username}`,
        avatarUrl: profile.avatar_url ?? `https://github.com/${username}.png`,
        bio: profile.bio ?? null,
        publicRepos: profile.public_repos ?? 0,
        followers: profile.followers,
        following: profile.following,
      }
    : null;

  const days = html ? parseContributionDays(html) : [];
  const totalContributions = days.reduce((sum, day) => sum + day.count, 0);
  const activeDays = days.filter((day) => day.count > 0).length;
  const currentStreak = calculateCurrentStreak(days);
  const longestStreak = calculateLongestStreak(days);
  const peakDay = days.reduce<ContributionDay | null>((best, day) => {
    if (!best || day.count > best.count) {
      return day;
    }
    return best;
  }, null);

  return {
    profile: normalizedProfile,
    days,
    totalContributions,
    activeDays,
    currentStreak,
    longestStreak,
    peakDay,
    recentDays: days.slice(-56),
  };
}