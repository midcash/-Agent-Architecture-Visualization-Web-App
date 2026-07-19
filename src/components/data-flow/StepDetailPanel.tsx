import React from 'react'
import { useAnimationStore } from '../../store/useAnimationStore'
import { useArchitectureStore } from '../../store/useArchitectureStore'
import { cn } from '../../utils/cn'
import { moduleTypeColors, moduleTypeIcons } from '../../lib/color-palette'
import {
  Cpu, Brain, GitBranch, Database, Wrench, Globe,
  Play, ArrowRight, type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = { Cpu, Brain, GitBranch, Database, Wrench, Globe }

const StepDetailPanel: React.FC = () => {
  const currentPhaseIndex = useAnimationStore((s) => s.currentPhaseIndex)
  const currentStepIndex = useAnimationStore((s) => s.currentStepIndex)
  const playbackState = useAnimationStore((s) => s.playbackState)
  const architecture = useArchitectureStore((s) => s.architecture)

  if (!architecture || playbackState === 'idle') return null

  const phase = architecture.executionFlow.phases[currentPhaseIndex]
  if (!phase) return null

  const step = phase.steps[currentStepIndex]
  if (!step) return null

  const module = architecture.modules.find((m) => m.id === step.moduleId)
  if (!module) return null

  const colors = moduleTypeColors[module.type]
  const iconName = moduleTypeIcons[module.type]
  const Icon = iconMap[iconName] ?? Cpu
  const isEntry = step.isEntry

  return (
    <div className="absolute left-4 top-14 z-10 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {/* Phase name */}
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <Play className="size-3" />
        {phase.name}
        {phase.repeat && (
          <span className="rounded bg-amber-100 px-1 py-px text-[9px] text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            {phase.repeat}
          </span>
        )}
      </div>

      {/* Step header */}
      <div className="mb-2 flex items-center gap-2">
        <div
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-md',
            colors.badge,
          )}
        >
          <Icon className="size-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {step.action}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {module.name}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        {step.description}
      </p>

      {/* Trigger */}
      {step.trigger && (
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-slate-50 p-2 dark:bg-slate-900">
          <ArrowRight className="mt-0.5 size-3 shrink-0 text-slate-400" />
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-600 dark:text-slate-300">Trigger: </span>
            {step.trigger}
          </span>
        </div>
      )}

      {/* Entry point badge */}
      {isEntry && (
        <div className="mt-2">
          <span className="inline-block rounded bg-green-100 px-1.5 py-px text-[10px] font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
            Entry Point
          </span>
        </div>
      )}

      {/* Module info */}
      <div className="mt-2 flex items-center gap-1">
        <span
          className={cn(
            'inline-block rounded px-1.5 py-px text-[10px] font-medium',
            colors.badge,
          )}
        >
          {module.type}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          Step {currentStepIndex + 1}/{phase.steps.length}
        </span>
      </div>
    </div>
  )
}

export default StepDetailPanel
