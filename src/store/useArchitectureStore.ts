import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Node,
  type Edge,
} from '@xyflow/react'
import type { ArchitectureDefinition } from '../types/architecture'
import type { ModuleNodeData, DataFlowEdgeData } from '../types/react-flow'
import type { FrameworkEntry } from '../data/frameworks'
import { architectureToReactFlow } from '../lib/mapper'

export interface ArchitectureStore {
  /** Currently loaded architecture definition */
  architecture: ArchitectureDefinition | null
  /** Framework metadata for the current architecture */
  framework: FrameworkEntry | null
  /** React Flow nodes */
  nodes: Node<ModuleNodeData>[]
  /** React Flow edges */
  edges: Edge<DataFlowEdgeData>[]
  /** Loading state */
  isLoading: boolean
  /** Error message */
  error: string | null

  // Actions
  loadArchitecture: (def: ArchitectureDefinition, framework?: FrameworkEntry) => void
  setNodes: (nodes: Node<ModuleNodeData>[]) => void
  setEdges: (edges: Edge<DataFlowEdgeData>[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  setNodeActive: (nodeId: string, active: boolean) => void
  setEdgeActive: (edgeId: string, active: boolean) => void
  dimAllExcept: (activeNodeIds: Set<string>) => void
  clearDimming: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useArchitectureStore = create<ArchitectureStore>((set, get) => ({
  architecture: null,
  framework: null,
  nodes: [],
  edges: [],
  isLoading: false,
  error: null,

  loadArchitecture: (def, framework) => {
    const { nodes, edges } = architectureToReactFlow(def)
    set({
      architecture: def,
      framework: framework ?? null,
      nodes,
      edges,
      isLoading: false,
      error: null,
    })
  },

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<ModuleNodeData>[] })
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) as Edge<DataFlowEdgeData>[] })
  },

  setNodeActive: (nodeId, active) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, isActive: active } } : n,
      ),
    })
  },

  setEdgeActive: (edgeId, active) => {
    set({
      edges: get().edges.map((e) =>
        e.id === edgeId
          ? { ...e, data: { ...e.data, isActive: active } as DataFlowEdgeData }
          : e,
      ),
    })
  },

  dimAllExcept: (activeNodeIds) => {
    set({
      nodes: get().nodes.map((n) => ({
        ...n,
        data: { ...n.data, isDimmed: !activeNodeIds.has(n.id) },
      })),
    })
  },

  clearDimming: () => {
    set({
      nodes: get().nodes.map((n) => ({
        ...n,
        data: { ...n.data, isActive: false, isDimmed: false },
      })),
      edges: get().edges.map((e) => ({
        ...e,
        data: { ...e.data, isActive: false, animationProgress: 0 } as DataFlowEdgeData,
      })),
    })
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      architecture: null,
      framework: null,
      nodes: [],
      edges: [],
      isLoading: false,
      error: null,
    }),
}))
