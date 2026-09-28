# Working in this repository

A solo-author static blog: Astro 7 + TypeScript, Sveltia CMS, Pagefind search, Giscus
comments — the same proven scaffold as the sibling GitHub Pages, GitLab Pages, Cloudflare
Pages, Netlify and vzero-blog (Vercel) projects, but its own codebase, content and visual
design going forward.

**Repo:** [LocalSEOHUB/firebase-blog](https://github.com/LocalSEOHUB/firebase-blog)
on GitHub (`main`). **Hosting: Firebase Hosting**, project id `localseohub-3d04d`
(auto-suffixed by Firebase since the plain "localseohub" id was taken — same as the
sibling LocalSME project needing `localsmework`), live at
<https://localseohub-3d04d.firebaseapp.com/>. Its free Spark plan needs no card at all
for static Hosting (only Cloud Functions/Blaze require billing). See `firebase.json` and
"Placeholders to fill in" below for what's still generic template content.

This project's name and hosting have moved twice: scaffolded for a Replit Static
Deployment (as `Replit-blog`) whose free tier expires after 30 days, tried Render next
(free but requires credit card verification — a dead end without one), landed on
Firebase Hosting and was renamed `firebase-blog` to match. If anything still says
"Replit" or "Render", it's stale — flag it.

## Design language

A retro terminal / CRT. The whole site renders as one floating "window" — traffic-light
dots, a fake `guest@localseohub:~$` prompt for a title — on a darker desktop
backdrop, monospace throughout (JetBrains Mono; VT323 only for the glowing `<h1>`), a
faint CRT scanline overlay, and posts that read like `cat <slug>.md` shell commands with
comment-style (`#`) meta lines. Deliberately different from every sibling: not the warm
serif/rounded-card GitHub/GitLab look, not the cool flat hairline-technical Cloudflare
look, and not vzero-blog's quiet sidebar + serif-numeral reading list — this one leans
all the way into "coding platform" chrome instead of hiding it. Whole language lives in
`src/styles/global.css`; components mostly carry the same class names as the other
siblings (`.pill`, `.toc`, `.post-list`, …) so the visual layer can be re-skinned again
later without touching component logic. One exception: `PostCard.astro` here takes only
a `post` prop (no `index` — vzero-blog's numbered-list motif belongs to that project, not
this one; don't copy it back over without a reason).

## Development

```bash
npm run dev      # localhost:4321/ — drafts visible
npm run build    # production build + Pagefind index
npm run preview  # serves dist/ — the only faithful test of search and base paths
npm run check    # TypeScript + Astro diagnostics; keep this at 0 errors
```

**On this Windows machine**, Smart App Control blocks Astro's native compiler binary.
After every `npm install` or `npm ci`:

```bash
npm install --no-save --force @astrojs/compiler-binding-wasm32-wasi
```

## Editing content

The CMS at `/admin/` uses the GitHub backend — **"Sign In Using Access Token"** with a
fine-grained PAT scoped to `LocalSEOHUB/firebase-blog` (same pattern as the
sibling Cloudflare/vzero blogs; **not** "Sign In with GitHub", which hangs — see the
Cloudflare blog's `docs/troubleshooting.md`). Saving is a commit to `main`, which
triggers the Firebase Hosting GitHub Action once that is set up (see below) — deploying
is then the same "save in CMS → live" flow every sibling blog has.

Locally, `local_backend: true` (set in `public/admin/config.yml`) is also available —
lets Sveltia read and write this working copy directly through the browser's File
System Access API (Chromium-based browsers only), for editing without every save
reaching the live site immediately:

```bash
npm run dev
```

Open **http://localhost:4321/admin/index.html** (the explicit filename is required in
dev) and choose **"Work with Local Repository"**.

## Deploying to Firebase Hosting

**Deployed.** `.firebaserc`'s default project (`localseohub-3d04d`) and
`astro.config.mjs`'s `site` (`https://localseohub-3d04d.firebaseapp.com`) both point at
the real Firebase project — "localseohub" itself was already taken, so Firebase
auto-suffixed it (same as the sibling LocalSME project needing `localsmework`).
`firebase.json` (public dir `dist`, `trailingSlash: true` to match
`astro.config.mjs`'s `trailingSlash: 'always'` — the same class of bug the
`/admin/config.yml` absolute-path fix addressed on Vercel) needed no brand-specific
changes.

Set up via `firebase init hosting:github`, pointed at `LocalSEOHUB/firebase-blog`,
branch `main` — this created a GCP service account, stored it as the GitHub Actions
secret `FIREBASE_SERVICE_ACCOUNT_LOCALSEOHUB_3D04D` on the repo, and generated
`.github/workflows/firebase-hosting-merge.yml` and `-pull-request.yml` (a first attempt
at this accidentally typed the wrong repo, `LocalSEOHUB/cloudflare-blog`, and had to be
cleaned up there and re-run against the right repo — check any *other* sibling that
hasn't been Firebase-deployed yet for the same mistake before assuming its secret
landed in the right place).

A push to `main` (or a CMS save) triggers the Action and deploys automatically — the
same "save in CMS → live" flow every sibling blog has.

## Rules that are easy to get wrong

(Same rules as the sibling blogs — carried over unchanged because the underlying
scaffold is unchanged, only the visual layer differs.)

**Never write a root-absolute internal path.** Use the helpers in `src/lib/url.ts`:

| Helper | For |
| --- | --- |
| `withBase(p)` | paths you author — `/about/` |
| `absFromBuiltPath(p, site)` | paths Astro produced (`Astro.url.pathname`, `ImageMetadata.src`, `paginate()` URLs) — already based |
| `absUrl(p, site)` | absolute URL from a path you author |

**`paginate()` URLs already include the base.** `Pagination.astro` takes them raw.

**Query posts through `getPosts()`** in `src/lib/posts.ts`, never `getCollection`
directly — that is where drafts are filtered and date ordering happens.

**Frontmatter image paths are relative to the Markdown file** —
`../../assets/images/uploads/…`. `media_folder`/`public_folder` in
`public/admin/config.yml` must stay in sync with wherever posts live.

**Site-wide settings live in `src/consts.ts` and nowhere else.**

**The CMS schema and the Zod schema must match.** `public/admin/config.yml` field names
and `src/content.config.ts` are one contract.

**`public/admin/config.yml` is YAML.** Quote any string containing `: `.

**`public/admin/index.html`'s config link is an absolute `/admin/config.yml`, not a
relative one.** A relative link 404s whenever `/admin` (no trailing slash) is requested
directly, because the browser resolves it against `/` instead of `/admin/` — this bit
the vzero-blog sibling in production. Keep it absolute.

## Placeholders still to fill in

The site-URL-shaped config (`.firebaserc`, `astro.config.mjs`, `public/admin/
config.yml`'s `site_url`/`display_url`, `public/robots.txt`'s `Sitemap:` line, and the
two `.github/workflows/firebase-hosting-*.yml` files) is now real — no action needed
there. What's still deliberately fake:

- `src/consts.ts` — `GISCUS.repo` is set to `LocalSEOHUB/firebase-blog`, but
  `repoId`/`categoryId` are still empty (fill in from https://giscus.app once Giscus is
  enabled on the new repo), `SOCIAL_LINKS` (empty), `AUTHOR_NAME`/`AUTHOR_BIO` (still
  template defaults), `AUTHOR_EMAIL` (set to the placeholder `hello@localseohub.com`)
- `public/social-card.png` — still shows the old CreativeDigitalGrowth brand baked in
  as an image, needs a fresh design

## Before calling a change done

```bash
npm run check    # expect 0 errors
npm run build
```

If the change is visible in a browser, verify with `npm run preview` rather than
`npm run dev` — search, `/admin/` and draft exclusion all behave differently between the
two.

## Documentation

https://docs.astro.build — [Routing](https://docs.astro.build/en/guides/routing/),
[Content collections](https://docs.astro.build/en/guides/content-collections/),
[Images](https://docs.astro.build/en/guides/images/). Firebase Hosting + GitHub:
https://firebase.google.com/docs/hosting/github-integration.
