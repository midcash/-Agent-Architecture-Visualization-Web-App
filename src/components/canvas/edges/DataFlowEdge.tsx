import React from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
  type Edge,
} from '@xyflow/react'
import { cn } from '../../../utils/cn'
import { flowTypeStyles } from '../../../lib/color-palette'
import type { DataFlowEdgeData } from '../../../types/react-flow'

const DataFlowEdge: React.FC<EdgeProps<Edge<DataFlowEdgeData>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  })

  const flow = data?.flow
  const isActive = data?.isActive ?? false
  const style = flow ? flowTypeStyles[flow.type] : flowTypeStyles.sync

  return (
    <>
      {/* Edge path */}
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn(
          isActive && 'drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]',
        )}
        style={{
          stroke: isActive ? '#3b82f6' : style.stroke,
          strokeWidth: isActive ? 3 : 2,
          strokeDasharray: style.dashArray,
          transition: 'stroke 0.3s, stroke-width 0.3s',
        }}
        markerEnd={markerEnd}
      />

      {/* Selected highlight */}
      {selected && (
        <path
          d={edgePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={6}
          strokeOpacity={0.2}
        />
      )}

      {/* Edge label */}
      {flow?.label && (
        <EdgeLabelRenderer>
          <div
            className={cn(
              'nodrag nopan absolute rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm transition-all',
              isActive
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-500 dark:bg-slate-800 dark:text-slate-400',
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
          >
            {flow.label}
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Animated data packet on active edges */}
      {isActive && (
        <circle r="4" fill="#3b82f6" className="drop-shadow-[0_0_4px_rgba(59,130,246,0.8)]">
          <animateMotion
            dur="0.8s"
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      )}
    </>
  )
}

export default React.memo(DataFlowEdge)
