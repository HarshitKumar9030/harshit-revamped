import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content', 'scrawl');

export type ScrawlMeta = {
  title: string;
  smallTitle?: string;
  date: string;
  excerpt: string;
  slug: string;
  tags?: string[];
  image?: string;
  readingTime?: number;
};

export async function getScrawlBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);
  
  // Calculate reading time (assuming ~250 words per minute)
  const wordCount = content.split(/\s+/g).length;
  const readingTime = Math.ceil(wordCount / 250);

  return {
    meta: {
      ...data,
      slug: realSlug,
      readingTime,
    } as ScrawlMeta,
    content,
  };
}

export async function getAllScrawls() {
  // Ensure the directory exists
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory);
  const scrawls = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const realSlug = file.replace(/\.mdx$/, '');
      const fullPath = path.join(contentDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const wordCount = content.split(/\s+/g).length;
      const readingTime = Math.ceil(wordCount / 250);

      return {
        ...data,
        slug: realSlug,
        readingTime,
      } as ScrawlMeta;
    })
    .sort((a, b) => (new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1));

  return scrawls;
}
