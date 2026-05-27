import { MetadataRoute } from 'next';
import { getAllScrawls } from '@/lib/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://harshit.page';

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/scrawl`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/experiments`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic Scrawl MDX routes
  try {
    const scrawls = await getAllScrawls();
    const scrawlRoutes = scrawls.map((scrawl) => ({
      url: `${baseUrl}/scrawl/${scrawl.slug}`,
      lastModified: new Date(scrawl.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
    
    return [...routes, ...scrawlRoutes];
  } catch (error) {
    // Fallback if no scrawls found or reading fails during build
    return routes;
  }
}