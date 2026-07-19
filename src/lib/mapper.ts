import type { Node, Edge } from '@xyflow/react'
import type { ArchitectureDefinition } from '../types/architecture'
import type { ModuleNodeData, DataFlowEdgeData } from '../types/react-flow'
import { autoLayout } from './layout'

export function architectureToReactFlow(
  def: ArchitectureDefinition,
): { nodes: Node<ModuleNodeData>[]; edges: Edge<DataFlowEdgeData>[] } {
  // Determine positions: use defined positions or auto-layout
  const hasPositions = def.modules.some((m) => m.position)
  const positions = hasPositions
    ? new Map(def.modules.filter((m) => m.position).map((m) => [m.id, m.position!]))
    : autoLayout(def)

  const nodes: Node<ModuleNodeData>[] = def.modules.map((mod) => {
    const pos = positions.get(mod.id) ?? { x: 0, y: 0 }
    return {
      id: mod.id,
      type: resolveNodeType(mod.type),
      position: pos,
      data: {
        module: mod,
        isActive: false,
        isDimmed: false,
      },
    }
  })

  const edges: Edge<DataFlowEdgeData>[] = def.dataFlows.map((flow) => ({
    id: flow.id,
    source: flow.from,
    target: flow.to,
    type: 'data-flow',
    animated: flow.type === 'streaming',
    data: {
      flow,
      isActive: false,
      animationProgress: 0,
    },
  }))

  return { nodes, edges }
}

function resolveNodeType(modType: string): string {
  switch (modType) {
    case 'compute':
      return 'agent-node'
    case 'routing':
      return 'routing-node'
    case 'storage':
      return 'store-node'
    case 'tool':
      return 'tool-node'
    case 'external':
      return 'external-node'
    default:
      return 'module-node'
  }
}
