"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ slug, tags }: { slug: string; tags?: string[] }) {
  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    
    fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, tags }),
    }).catch((e) => console.log("Could not increment metric.", e));

    isFetched.current = true;
  }, [slug, tags]);

  return null;
}
