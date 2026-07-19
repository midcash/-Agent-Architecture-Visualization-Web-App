# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Agent ArchViz** — AI Agent 架构可视化 Web 应用，用于横向对比和学习主流 AI Agent 框架的架构设计。

- **Tech Stack**: React 19 + TypeScript 6 + Vite 8 + Tailwind CSS v4 + shadcn/ui
- **Diagram Engine**: @xyflow/react v12 (React Flow)
- **State**: zustand
- **Validation**: zod
- **Testing**: vitest + @testing-library/react

## Commands

```bash
npm run dev          # Start dev server (Vite HMR)
npm run build        # Type check + production build
npm run preview      # Preview production build locally
npm test             # Run all tests (vitest run)
npm run test:watch   # Watch mode
npm run test:coverage# Coverage report
npm run typecheck    # TypeScript check only (no emit)
npm run lint         # oxlint fast linting
```

## Architecture Overview

```
User uploads JSON/YAML → Parser (js-yaml + Zod validation)
  → Mapper (ArchitectureDef → React Flow {nodes, edges})
  → ArchitectureCanvas (React Flow with custom nodes/edges)
  → AnimationEngine (timeline-driven execution flow)
```

### Data Pipeline
1. **Architecture JSON files** live in `public/architectures/` (7 frameworks)
2. **`src/types/architecture.ts`** — core TypeScript types
3. **`src/schemas/architecture.schema.ts`** — Zod schemas (single source of truth for types)
4. **`src/lib/parser.ts`** — validates and parses JSON/YAML into `ArchitectureDefinition`
5. **`src/lib/mapper.ts`** — transforms `ArchitectureDefinition` → React Flow `{nodes, edges}`
6. **`src/lib/animation-engine.ts`** — timeline-based execution flow player

### State Management (3 Zustand stores)
- **`useArchitectureStore`** — current architecture + React Flow nodes/edges/viewport
- **`useComparisonStore`** — left/right panel framework selection + sync settings
- **`useAnimationStore`** — playback state, active elements, speed

### Component Tree
```
App
├── AppShell
│   ├── Header (title, mode toggle, theme toggle)
│   ├── Sidebar (framework list, import/export)
│   └── Main Content
│       ├── ArchitectureCanvas (single view)
│       │   ├── CanvasToolbar
│       │   ├── CanvasLegend
│       │   ├── Custom Nodes (ModuleNode, AgentNode, StoreNode, ToolNode, ExternalNode)
│       │   ├── Custom Edges (DataFlowEdge, AnimatedFlowEdge, ConditionalEdge)
│       │   └── DataPacketOverlay (animation)
│       ├── ComparisonView (side-by-side)
│       │   ├── ComparisonPanel (×2)
│       │   └── FrameworkSelector
│       └── Data Flow Panel
│           ├── PlaybackControls
│           ├── FlowTimeline
│           └── StepDetailPanel
```

## Key Patterns

- **Zod is the type source of truth** — TS types from `z.infer<typeof schema>`, no manual sync
- **All imports use `@/` alias** mapped to `./src/`
- **React Flow `nodeTypes`/`edgeTypes`** defined outside component body (stable refs)
- **`React.memo`** on all custom nodes and edges
- **`nodrag` className** on interactive elements inside custom nodes
- **`cn()` utility** (`clsx` + `tailwind-merge`) for all conditional classes
- **Architecture files as static assets** in `/public/` — fetchable at runtime

## Architecture Definition Schema

7 frameworks defined in `public/architectures/`:

| Framework | Pattern | Key Flow |
|---|---|---|
| LangGraph | state-graph | State ↔ Node (Pregel super-steps) |
| CrewAI | role-based | Flow → Crew → Agent → Task → Tool |
| AutoGen | actor-model | AgentRuntime → Pub/Sub → GroupChat |
| OpenAI Agents SDK | handoff | Runner → Agent → Handoff → Agent |
| MetaGPT | sop-pipeline | Environment → Role → observe→think→act |
| Agno | component-based | Agent → Model/Tools/Knowledge/Memory |
| Dify | visual-dag | Canvas → DAG Engine → Node Executor |

## Rules

Additional guidance in `.claude/rules/`:
- `coding-conventions.md` — TypeScript strict, naming, import order
- `tailwind-shadcn.md` — Tailwind v4 patterns, `cn()` usage, theme tokens
- `react-flow.md` — memo rules, node/edge design, performance
- `testing.md` — vitest setup, assertion patterns, coverage targets
- `architecture-schema.md` — schema versioning, adding frameworks, cross-field validation
