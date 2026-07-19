import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { moduleTypeColors, moduleTypeIcons } from '../../lib/color-palette'
import type { ModuleType } from '../../types/architecture'
import {
  Cpu,
  Brain,
  GitBranch,
  Database,
  Wrench,
  Globe,
  ChevronDown,
  ChevronUp,
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

const moduleTypes: { type: ModuleType; label: string }[] = [
  { type: 'core', label: 'Core' },
  { type: 'compute', label: 'Compute / Agent' },
  { type: 'routing', label: 'Routing' },
  { type: 'storage', label: 'Storage' },
  { type: 'tool', label: 'Tool' },
  { type: 'external', label: 'External' },
]

const CanvasLegend: React.FC = () => {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* Toggle header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <span>Module Types</span>
          {expanded ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
        </button>

        {/* Legend items */}
        {expanded && (
          <div className="flex flex-wrap items-center gap-1 px-3 pb-2">
            {moduleTypes.map(({ type, label }) => {
              const colors = moduleTypeColors[type]
              const iconName = moduleTypeIcons[type]
              const Icon = iconMap[iconName] ?? Cpu
              return (
                <span
                  key={type}
                  className={cn(
                    'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium',
                    colors.badge,
                  )}
                  title={label}
                >
                  <Icon className="size-2.5" />
                  {label}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CanvasLegend
