import type { Node, Edge } from '@xyflow/react'
import type { ArchitectureModule, DataFlow } from './architecture'

export interface ModuleNodeData extends Record<string, unknown> {
  module: ArchitectureModule
  isActive: boolean
  isDimmed: boolean
}

export interface DataFlowEdgeData extends Record<string, unknown> {
  flow: DataFlow
  isActive: boolean
  animationProgress: number
}

export type ModuleNode = Node<ModuleNodeData, 'module'>
export type FlowEdge = Edge<DataFlowEdgeData, 'data-flow'>
