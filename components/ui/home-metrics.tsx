"use client";

import { useEffect } from "react";
import { getMetricsClient } from "@/lib/metrics-client";

export function HomeMetrics() {
  useEffect(() => {
    let mounted = true;
    (async () => {
      const m = await getMetricsClient();
      if (!mounted) return;
      try {
        await m.setContext?.({ page: "home" });
        await m.trackPageview?.({ metadata: { referrer: document.referrer || null } });
      } catch (e) {
        // ignore
        // console.warn("Metrics error", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
