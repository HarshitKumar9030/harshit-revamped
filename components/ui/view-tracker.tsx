"use client";

import { useEffect, useRef } from "react";
import { getMetricsClient } from "@/lib/metrics-client";

export function ViewTracker({ slug, tags }: { slug: string; tags?: string[] }) {
  const lastSlug = useRef<string | null>(null);

  useEffect(() => {
    if (lastSlug.current === slug) return;
    lastSlug.current = slug;
    const { pathname, href } = window.location;

    void fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, tags }),
    }).catch(() => {});

    void getMetricsClient().then((client) => {
      client?.track("scrawl_view", {
        path: pathname,
        url: href,
        metadata: { slug, tags },
      });
    });
  }, [slug, tags]);

  return null;
}
