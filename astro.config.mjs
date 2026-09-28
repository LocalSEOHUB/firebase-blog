// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed via Firebase Hosting (firebase.json + .firebaserc at the project root).
// Project id is `localseohub-3d04d` — Firebase auto-suffixed it because the plain
// "localseohub" id was already taken (same as the sibling LocalSME project needing
// "localsmework"). src/lib/url.ts mediates every internal link, so the site can move
// under a sub-path (or a custom domain) later by changing `site`/`base` here alone.
export default defineConfig({
  site: 'https://localseohub-3d04d.firebaseapp.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // /search/ is a client-side tool, not content, and is marked noindex.
      filter: (page) => !page.endsWith('/search/'),
    }),
  ],
  image: {
    // Remote featured images (a pasted stock-photo URL, say) are downloaded at
    // build time, resized and served from this origin — so they get the same
    // treatment as local uploads and cost the reader no third-party request.
    remotePatterns: [{ protocol: 'https' }],
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
