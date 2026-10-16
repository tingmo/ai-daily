import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.moomlt.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      customPages: ['https://www.moomlt.com/daily/'],
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
  devToolbar: { enabled: false },
});
