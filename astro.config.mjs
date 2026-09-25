// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed via Firebase Hosting (firebase.json + .firebaserc at the project root).
// PLACEHOLDER project: .firebaserc pins "localseohub-blog-PLACEHOLDER", which is not
// a real Firebase project yet. src/lib/url.ts mediates every internal link, so the
// site can move under a sub-path (or a custom domain) later by changing `site`/`base`
// here alone — update this `site` value together with `.firebaserc` once a real
// Firebase project exists (see CLAUDE.md).
export default defineConfig({
  site: 'https://localseohub.firebaseapp.com',
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
