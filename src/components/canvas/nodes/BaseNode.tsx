import React from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import { cn } from '../../../utils/cn'
import { moduleTypeColors, moduleTypeIcons } from '../../../lib/color-palette'
import type { ModuleNodeData } from '../../../types/react-flow'
import {
  Cpu,
  Brain,
  GitBranch,
  Database,
  Wrench,
  Globe,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Cpu,
  Brain,
  GitBranch,
  Database,
  Wrench,
  Globe,
}

const BaseNode: React.FC<NodeProps<Node<ModuleNodeData>>> = ({ data, selected }) => {
  const { module, isActive, isDimmed } = data
  const colors = moduleTypeColors[module.type]
  const iconName = moduleTypeIcons[module.type]
  const Icon = iconMap[iconName] ?? Cpu

  return (
    <div
      className={cn(
        'relative min-w-[180px] max-w-[240px] rounded-lg border-2 shadow-sm transition-all duration-300',
        colors.bg,
        colors.border,
        isActive && 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg scale-105',
        isDimmed && 'opacity-30 scale-95',
        selected && 'ring-2 ring-offset-1 ring-offset-slate-100 dark:ring-offset-slate-900',
      )}
    >
      {/* Target handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!size-3 !border-2 !border-white dark:!border-slate-800 !bg-slate-400 dark:!bg-slate-500"
      />

      {/* Node content */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Icon */}
        <div
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-md',
            colors.badge,
          )}
        >
          <Icon className="size-4" />
        </div>

        {/* Name + type badge */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold leading-tight" title={module.name}>
            {module.name}
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <span
              className={cn(
                'inline-block rounded px-1.5 py-px text-[10px] font-medium uppercase tracking-wide',
                colors.badge,
              )}
            >
              {module.type}
            </span>
          </div>
        </div>
      </div>

      {/* Description tooltip — visible on group hover */}
      {module.description && (
        <div className="nodrag absolute left-full top-0 z-50 ml-2 hidden w-56 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {module.description}
        </div>
      )}

      {/* Source handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-3 !border-2 !border-white dark:!border-slate-800 !bg-slate-400 dark:!bg-slate-500"
      />
    </div>
  )
}

export default React.memo(BaseNode)
