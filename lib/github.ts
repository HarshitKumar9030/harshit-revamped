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
        Accept: "image/svg+xml,text/html;q=0.9,*/*;q=0.8",
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

function parseContributionDays(svg: string): ContributionDay[] {
  const rectTags = svg.match(/<rect\b[^>]*data-date="[^"]+"[^>]*>/g) ?? [];

  return rectTags
    .map((tag) => ({
      date: readAttr(tag, "data-date"),
      count: Number(readAttr(tag, "data-count") || 0),
      level: Number(readAttr(tag, "data-level") || 0),
    }))
    .filter((day) => day.date.length > 0)
    .sort((left, right) => Date.parse(left.date) - Date.parse(right.date));
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
  const year = new Date().getFullYear();
  const today = new Date().toISOString().slice(0, 10);
  const contributionsUrl = `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${today}`;

  const [profile, svg] = await Promise.all([
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

  const days = svg ? parseContributionDays(svg) : [];
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
