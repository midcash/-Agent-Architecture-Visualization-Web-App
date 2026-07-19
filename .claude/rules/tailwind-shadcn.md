# Tailwind CSS v4 + shadcn/ui Conventions

## Tailwind v4
- No `tailwind.config.js` — all configuration in `src/index.css` via `@theme inline`
- CSS-first configuration pattern: theme tokens in CSS, not JS
- Use `@import 'tailwindcss'` in index.css (no PostCSS config needed)
- Dark mode: `.dark` class strategy, toggle via `class` on `<html>`

## Class Merging
- Always use the `cn()` utility from `@/utils/cn` for conditional classes
- `cn()` wraps `clsx` + `tailwind-merge` to resolve conflicts
- Example: `cn('px-4 py-2', isActive && 'bg-blue-500', className)`

## shadcn/ui
- Components live in `src/components/ui/` and are NOT manually edited
- Use `npx shadcn@canary add <component>` to add new primitives
- shadcn components use `data-slot` attributes for styling hooks
- Theme via CSS variables — do not hardcode colors in shadcn components

## Spacing & Sizing
- Prefer `size-*` utility (sets both width and height) over separate `w-* h-*`
- Use Tailwind's built-in breakpoints: `sm` (640), `md` (768), `lg` (1024), `xl` (1280)
- React Flow canvas should use `w-full h-full` or absolute positioning

## Color Palette
- Node colors defined in `@/lib/color-palette.ts` as Tailwind-compatible classes
- Module types map to distinct semantic colors
- Framework comparison uses tint variations per framework
