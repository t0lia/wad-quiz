import { useState } from 'react'
import type { DecisionMapTask } from '../types/story'

type Props = { task: DecisionMapTask; submitted: boolean; onSubmit: () => void }

const HW = 68  // node half-width
const HH = 20  // node half-height

function clipLine(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return null
  const nx = dx / len, ny = dy / len
  const tx = nx !== 0 ? HW / Math.abs(nx) : Infinity
  const ty = ny !== 0 ? HH / Math.abs(ny) : Infinity
  const tExit = Math.min(tx, ty) + 4
  const tEnter = Math.min(tx, ty) + 10
  return {
    x1: x1 + tExit * nx, y1: y1 + tExit * ny,
    x2: x2 - tEnter * nx, y2: y2 - tEnter * ny,
  }
}

export default function DecisionMap({ task, submitted, onSubmit }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function handleNodeClick(nodeId: string) {
    if (submitted) return
    setSelectedId((prev) => (prev === nodeId ? null : nodeId))
  }

  return (
    <>
      <svg
        className="dm-svg"
        viewBox="0 0 400 240"
        width="100%"
        style={{ display: 'block', overflow: 'visible' }}
        aria-label="Dependency graph"
      >
        <defs>
          <marker
            id="dm-arrow"
            viewBox="0 0 8 8"
            refX="7" refY="4"
            markerWidth="8" markerHeight="8"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className="dm-arrowhead" />
          </marker>
        </defs>

        {task.edges.map((edge) => {
          const from = task.nodes.find((n) => n.id === edge.from)!
          const to = task.nodes.find((n) => n.id === edge.to)!
          const seg = clipLine(from.x, from.y, to.x, to.y)
          if (!seg) return null
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              className="dm-edge"
              x1={seg.x1} y1={seg.y1}
              x2={seg.x2} y2={seg.y2}
              markerEnd="url(#dm-arrow)"
            />
          )
        })}

        {task.nodes.map((node) => {
          const isSelected = selectedId === node.id
          const isCorrect = task.correctNodeIds.includes(node.id)
          const showCorrect = submitted && isCorrect
          return (
            <g
              key={node.id}
              className={[
                'dm-node',
                isSelected ? 'selected' : '',
                showCorrect ? 'correct' : '',
              ].filter(Boolean).join(' ')}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => handleNodeClick(node.id)}
            >
              <rect
                x={-HW} y={-HH}
                width={HW * 2} height={HH * 2}
                rx="6"
                className="dm-node-rect"
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                className="dm-node-label"
              >
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>

      {!submitted && (
        <button
          type="button"
          className="submit-btn"
          disabled={selectedId === null}
          onClick={onSubmit}
        >
          Submit
        </button>
      )}
    </>
  )
}
