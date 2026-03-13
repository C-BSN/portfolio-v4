# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Development server with Turbopack
npm run build      # Production build (static export)
npm run lint       # ESLint
npm run cms        # Decap CMS local server
```

**Docker (via Makefile):**
```bash
make build         # Build Docker image
make up            # Start containers
make down          # Stop containers
make logs          # View logs
```

## Architecture

**Tech Stack:** Next.js 15 (App Router, static export), React 19, TypeScript, Tailwind CSS, Framer Motion, Lenis smooth scroll.

### Content System
Content is fully file-based via Markdown + YAML frontmatter in `/content/`:
- `/content/pages/` — Static page content (homepage, about)
- `/content/projects/` — Portfolio project entries

`/src/lib/content.ts` reads these at build time using `gray-matter` and exposes typed helpers: `getPageData()`, `getProjectData()`, `getFeaturedProjects()`. Filenames become URL slugs.

### Routing
App Router directory-based routing under `/src/app/`. Dynamic project pages at `/projects/[slug]/page.tsx` are statically generated from markdown filenames.

### Components
- `/src/components/manga/` — Core design components (Hero, ProjectCard, StackMarquee, SmoothScroll wrapper)
- `/src/components/effects/` — Visual effects (NeonTitle, CursorGlow, LightningEffect, RainEffect, SkyEffect)
- `/src/components/layout/` — Header/footer (manga-styled variants are the active ones)
- `/src/components/ui/` — Shadcn/Radix UI primitives

`Providers.tsx` wraps the app with `next-themes`. `GlobalEffectsWrapper.tsx` mounts visual effects globally.

### API
Single API route at `/src/app/api/contact/route.ts` — POST endpoint using the **Resend** email service. Requires `RESEND_API_KEY` environment variable.

### Styling
- CSS variables for theming in `src/app/globals.css`
- Tailwind with class-based dark mode
- Framer Motion for component animations
- Lenis (via `SmoothScroll.tsx`) for smooth page scrolling

### Build Notes
- `next.config.ts` sets `output: 'export'` (static site, no SSR)
- Next.js image optimization is **disabled** (`unoptimized: true`)
- Webpack configured with `raw-loader` for markdown files
- Console statements stripped in production builds
