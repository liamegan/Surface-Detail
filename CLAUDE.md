# Surface Detail — CLAUDE.md

## Project Summary

Personal blog/site for Liam Egan. A horizontally-scrolling reading experience with a fixed sidebar. Content is managed via Sanity CMS. Deployed on Vercel.

Site URL: `https://surface-detail.vercel.app` (uses `NEXT_PUBLIC_SITE_URL` env var)
Site name: **Surface Detail**
Author: Liam Egan

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| CMS | Sanity v3 (with Sanity Studio at `/studio`) |
| Styling | SCSS (global) + CSS Modules (component-level) |
| Font | Rubik (Google Fonts via `next/font`) |
| Analytics | Vercel Analytics |
| RSS | `rss` npm package |
| Rich text | `@portabletext/react` / `next-sanity` PortableText |
| Code highlighting | `react-refractor` + `refractor` |
| Image URLs | `@sanity-image/url-builder` |
| Deployment | Vercel |

## Directory Structure

```
src/
  app/
    (site)/               # Public-facing site (layout, sidebar, pages)
      components/sidebar/ # Sidebar component (header, nav, logo SVG)
      page.tsx            # Home — lists all posts
      layout.tsx          # Site layout: WheelContextProvider + ClientLayout + Sidebar
      posts/[slug]/       # Individual post pages
    api/rss/route.ts      # RSS feed endpoint (/api/rss)
    robots.ts             # robots.txt
    sitemap.ts            # sitemap.xml
    layout.tsx            # Root layout (Rubik font, SanityLive, VisualEditing)
    studio/               # Sanity Studio (embedded)
  components/
    ArticleSeries/        # Shows series nav for posts belonging to a series
    ClientLayout.tsx      # Client: intercepts wheel events → horizontal scroll
    MouseContextProvider/ # WheelContext — tracks wheel delta, direction, isScrolling
    DisableDraftMode.tsx  # Button to exit Sanity draft mode
    image/                # PortableText image renderer
    codepen/              # PortableText CodePen embed renderer
    code/                 # PortableText code block renderer (react-refractor)
  css/
    styles.scss           # Entry: imports baseline, resets, typography, layout, code
    baseline.scss         # CSS custom props: --fontsize, --lineheight, --baseline
    layout.scss           # .wrapper grid, article header, main columns
    typography.scss       # Type scale, nav, link hover underline animation
    resets.scss           # Box-sizing, margin resets
    variables.scss        # SCSS $baseline (16px)
    code.scss             # Code block styles
  sanity/
    schemaTypes/          # Sanity document/object types
    lib/                  # client, live, image helpers
    types.ts              # Auto-generated types (run: npm run typegen)
```

## Sanity Schema Types

- **post** — title, slug, author (ref), mainImage (hotspot), categories (ref[]), publishedAt, body (blockContent)
- **author** — name, image, bio
- **category** — title, description
- **articleSeries** — title, list (reference[] to post) — ordered list for multi-part series
- **blockContent** — Portable Text array supporting: block (h3/h4/h5/blockquote/bullet/number), code, image, codepen; marks: strong/em/code; annotations: link (external URL), internalLink (→ post)
- **codepen** — title, url, description

## Key Behaviours

### Horizontal Scroll
The layout scrolls horizontally. `WheelContextProvider` intercepts `wheel` events (disabled in Sanity draft/presentation mode via `useDraftModeEnvironment`). `ClientLayout` maps `deltaY → window.scrollBy({ left: deltaY * 3 })`.

### Article Series
`ArticleSeries` component fetches any series referencing the current post slug and renders an ordered nav. Current post shown as `<span>`, others as `<Link>`. Renders nothing if post has no series.

### Draft Mode / Sanity Visual Editing
- Draft mode enabled via `/api/draft-mode/enable`
- `VisualEditing` shown when draft mode active (root layout)
- `DisableDraftMode` button shown in sidebar when draft mode active
- `SanityLive` added to root layout for live content updates

### RSS Feed
`/api/rss` — generates XML feed from all posts. Body stripped to plain text (first 300 chars). Cached 1 hour (`Cache-Control: public, max-age=3600`).

### Metadata / SEO
- Per-post `generateMetadata` fetches title + mainImage for OG tags
- Sitemap at `/sitemap.xml`, robots at `/robots.txt`
- RSS alternate link in `<head>` via layout metadata

## Code Style & Conventions

- TypeScript throughout; avoid `any`
- Components exported as named exports (not default), with barrel `index.tsx`
- CSS: global SCSS for typography/layout, CSS Modules (`.module.scss`) for component-specific styles
- Class utilities: `classnames()` util at `@/utils/classnames`
- GROQ queries defined inline with `groq` template tag; use `sanityFetch` (not raw `client`) for live data
- Sanity types auto-generated at `src/sanity/types.ts` — run `npm run typegen` after schema changes
- Path alias: `@/` → `src/`
- No test framework configured

## Design System

- **Font**: Rubik (variable, subsets: latin-ext), weights 600/800 for headings
- **Baseline**: 15px font, 1.6 line-height → `--baseline: 24px`
- **Layout**: CSS grid, sidebar ~300px + 4em, content max 600px, horizontal multi-column scroll
- **Colours**: CSS custom props `--foreground`, `--foretrans` (semi-transparent foreground)
- **Logo**: SVG with Gaussian blur circles clipped to "Surface Detail" text, animated with CSS
- **Links**: underline + `::after` border-top slide-in on hover

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SITE_URL
SANITY_API_READ_TOKEN   (for server-side fetching / draft mode)
```

## Commands

```bash
npm run dev       # Dev server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint
npm run typegen   # Regenerate Sanity types after schema changes
```

## Known Issues / TODOs

- `ClientLayout.tsx` has commented-out `--vh` CSS variable logic (viewport height for mobile) — not yet implemented
- Some commented-out body centering styles in `styles.scss` — leftover from layout experiments
- `page.tsx` (home) has a commented-out direct `client` import — uses `sanityFetch` correctly now
- No 404 handling on post page beyond `<div>No post found for {slug}</div>`
- No pagination on the home post list
- No category/tag filtering
- RSS body is plain-text only (no HTML rendering of Portable Text)
