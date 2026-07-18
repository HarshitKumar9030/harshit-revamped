import type { MetadataRoute } from "next";
import { getAllScrawls } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: absoluteUrl("/scrawl"),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: absoluteUrl("/experiments"),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: absoluteUrl("/scrawl/all"),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: absoluteUrl("/scrawl/tags"),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  try {
    const scrawls = await getAllScrawls();
    const scrawlRoutes = scrawls.map((scrawl) => ({
      url: absoluteUrl(`/scrawl/${encodeURIComponent(scrawl.slug)}`),
      lastModified: new Date(scrawl.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(scrawl.image ? { images: [absoluteUrl(scrawl.image)] } : {}),
    }));

    const tags = new Set(scrawls.flatMap((scrawl) => scrawl.tags ?? []));
    const tagRoutes = [...tags].map((tag) => ({
      url: absoluteUrl(`/scrawl/tags/${encodeURIComponent(tag.toLowerCase())}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    return [...routes, ...scrawlRoutes, ...tagRoutes];
  } catch {
    return routes;
  }
}
