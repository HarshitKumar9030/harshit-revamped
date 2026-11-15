import type { MetadataRoute } from "next";
import { getAllScrawls } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    {
      url: absoluteUrl("/"),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: absoluteUrl("/scrawl"),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: absoluteUrl("/experiments"),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: absoluteUrl("/scrawl/all"),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: absoluteUrl("/scrawl/tags"),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  try {
    const scrawls = await getAllScrawls();
    const scrawlRoutes = scrawls.map((scrawl) => ({
      url: absoluteUrl(`/scrawl/${encodeURIComponent(scrawl.slug)}`),
      lastModified: scrawl.updated ?? scrawl.date,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(scrawl.image ? { images: [absoluteUrl(scrawl.image)] } : {}),
    }));

    const tags = new Set(scrawls.flatMap((scrawl) => scrawl.tags?.map((tag) => tag.toLowerCase()) ?? []));
    const tagRoutes = [...tags].map((tag) => ({
      url: absoluteUrl(`/scrawl/tags/${encodeURIComponent(tag)}`),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    return [...routes, ...scrawlRoutes, ...tagRoutes];
  } catch {
    return routes;
  }
}
