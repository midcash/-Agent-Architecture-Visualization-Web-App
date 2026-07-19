# Coding Conventions

## TypeScript
- Strict mode enabled — no `any` unless absolutely necessary (use `unknown` instead)
- Prefer `const` over `let`; avoid `var`
- Use type inference where obvious; explicit types at function boundaries
- `verbatimModuleSyntax` is on — use `import type` for type-only imports
- All files use ES module syntax (`.ts` / `.tsx`)

## Naming
- **Files**: kebab-case (`animation-engine.ts`, `use-architecture-store.ts`)
- **Components**: PascalCase (`ArchitectureCanvas.tsx`, `ModuleNode.tsx`)
- **Hooks**: camelCase prefixed with `use` (`useAnimationPlayer.ts`)
- **Utilities**: camelCase (`cn.ts`, `parser.ts`)
- **Types/Interfaces**: PascalCase, no `I` prefix (`ArchitectureModule`, `DataFlow`)

## Imports
- Use `@/` path alias for all src-internal imports
- Group imports: React/Vite → third-party → `@/` local → relative
- React imports first, then libs, then project files

## Components
- Functional components only, no class components
- Wrap exported components in `React.memo` when they receive props from parent
- Define `nodeTypes` and `edgeTypes` objects OUTSIDE the component body (React Flow requirement)
- Use `nodrag` className on interactive elements inside custom nodes

## React Flow
- Always `React.memo` custom nodes and edges
- Never mutate node/edge state directly — use store actions
- Define `nodeTypes` / `edgeTypes` as stable references outside component render
- Use `Handle` components for connection points in custom nodes
