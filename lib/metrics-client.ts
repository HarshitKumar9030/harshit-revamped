import type { MetricsClient } from "harshit-metrics";

let clientPromise: Promise<MetricsClient> | undefined;

export async function getMetricsClient(): Promise<MetricsClient | undefined> {
  const apiKey = process.env.NEXT_PUBLIC_HARSHIT_METRICS_KEY;
  if (typeof window === "undefined" || !apiKey) return;

  clientPromise ??= import("harshit-metrics").then(({ createMetricsClient }) => {
    const client = createMetricsClient(apiKey, {
      endpoint: process.env.NEXT_PUBLIC_METRICS_ENDPOINT || undefined,
      autoTrackPageviews: false,
      autoTrackRouteChanges: false,
      autoTrackClicks: true,
      autoTrackOutbound: true,
      autoTrackForms: true,
      autoTrackScrollDepth: true,
      scrollThresholds: [10, 25, 50, 75, 90, 100],
      autoTrackErrors: true,
      autoTrackWebVitals: true,
      flushIntervalMs: 2000,
      storageKey: "harshit_metrics_queue",
    });
    client.setContext({ app: "harshit-portfolio", env: process.env.NODE_ENV });
    return client;
  });

  try {
    return await clientPromise;
  } catch {
    clientPromise = undefined;
  }
}
