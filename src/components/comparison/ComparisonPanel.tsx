import React, { useMemo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import BaseNode from '../canvas/nodes/BaseNode'
import DataFlowEdge from '../canvas/edges/DataFlowEdge'
import { architectureToReactFlow } from '../../lib/mapper'
import type { ArchitectureDefinition } from '../../types/architecture'
import type { FrameworkEntry } from '../../data/frameworks'

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

export interface ComparisonPanelProps {
  architecture: ArchitectureDefinition
  framework: FrameworkEntry
  label: string
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ architecture, framework, label }) => {
  const { nodes, edges } = useMemo(
    () => architectureToReactFlow(architecture),
    [architecture],
  )

  const defaultViewport = useMemo(() => ({ x: 20, y: 20, zoom: 0.8 }), [])

  return (
    <div className="flex h-full flex-col">
      {/* Panel header */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-1.5 dark:border-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: framework.color }}
        />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {framework.name}
        </span>
        <span className="ml-auto text-[10px] text-slate-400">
          {architecture.modules.length}m · {architecture.dataFlows.length}f
        </span>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={defaultViewport}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
            deleteKeyCode={null}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={12}
              size={0.5}
              color="var(--color-slate-300)"
              className="dark:opacity-20"
            />
            <MiniMap
              className="!rounded !border !border-slate-200 !bg-white !shadow-sm dark:!border-slate-700 dark:!bg-slate-800"
              position="bottom-right"
              pannable
              zoomable
              nodeColor={(node) => {
                const type = (node.data as { module?: { type: string } })?.module?.type
                switch (type) {
                  case 'core': return '#a855f7'
                  case 'compute': return '#3b82f6'
                  case 'routing': return '#f59e0b'
                  case 'storage': return '#10b981'
                  case 'tool': return '#f43f5e'
                  case 'external': return '#94a3b8'
                  default: return '#6b7280'
                }
              }}
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  )
}

export default ComparisonPanel
