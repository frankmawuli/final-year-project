# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run format     # Prettier auto-format all .ts/.tsx files
npm run typecheck  # TypeScript type checking (tsc --noEmit)
```

## Architecture

This is a **Next.js App Router** project using TypeScript, Tailwind CSS v4, and shadcn/ui.

- `app/` — App Router pages and layouts. `layout.tsx` wraps the app in `ThemeProvider`.
- `components/ui/` — shadcn/ui components. Add new ones via `npx shadcn@latest add <component>`.
- `components/theme-provider.tsx` — next-themes wrapper; also registers a `d` hotkey to toggle dark/light mode (skips if focus is in an input).
- `lib/utils.ts` — exports `cn()` (clsx + tailwind-merge) for combining Tailwind classes.
- `hooks/` — custom React hooks (empty by default).

## Styling

Tailwind CSS v4 with CSS variables in OKLCH color space. Light/dark tokens are defined in `app/globals.css` (`:root` and `.dark`). Use `cn()` from `lib/utils.ts` whenever merging conditional class strings. Prettier is configured to auto-sort Tailwind classes (functions: `cn`, `cva`).

## shadcn/ui

Config is in `components.json`. Style: `radix-nova`. RSC enabled. Icons: lucide-react. Variants are managed with `class-variance-authority` (`cva`). Use the `asChild` prop (Radix Slot) for polymorphic rendering.

## Path Aliases

`@/*` maps to the repository root. Use `@/components`, `@/lib`, `@/hooks`, etc.
