"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getMetricsClient } from "@/lib/metrics-client";

export function SiteMetrics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;

    const url = window.location.href;
    const referrer = lastPath.current
      ? new URL(lastPath.current, window.location.origin).href
      : document.referrer;
    lastPath.current = pathname;
    void getMetricsClient().then((client) => {
      client?.track("pageview", { path: pathname, url, referrer });
    });
  }, [pathname]);

  return null;
}
