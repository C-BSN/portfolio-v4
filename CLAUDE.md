# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Development server with Turbopack
npm run build      # Production build
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

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3, Framer Motion, Lenis smooth scroll.

**Deployment:** Docker (multi-stage build, Node 22 Alpine). Managed via Dokploy on VPS.

### Content System
Content is fully file-based via Markdown + YAML frontmatter in `/content/`:
- `/content/pages/` — Static page content (homepage, about)
- `/content/projects/` — Portfolio project entries

`/src/lib/content.ts` reads these at build time using `gray-matter` and exposes typed helpers: `getPageData()`, `getProjectData()`, `getFeaturedProjects()`. Filenames become URL slugs.

### Routing
App Router directory-based routing under `/src/app/`. Each route has two files:
- `page.tsx` — Server component (data fetching, `generateStaticParams`, `generateMetadata`)
- `page-manga.tsx` — Client component (`'use client'`) with the actual UI, receives data as props

Dynamic project pages at `/projects/[slug]/` are statically generated from markdown filenames.

### Components
- `/src/components/manga/` — Core design components (Hero, ProjectCard, StackMarquee, SmoothScroll wrapper)
- `/src/components/effects/` — Visual effects (NeonTitle, CursorGlow, LightningEffect, RainEffect, SkyEffect)
- `/src/components/layout/` — Header/footer (`header-manga.tsx` and `footer-manga.tsx` are the active ones)
- `/src/components/ui/` — Active shadcn/Radix UI primitives (badge, button, card, dialog, input, label, pdf-viewer, project-gallery, select, separator, sheet, skeleton, toggle, tooltip, and custom gallery/project components)

`Providers.tsx` wraps the app with `next-themes`. `GlobalEffectsWrapper.tsx` lazy-loads `GlobalEffects.tsx` (SSR disabled for performance).

### API
Single API route at `/src/app/api/contact/route.ts` — POST endpoint using the **Resend** email service.
- Requires `RESEND_API_KEY` env var (see `.env.example`)
- Uses a **lazy singleton** pattern: Resend is instantiated on first request, never at module load (avoids build-time errors when the env var is absent)

### Styling
- CSS variables for theming in `src/app/globals.css`
- Tailwind with class-based dark mode (`tailwind.config.js`)
- Framer Motion for component animations
- Lenis (via `SmoothScroll.tsx`) for smooth page scrolling

### Build Notes
- No `output: 'export'` — app uses API routes (contact form), requires Node server
- Next.js image optimization is **disabled** (`unoptimized: true`)
- Turbopack used for both dev and build (`turbopack: {}` in `next.config.ts`)
- Console statements stripped in production builds
