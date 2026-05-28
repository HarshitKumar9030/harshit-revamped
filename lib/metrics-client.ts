// Lightweight wrapper to create and reuse the harshit-metrics client on the client.
// Uses dynamic import so it won't execute during SSR.
let _client: any = null;

export async function getMetricsClient() {
  if (_client) return _client;

  try {
    const { createMetricsClient } = await import("harshit-metrics");

    // Point directly to the metrics collect endpoint so Vercel geo headers
    // (country, city, region) are captured server-side for each event.
    // The collect API already sets access-control-allow-origin: * so CORS is fine.
    const endpoint =
      process?.env?.NEXT_PUBLIC_METRICS_ENDPOINT ||
      "https://metrics.harshit.page/api/collect";

    const apiKey =
      process?.env?.NEXT_PUBLIC_HARSHIT_METRICS_KEY ||
      "mtr_3b7b8c42d160d2e24b10ff80fa3f41b01a9e7823dcc220e8";

    _client = createMetricsClient(apiKey, {
      endpoint,

      // ── Batching & Reliability ──
      maxBatchSize: 20,
      flushIntervalMs: 2000,
      retryCount: 3,
      retryBackoffMs: 2000,
      persistQueue: true,
      storageKey: "harshit_metrics_queue",

      // ── Session ──
      sessionTimeoutMs: 30 * 60 * 1000, // 30 min inactivity = new session

      // ── Auto-tracking (all features) ──
      autoTrackPageviews: true,
      autoTrackRouteChanges: true,
      autoTrackClicks: true,
      autoTrackOutbound: true,
      autoTrackForms: true,
      autoTrackScrollDepth: true,
      scrollThresholds: [10, 25, 50, 75, 90, 100],
      autoTrackErrors: true,
      autoTrackWebVitals: true,

      // ── Enrichment ──
      captureUtmParams: true,
      enrichDeviceInfo: true,

      debug: process.env.NODE_ENV === "development",
    });

    // Guaranteed delivery on tab close / navigation
    if (typeof window !== "undefined") {
      window.addEventListener("pagehide", () => {
        _client.flush({ useBeacon: true }).catch(() => {});
      });
    }

    // Global context for all events from this site
    _client.setContext({
      app: "harshit-portfolio",
      env: process.env.NODE_ENV || "production",
    });

    return _client;
  } catch {
    // If the package isn't installed, return a noop adapter so calling code doesn't crash.
    const noop = {
      track: async () => {},
      trackPageview: async () => {},
      identify: async () => {},
      setContext: async () => {},
      clearContext: async () => {},
      setUserProperties: async () => {},
      clearUserProperties: async () => {},
      group: async () => {},
      startTimer: () => 0,
      trackTiming: async () => {},
      trackRevenue: async () => {},
      trackFeatureFlag: async () => {},
      trackEngagement: () => () => {},
      flush: async () => {},
      shutdown: async () => {},
    };
    _client = noop;
    return _client;
  }
}
