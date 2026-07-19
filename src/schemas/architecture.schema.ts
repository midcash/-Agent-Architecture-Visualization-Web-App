import { z } from 'zod'

// ── Primitives ──
const frameworkPatternSchema = z.enum([
  'state-graph',
  'role-based',
  'actor-model',
  'handoff',
  'sop-pipeline',
  'component-based',
  'visual-dag',
])

const moduleTypeSchema = z.enum([
  'core',
  'compute',
  'routing',
  'storage',
  'tool',
  'external',
])

const dataFlowTypeSchema = z.enum([
  'sync',
  'async',
  'streaming',
  'conditional',
  'event',
])

const dataFlowDirectionSchema = z.enum(['unidirectional', 'bidirectional'])

// ── Module ──
const modulePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
})

export const architectureModuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: moduleTypeSchema,
  description: z.string().min(1),
  icon: z.string().optional(),
  position: modulePositionSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).strict()

// ── Data Flow ──
const dataFlowMetadataSchema = z.object({
  protocol: z.string().optional(),
  description: z.string().optional(),
}).passthrough()

export const dataFlowSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string().min(1),
  type: dataFlowTypeSchema,
  direction: dataFlowDirectionSchema,
  metadata: dataFlowMetadataSchema.optional(),
}).strict()

// ── Execution ──
const executionStepSchema = z.object({
  moduleId: z.string().min(1),
  action: z.string().min(1),
  trigger: z.string().optional(),
  description: z.string().min(1),
  isEntry: z.boolean().optional(),
  isExit: z.boolean().optional(),
}).strict()

const executionPhaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  steps: z.array(executionStepSchema).min(1),
  repeat: z.enum(['once', 'loop', 'until-idle']).optional(),
}).strict()

const executionFlowSchema = z.object({
  phases: z.array(executionPhaseSchema).min(1),
}).strict()

// ── Framework Metadata ──
const frameworkMetadataSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  pattern: frameworkPatternSchema,
  category: z.string().optional(),
}).strict()

// ── Top-Level Definition ──
export const architectureDefinitionSchema = z.object({
  version: z.literal('1.0'),
  framework: frameworkMetadataSchema,
  modules: z.array(architectureModuleSchema).min(1),
  dataFlows: z.array(dataFlowSchema).min(1),
  executionFlow: executionFlowSchema,
}).strict()
  .superRefine((def, ctx) => {
    // Cross-field: unique module IDs
    const moduleIds = new Set<string>()
    for (let i = 0; i < def.modules.length; i++) {
      const mid = def.modules[i].id
      if (moduleIds.has(mid)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate module id: "${mid}"`,
          path: ['modules', i, 'id'],
        })
      }
      moduleIds.add(mid)
    }

    // Cross-field: valid dataFlow from/to references
    for (let i = 0; i < def.dataFlows.length; i++) {
      const flow = def.dataFlows[i]
      if (!moduleIds.has(flow.from)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `DataFlow "${flow.id}" references unknown module "${flow.from}" in "from"`,
          path: ['dataFlows', i, 'from'],
        })
      }
      if (!moduleIds.has(flow.to)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `DataFlow "${flow.id}" references unknown module "${flow.to}" in "to"`,
          path: ['dataFlows', i, 'to'],
        })
      }
    }

    // Cross-field: valid execution step moduleId references
    for (let p = 0; p < def.executionFlow.phases.length; p++) {
      const phase = def.executionFlow.phases[p]
      for (let s = 0; s < phase.steps.length; s++) {
        const step = phase.steps[s]
        if (!moduleIds.has(step.moduleId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `ExecutionStep references unknown module "${step.moduleId}"`,
            path: ['executionFlow', 'phases', p, 'steps', s, 'moduleId'],
          })
        }
      }
    }
  })

// ── Derived Type ──
export type ArchitectureDefinition = z.infer<typeof architectureDefinitionSchema>
