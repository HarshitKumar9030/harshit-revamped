"use client";

import { useEffect, useRef } from "react";
import { getMetricsClient } from "@/lib/metrics-client";

export function ViewTracker({ slug, tags }: { slug: string; tags?: string[] }) {
  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    
    // Fire local DB metric increment
    fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, tags }),
    }).catch((e) => console.log("Could not increment metric.", e));

    // Also forward an event to the external metrics SDK if available
    (async () => {
      try {
        const m = await getMetricsClient();
        await m.track?.("scrawl_view", { metadata: { slug, tags } });
      } catch {
        // ignore
      }
    })();

    isFetched.current = true;
  }, [slug, tags]);

  return null;
}
