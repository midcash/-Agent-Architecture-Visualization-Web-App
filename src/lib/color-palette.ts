import type { ModuleType, DataFlowType } from '../types/architecture'

// Module type → Tailwind classes for node styling
export const moduleTypeColors: Record<ModuleType, {
  bg: string
  border: string
  text: string
  icon: string
  badge: string
}> = {
  core: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-400 dark:border-purple-600',
    text: 'text-purple-900 dark:text-purple-100',
    icon: 'text-purple-500',
    badge: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  },
  compute: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-400 dark:border-blue-600',
    text: 'text-blue-900 dark:text-blue-100',
    icon: 'text-blue-500',
    badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  },
  routing: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-400 dark:border-amber-600',
    text: 'text-amber-900 dark:text-amber-100',
    icon: 'text-amber-500',
    badge: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  },
  storage: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-400 dark:border-emerald-600',
    text: 'text-emerald-900 dark:text-emerald-100',
    icon: 'text-emerald-500',
    badge: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  },
  tool: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-400 dark:border-rose-600',
    text: 'text-rose-900 dark:text-rose-100',
    icon: 'text-rose-500',
    badge: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300',
  },
  external: {
    bg: 'bg-slate-50 dark:bg-slate-900/40',
    border: 'border-slate-300 dark:border-slate-600 border-dashed',
    text: 'text-slate-700 dark:text-slate-300',
    icon: 'text-slate-400',
    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  },
}

// Data flow type → edge styling
export const flowTypeStyles: Record<DataFlowType, {
  stroke: string
  dashArray?: string
  animationColor: string
}> = {
  sync: {
    stroke: '#6b7280',
    animationColor: '#6b7280',
  },
  async: {
    stroke: '#f59e0b',
    dashArray: '8 4',
    animationColor: '#f59e0b',
  },
  streaming: {
    stroke: '#3b82f6',
    animationColor: '#60a5fa',
  },
  conditional: {
    stroke: '#ef4444',
    dashArray: '4 4',
    animationColor: '#ef4444',
  },
  event: {
    stroke: '#a855f7',
    dashArray: '2 4',
    animationColor: '#a855f7',
  },
}

// Framework pattern → accent color for comparison view tinting
export const frameworkColors: Record<string, string> = {
  langgraph: '#7c3aed',
  crewai: '#2563eb',
  autogen: '#0891b2',
  'openai-agents-sdk': '#10b981',
  metagpt: '#f59e0b',
  agno: '#ec4899',
  dify: '#6366f1',
}

// Module type → Lucide icon name
export const moduleTypeIcons: Record<ModuleType, string> = {
  core: 'Cpu',
  compute: 'Brain',
  routing: 'GitBranch',
  storage: 'Database',
  tool: 'Wrench',
  external: 'Globe',
}
