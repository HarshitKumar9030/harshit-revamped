// Lightweight wrapper to create and reuse the harshit-metrics client on the client
// This file uses dynamic import so it won't run during SSR if the package isn't installed.
let _client: any = null;

export async function getMetricsClient() {
  if (_client) return _client;

  // Dynamic import to avoid SSR issues when the package isn't installed on the server
  try {
    const mod = await import("harshit-metrics");
    const createMetricsClient = mod.createMetricsClient;

    // Prefer public env override, fallback to the example ingestion endpoint
    const endpoint = typeof window !== "undefined" && process?.env?.NEXT_PUBLIC_METRICS_ENDPOINT
      ? process.env.NEXT_PUBLIC_METRICS_ENDPOINT
      : "https://metrics.harshit.page/api/collect";

    const apiKey = process?.env?.NEXT_PUBLIC_HARSHIT_METRICS_KEY || "mtr_your_api_key";

    _client = createMetricsClient(apiKey, {
      endpoint,
      autoTrackPageviews: true,
      maxBatchSize: 20,
      flushIntervalMs: 2000,
      retryCount: 3,
      retryBackoffMs: 2000,
      persistQueue: true,
      storageKey: "harshit_metrics_queue",
    });

    if (typeof window !== "undefined") {
      window.addEventListener("pagehide", () => {
        _client.flush({ useBeacon: true }).catch(() => {});
      });
    }

    // Optional: set a lightweight global context
    _client.setContext({ app: "harshit-portfolio", env: process.env.NODE_ENV || "production" });
    return _client;
  } catch (err) {
    // If the package isn't installed, return a noop adapter so calling code doesn't crash.
    const noop = {
      track: async () => {},
      trackPageview: async () => {},
      identify: async () => {},
      setContext: async () => {},
      trackTiming: async () => {},
      flush: async () => {},
      shutdown: async () => {},
    };
    _client = noop;
    return _client;
  }
}
