import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Live domain — sitemap URLs, canonical links, and RSS (if added later)
  // all derive from this, so it needs to match the real site, not the
  // old Vercel preview URL.
  site: 'https://thesouthpress.in',
  integrations: [sitemap()],
});
