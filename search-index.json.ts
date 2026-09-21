import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Shared search/related-articles index, built once at build time and
// served as a single static JSON file instead of being duplicated inline
// into every one of the ~300 article pages (which was the main driver of
// Vercel deployment storage — each build carried this same array on every
// page it generated).
export const GET: APIRoute = async () => {
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const posts = (await getCollection('blog', ({ data }) => data.status === 'published'))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      date: fmt(post.data.pubDate),
      source: post.data.sourceName,
      region: post.data.region ?? null,
      pubDate: post.data.pubDate.toISOString(),
    }));

  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' },
  });
};
