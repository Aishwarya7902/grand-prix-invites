# Project Overview

A TanStack Start (React 19 + Vite 8) SSR web app, originally created with Lovable. Styled with Tailwind CSS v4, shadcn/ui (Radix), and uses TanStack Router/Query.

## Setup

- Package manager: **bun** (bun.lock, bunfig.toml with 24h supply-chain guard)
- Dev: `bun run dev` (Vite dev server on 0.0.0.0:5000, all hosts allowed — configured in `vite.config.ts`)
- Build: `bun run build` — nitro preset set to `node-server` (Lovable default is cloudflare; changed for Replit deployment)
- Production: `node .output/server/index.mjs` (respects `PORT` env)
- Deployment: autoscale, build `bun run build`, run `node .output/server/index.mjs`

## Layout

- `src/routes/` — file-based routes (TanStack Router), `routeTree.gen.ts` is generated
- `src/components/`, `src/lib/`, `src/hooks/` — standard shadcn structure
- `vite.config.ts` — wraps `@lovable.dev/vite-tanstack-config`; do not re-add plugins it already includes

## User Preferences

(none recorded yet)
