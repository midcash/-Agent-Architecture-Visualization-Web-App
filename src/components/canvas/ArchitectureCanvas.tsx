import React, { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useArchitectureStore } from '../../store/useArchitectureStore'
import BaseNode from './nodes/BaseNode'
import DataFlowEdge from './edges/DataFlowEdge'
import CanvasToolbar from './CanvasToolbar'
import CanvasLegend from './CanvasLegend'

// Stable references — defined outside component body
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes = {
  'module-node': BaseNode,
  'agent-node': BaseNode,
  'routing-node': BaseNode,
  'store-node': BaseNode,
  'tool-node': BaseNode,
  'external-node': BaseNode,
} as unknown as NodeTypes

const edgeTypes = {
  'data-flow': DataFlowEdge,
} as unknown as EdgeTypes

const ArchitectureCanvas: React.FC = () => {
  const nodes = useArchitectureStore((s) => s.nodes)
  const edges = useArchitectureStore((s) => s.edges)
  const onNodesChange = useArchitectureStore((s) => s.onNodesChange)
  const onEdgesChange = useArchitectureStore((s) => s.onEdgesChange)
  const architecture = useArchitectureStore((s) => s.architecture)

  const defaultViewport = useMemo(() => ({ x: 50, y: 50, zoom: 1 }), [])

  if (!architecture) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mb-3 text-5xl">🏗️</div>
          <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-400">
            No Architecture Loaded
          </h2>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            Select a framework from the sidebar or import a JSON/YAML file.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="var(--color-slate-300)"
          className="dark:opacity-30"
        />
        <Controls
          className="!rounded-lg !border !border-slate-200 !bg-white !shadow-sm dark:!border-slate-700 dark:!bg-slate-800"
          position="bottom-right"
        />
        <MiniMap
          className="!rounded-lg !border !border-slate-200 !bg-white !shadow-sm dark:!border-slate-700 dark:!bg-slate-800"
          position="bottom-left"
          pannable
          zoomable
          nodeColor={(node) => {
            const type = (node.data as { module?: { type: string } })?.module?.type
            switch (type) {
              case 'core':     return '#a855f7'
              case 'compute':  return '#3b82f6'
              case 'routing':  return '#f59e0b'
              case 'storage':  return '#10b981'
              case 'tool':     return '#f43f5e'
              case 'external': return '#94a3b8'
              default:         return '#6b7280'
            }
          }}
        />
      </ReactFlow>

      {/* Toolbar */}
      <CanvasToolbar />

      {/* Legend */}
      <CanvasLegend />
    </div>
  )
}

export default ArchitectureCanvas
