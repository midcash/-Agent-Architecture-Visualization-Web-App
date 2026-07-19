import { describe, it, expect, beforeEach } from 'vitest'
import { useArchitectureStore } from '../../src/store/useArchitectureStore'
import type { ArchitectureDefinition } from '../../src/types/architecture'

function makeTestDef(): ArchitectureDefinition {
  return {
    version: '1.0' as const,
    framework: {
      name: 'Test',
      version: '1.0',
      description: 'Test',
      url: 'https://example.com',
      pattern: 'state-graph' as const,
      category: 'test',
    },
    modules: [
      { id: 'a', name: 'A', type: 'core', description: 'A' },
      { id: 'b', name: 'B', type: 'compute', description: 'B' },
    ],
    dataFlows: [
      { id: 'f1', from: 'a', to: 'b', label: 'A→B', type: 'sync', direction: 'unidirectional' },
    ],
    executionFlow: {
      phases: [
        {
          id: 'p1',
          name: 'Phase 1',
          description: 'First phase',
          steps: [
            { moduleId: 'a', action: 'init', description: 'Init A' },
            { moduleId: 'b', action: 'run', description: 'Run B' },
          ],
        },
      ],
    },
  }
}

describe('useArchitectureStore', () => {
  beforeEach(() => {
    useArchitectureStore.getState().reset()
  })

  it('starts with empty state', () => {
    const state = useArchitectureStore.getState()
    expect(state.architecture).toBeNull()
    expect(state.framework).toBeNull()
    expect(state.nodes).toHaveLength(0)
    expect(state.edges).toHaveLength(0)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('loads an architecture and generates nodes/edges', () => {
    const def = makeTestDef()
    useArchitectureStore.getState().loadArchitecture(def)

    const state = useArchitectureStore.getState()
    expect(state.architecture).not.toBeNull()
    expect(state.nodes).toHaveLength(2)
    expect(state.edges).toHaveLength(1)
    expect(state.isLoading).toBe(false)
  })

  it('loads architecture with framework metadata', () => {
    const def = makeTestDef()
    const fw = {
      id: 'test',
      name: 'Test FW',
      version: '1.0',
      description: 'Test',
      url: 'https://example.com',
      pattern: 'state-graph' as const,
      patternLabel: 'State Graph',
      category: 'test',
      file: 'test.json',
      color: '#000',
      moduleCount: 2,
      flowCount: 1,
      phaseCount: 1,
    }
    useArchitectureStore.getState().loadArchitecture(def, fw)

    const state = useArchitectureStore.getState()
    expect(state.framework).toEqual(fw)
  })

  it('sets node active state', () => {
    const def = makeTestDef()
    useArchitectureStore.getState().loadArchitecture(def)
    useArchitectureStore.getState().setNodeActive('a', true)

    const nodeA = useArchitectureStore.getState().nodes.find((n) => n.id === 'a')
    expect(nodeA?.data.isActive).toBe(true)
  })

  it('sets edge active state', () => {
    const def = makeTestDef()
    useArchitectureStore.getState().loadArchitecture(def)
    useArchitectureStore.getState().setEdgeActive('f1', true)

    const edge = useArchitectureStore.getState().edges.find((e) => e.id === 'f1')
    expect(edge?.data?.isActive).toBe(true)
  })

  it('dims all nodes except specified ones', () => {
    const def = makeTestDef()
    useArchitectureStore.getState().loadArchitecture(def)
    useArchitectureStore.getState().dimAllExcept(new Set(['a']))

    const nodes = useArchitectureStore.getState().nodes
    const a = nodes.find((n) => n.id === 'a')
    const b = nodes.find((n) => n.id === 'b')
    expect(a?.data.isDimmed).toBe(false)
    expect(b?.data.isDimmed).toBe(true)
  })

  it('clears dimming on all nodes and edges', () => {
    const def = makeTestDef()
    useArchitectureStore.getState().loadArchitecture(def)
    useArchitectureStore.getState().setNodeActive('a', true)
    useArchitectureStore.getState().setEdgeActive('f1', true)
    useArchitectureStore.getState().clearDimming()

    const nodes = useArchitectureStore.getState().nodes
    const edges = useArchitectureStore.getState().edges
    for (const n of nodes) {
      expect(n.data.isActive).toBe(false)
      expect(n.data.isDimmed).toBe(false)
    }
    for (const e of edges) {
      expect(e.data?.isActive).toBe(false)
      expect(e.data?.animationProgress).toBe(0)
    }
  })

  it('handles loading and error states', () => {
    useArchitectureStore.getState().setLoading(true)
    expect(useArchitectureStore.getState().isLoading).toBe(true)

    useArchitectureStore.getState().setError('Test error')
    expect(useArchitectureStore.getState().error).toBe('Test error')

    useArchitectureStore.getState().setError(null)
    expect(useArchitectureStore.getState().error).toBeNull()
  })

  it('resets all state', () => {
    const def = makeTestDef()
    useArchitectureStore.getState().loadArchitecture(def)
    useArchitectureStore.getState().reset()

    const state = useArchitectureStore.getState()
    expect(state.architecture).toBeNull()
    expect(state.nodes).toHaveLength(0)
    expect(state.edges).toHaveLength(0)
  })
})
