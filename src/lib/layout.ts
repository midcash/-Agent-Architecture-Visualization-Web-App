import dagre from 'dagre'
import type { ArchitectureDefinition, ModulePosition } from '../types/architecture'

const NODE_WIDTH = 200
const NODE_HEIGHT = 80
const H_SPACING = 80
const V_SPACING = 60

export function autoLayout(def: ArchitectureDefinition): Map<string, ModulePosition> {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: 'TB',
    nodesep: H_SPACING,
    ranksep: V_SPACING,
    marginx: 40,
    marginy: 40,
  })

  // Add nodes
  for (const mod of def.modules) {
    g.setNode(mod.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }

  // Add edges
  for (const flow of def.dataFlows) {
    g.setEdge(flow.from, flow.to)
  }

  // Run layout
  dagre.layout(g)

  // Extract positions
  const positions = new Map<string, ModulePosition>()
  for (const mod of def.modules) {
    const node = g.node(mod.id)
    if (node) {
      positions.set(mod.id, {
        x: node.x - NODE_WIDTH / 2,
        y: node.y - NODE_HEIGHT / 2,
      })
    }
  }

  return positions
}
