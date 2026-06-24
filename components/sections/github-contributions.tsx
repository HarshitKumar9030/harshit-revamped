import { getGithubMetrics } from "@/lib/github";
import GithubClient from "@/components/github/GithubClient"; // Make sure to adjust import path

export async function GithubContributions() {
  const username = "harshitkumar9030";
  const metrics = await getGithubMetrics(username);
  
  const payload = {
    username,
    profile: metrics.profile,
    totalContributions: metrics.totalContributions,
    isLoaded: metrics.days.length > 0,
    peakLabel: metrics.peakDay ? metrics.peakDay.date : "No active day yet",
    metrics: metrics,
    heatmapDays: metrics.recentDays.length > 0 ? metrics.recentDays : Array.from({ length: 56 }, (_, index) => ({
      date: `placeholder-${index}`,
      count: 0,
      level: 0,
    }))
  };

  return <GithubClient data={payload} />;
}