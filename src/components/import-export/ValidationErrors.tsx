import React from 'react'
import { AlertTriangle, XCircle, Info } from 'lucide-react'
import type { ValidationError as ValidationErrorType } from '../../types/architecture'

export interface ValidationErrorsProps {
  errors: ValidationErrorType[]
  warnings?: ValidationErrorType[]
  onDismiss?: () => void
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors, warnings, onDismiss }) => {
  if (errors.length === 0 && (!warnings || warnings.length === 0)) return null

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/40">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <XCircle className="size-4 text-red-500" />
          <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
            {errors.length > 0
              ? `${errors.length} Validation Error${errors.length > 1 ? 's' : ''}`
              : 'Warnings'}
          </h4>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded p-0.5 text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <XCircle className="size-3.5" />
          </button>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <ul className="space-y-1">
          {errors.map((err, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs">
              <AlertTriangle className="mt-0.5 size-3 shrink-0 text-red-500" />
              <span className="text-red-700 dark:text-red-300">
                {err.path && (
                  <code className="rounded bg-red-100 px-1 py-px font-mono text-[10px] dark:bg-red-900">
                    {err.path}
                  </code>
                )}{' '}
                {err.message}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs">
              <Info className="mt-0.5 size-3 shrink-0 text-amber-500" />
              <span className="text-amber-700 dark:text-amber-400">
                {w.path && (
                  <code className="rounded bg-amber-100 px-1 py-px font-mono text-[10px] dark:bg-amber-900">
                    {w.path}
                  </code>
                )}{' '}
                {w.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ValidationErrors
