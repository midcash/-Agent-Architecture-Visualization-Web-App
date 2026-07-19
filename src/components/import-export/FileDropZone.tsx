import React, { useCallback, useRef, useState } from 'react'
import { Upload, FileJson } from 'lucide-react'
import { cn } from '../../utils/cn'
import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from '../../lib/constants'

export interface FileDropZoneProps {
  onFile: (content: string, filename: string) => void
  disabled?: boolean
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const processFile = useCallback(
    (file: File) => {
      setError(null)

      // Check extension
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!SUPPORTED_FORMATS.includes(ext as (typeof SUPPORTED_FORMATS)[number])) {
        setError(`Unsupported format. Use ${SUPPORTED_FORMATS.join(', ')}`)
        return
      }

      // Check size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const content = reader.result as string
        onFile(content, file.name)
      }
      reader.onerror = () => {
        setError('Failed to read file')
      }
      reader.readAsText(file)
    },
    [onFile],
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      dragCounter.current = 0

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile],
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className="space-y-1.5">
      <div
        onClick={disabled ? undefined : handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition-colors',
          isDragging
            ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {isDragging ? (
          <FileJson className="size-6 text-blue-500" />
        ) : (
          <Upload className="size-5 text-slate-400" />
        )}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-600 dark:text-slate-300">
            Drop JSON/YAML file
          </span>
          {' or click to browse'}
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          Max 5MB · .json, .yaml, .yml
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".json,.yaml,.yml"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default FileDropZone
