// ── Framework Pattern ──
export type FrameworkPattern =
  | 'state-graph'
  | 'role-based'
  | 'actor-model'
  | 'handoff'
  | 'sop-pipeline'
  | 'component-based'
  | 'visual-dag'
  | 'master-loop'
  | 'hub-and-spoke'
  | 'react-loop'
  | 'layered'

// ── Module Types ──
export type ModuleType =
  | 'core'       // Central runtime (State, AgentRuntime, Runner)
  | 'compute'    // Processing (Node, Agent, Action, Model)
  | 'routing'    // Flow control (Edges, Router, Handoff, Pub/Sub)
  | 'storage'    // Persistence (Checkpointer, Memory, Store, Session)
  | 'tool'       // Tool/Plugin integration
  | 'external'   // External system boundary

// ── Data Flow ──
export type DataFlowType =
  | 'sync'
  | 'async'
  | 'streaming'
  | 'conditional'
  | 'event'

export type DataFlowDirection = 'unidirectional' | 'bidirectional'

// ── Position ──
export interface ModulePosition {
  x: number
  y: number
}

// ── Module ──
export interface ArchitectureModule {
  id: string
  name: string
  type: ModuleType
  description: string
  icon?: string
  position?: ModulePosition
  metadata?: Record<string, unknown>
}

// ── Data Flow Edge ──
export interface DataFlow {
  id: string
  from: string
  to: string
  label: string
  type: DataFlowType
  direction: DataFlowDirection
  metadata?: {
    protocol?: string
    description?: string
    [key: string]: unknown
  }
}

// ── Execution Flow ──
export interface ExecutionStep {
  moduleId: string
  action: string
  trigger?: string
  description: string
  isEntry?: boolean
  isExit?: boolean
}

export interface ExecutionPhase {
  id: string
  name: string
  description: string
  steps: ExecutionStep[]
  repeat?: 'once' | 'loop' | 'until-idle'
}

export interface ExecutionFlow {
  phases: ExecutionPhase[]
}

// ── Top-Level Document ──
export interface FrameworkMetadata {
  name: string
  version: string
  description: string
  url: string
  pattern: FrameworkPattern
  category?: string
}

export interface ArchitectureDefinition {
  version: '1.0'
  framework: FrameworkMetadata
  modules: ArchitectureModule[]
  dataFlows: DataFlow[]
  executionFlow: ExecutionFlow
}

// ── Parse Result ──
export interface ValidationError {
  path: string
  message: string
  severity: 'error' | 'warning'
}

export type ParseResult =
  | { ok: true; definition: ArchitectureDefinition; warnings: ValidationError[] }
  | { ok: false; errors: ValidationError[]; filename: string }
