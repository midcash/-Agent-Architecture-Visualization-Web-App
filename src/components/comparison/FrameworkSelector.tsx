import React from 'react'
import { frameworks } from '../../data/frameworks'

export interface FrameworkSelectorProps {
  value: string | null
  onChange: (id: string) => void
  placeholder?: string
}

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select framework...',
}) => {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="nodrag w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-blue-500"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {frameworks.map((fw) => (
        <option key={fw.id} value={fw.id}>
          {fw.name} — {fw.patternLabel}
        </option>
      ))}
    </select>
  )
}

export default FrameworkSelector
