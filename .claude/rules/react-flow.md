# React Flow v12 Patterns

## Critical Rules
1. **Memo all custom nodes/edges** — wrap with `React.memo()` to prevent cascading re-renders
2. **Stable `nodeTypes`/`edgeTypes`** — define OUTSIDE component body, never inline
3. **Never mutate state** — always use `onNodesChange`/`onEdgesChange` callbacks from the store
4. **`nodrag` class** — add to any interactive element (buttons, inputs, selects) inside custom nodes
5. **Handle components** — use `<Handle type="target">` and `<Handle type="source">` for connection points

## Node Design
- All custom nodes extend React Flow's `Node` type with custom `data` generic
- Use `NodeProps<CustomNodeData>` from React Flow for props typing
- Active state: `data.isActive && 'ring-2 ring-blue-500 shadow-lg'`
- Dimmed state: `data.isDimmed && 'opacity-30'`

## Edge Design  
- Custom edges use `getSmoothStepPath()` or `getBezierPath()` from `@xyflow/react`
- Edge labels rendered via `EdgeLabelRenderer` (React portal for SVG foreignObject)
- Animation: SVG `<animateMotion>` with a small circle for data packet visualization
- Edge paths must be memoized to prevent layout recalculations

## Performance
- `onlyRenderVisibleElements` for large architectures (the default in v12)
- Avoid subscribing to full node/edge arrays in zustand selectors — select specific fields
- `React.memo` on custom nodes + `useMemo` for computed values
- For comparison view (2 canvases): each instance independently managed
