import { describe, it, expect } from 'vitest'
import { architectureToReactFlow } from '../../src/lib/mapper'
import type { ArchitectureDefinition } from '../../src/types/architecture'

const sampleDef: ArchitectureDefinition = {
  version: '1.0',
  framework: {
    name: 'Test',
    version: '1.0',
    description: 'Test framework',
    url: 'https://example.com',
    pattern: 'handoff',
  },
  modules: [
    { id: 'agent', name: 'Agent', type: 'compute', description: 'LLM agent' },
    { id: 'handoff', name: 'Handoff', type: 'routing', description: 'Transfer' },
    { id: 'session', name: 'Session', type: 'storage', description: 'Store' },
  ],
  dataFlows: [
    {
      id: 'f1',
      from: 'agent',
      to: 'handoff',
      label: 'delegate',
      type: 'sync',
      direction: 'unidirectional',
    },
  ],
  executionFlow: {
    phases: [
      {
        id: 'p1',
        name: 'Main',
        description: 'Main',
        steps: [{ moduleId: 'agent', action: 'run', description: 'Run' }],
      },
    ],
  },
}

describe('architectureToReactFlow', () => {
  it('creates correct number of nodes', () => {
    const { nodes } = architectureToReactFlow(sampleDef)
    expect(nodes).toHaveLength(3)
  })

  it('creates correct number of edges', () => {
    const { edges } = architectureToReactFlow(sampleDef)
    expect(edges).toHaveLength(1)
  })

  it('assigns correct node ids', () => {
    const { nodes } = architectureToReactFlow(sampleDef)
    const ids = nodes.map((n) => n.id).sort()
    expect(ids).toEqual(['agent', 'handoff', 'session'])
  })

  it('assigns correct edge source and target', () => {
    const { edges } = architectureToReactFlow(sampleDef)
    expect(edges[0].source).toBe('agent')
    expect(edges[0].target).toBe('handoff')
  })

  it('captures module data in node data', () => {
    const { nodes } = architectureToReactFlow(sampleDef)
    const agentNode = nodes.find((n) => n.id === 'agent')
    expect(agentNode?.data.module.name).toBe('Agent')
    expect(agentNode?.data.module.type).toBe('compute')
    expect(agentNode?.data.isActive).toBe(false)
  })

  it('captures flow data in edge data', () => {
    const { edges } = architectureToReactFlow(sampleDef)
    expect(edges[0].data?.flow.label).toBe('delegate')
    expect(edges[0].data?.flow.type).toBe('sync')
    expect(edges[0].data?.isActive).toBe(false)
  })

  it('maps module types to node types correctly', () => {
    const { nodes } = architectureToReactFlow(sampleDef)
    expect(nodes[0].type).toBe('agent-node')   // compute
    expect(nodes[1].type).toBe('routing-node') // routing
    expect(nodes[2].type).toBe('store-node')   // storage
  })

  it('auto-layouts nodes with positions', () => {
    const { nodes } = architectureToReactFlow(sampleDef)
    for (const node of nodes) {
      expect(node.position).toBeDefined()
      expect(typeof node.position.x).toBe('number')
      expect(typeof node.position.y).toBe('number')
    }
  })
})
