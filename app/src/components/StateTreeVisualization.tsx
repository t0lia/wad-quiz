import { useMemo, useLayoutEffect, useRef, useState } from 'react'
import { hydroMachine } from '../machine'
import ChallengeScene from '../scenes/ChallengeScene'
import type { ChallengeSceneData } from '../types/story'

interface StatePosition {
  id: string
  x: number
  y: number
  level: number
}

interface StateConnection {
  from: string
  to: string
}

function collectTargetIds(value: unknown, targets: Set<string>): void {
  if (!value) return

  if (typeof value === 'string') {
    targets.add(value)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectTargetIds(entry, targets))
    return
  }

  if (typeof value !== 'object') return

  const record = value as Record<string, unknown>
  if ('target' in record) {
    collectTargetIds(record.target, targets)
    return
  }

  Object.values(record).forEach((entry) => collectTargetIds(entry, targets))
}

function shortStateId(fullId: string): string {
  const dot = fullId.indexOf('.')
  return dot >= 0 ? fullId.slice(dot + 1) : fullId
}

export default function StateTreeVisualization() {
  const measureRef = useRef<Map<string, number>>(new Map())
  const [_measured, setMeasured] = useState(false)

  const machineStates = useMemo(() => {
    const states = (hydroMachine as any).config?.states ?? hydroMachine.states
    return states
  }, [])

  useLayoutEffect(() => {
    // Measure actual cell heights after render
    const heights = new Map<string, number>()
    document.querySelectorAll('[id^="cell-"]').forEach((el) => {
      const id = (el as HTMLElement).id.replace('cell-', '')
      heights.set(id, el.clientHeight)
    })
    measureRef.current = heights
    setMeasured(true)
  }, [])

  const { positions, connections } = useMemo(() => {
    const visited = new Set<string>()
    const positions: StatePosition[] = []
    const connections: StateConnection[] = []
    const levelMap = new Map<string, number>()
    const levelStates = new Map<number, string[]>()

    // BFS to assign levels
    const queue = ['section_1']
    levelMap.set('section_1', 0)
    levelStates.set(0, ['section_1'])

    while (queue.length > 0) {
      const current = queue.shift()!
      if (visited.has(current)) continue
      visited.add(current)

      const stateNode = machineStates[current]
      if (!stateNode) continue

      const targets = new Set<string>()
      collectTargetIds(stateNode?.on, targets)
      collectTargetIds(stateNode?.always, targets)
      collectTargetIds(stateNode?.after, targets)

      for (const target of targets) {
        connections.push({ from: current, to: target })

        if (!levelMap.has(target)) {
          const currentLevel = levelMap.get(current) ?? 0
          const nextLevel = currentLevel + 1
          levelMap.set(target, nextLevel)

          if (!levelStates.has(nextLevel)) {
            levelStates.set(nextLevel, [])
          }
          levelStates.get(nextLevel)!.push(target)
          queue.push(target)
        }
      }
    }

    // Position states in tree layout (branches spread horizontally)
    const phoneContainerHeight = 700
    const statesByLevel = Array.from(levelStates.entries()).sort((a, b) => a[0] - b[0])
    const nodeWidth = 480
    const verticalGap = 400 // Doubled from 200 for more vertical spacing
    const horizontalGap = 100 // More horizontal gap between sibling branches

    for (const [lvl, states] of statesByLevel) {
      const levelWidth = states.length * nodeWidth + (states.length - 1) * horizontalGap
      const startX = Math.max(50, (2000 - levelWidth) / 2) // Wider canvas

      states.forEach((stateId, idx) => {
        positions.push({
          id: stateId,
          x: startX + idx * (nodeWidth + horizontalGap),
          y: lvl * (phoneContainerHeight + verticalGap),
          level: lvl,
        })
      })
    }

    return { positions, connections }
  }, [machineStates])

  const maxX = Math.max(...positions.map((p) => p.x + 480), 2100)
  const maxY = Math.max(...positions.map((p) => p.y + 700), 1000) + 100

  const positionMap = new Map(positions.map((p) => [p.id, p]))
  const phoneContainerHeight = 900

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '20px', position: 'relative' }}>
      <div style={{ position: 'relative', width: maxX + 50, height: maxY + 50 }}>
        {/* SVG for arrows - positioned behind content with proper offset */}
        <svg
          width={maxX + 50}
          height={maxY + 50}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {/* Draw connections/arrows */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="15"
              markerHeight="15"
              refX="12"
              refY="7"
              orient="auto"
            >
              <polygon points="0 0, 15 7, 0 14" fill="#ff6b35" />
            </marker>
          </defs>

          {connections.map((conn, idx) => {
            const from = positionMap.get(conn.from)
            const to = positionMap.get(conn.to)

            if (!from || !to) return null

            // Use measured height or default fallback
            const cellHeight = measureRef.current.get(conn.from) || 740
            const cellWidth = 480

            const fromX = from.x + cellWidth / 2 // Middle of bottom edge
            const fromY = from.y + cellHeight // Bottom edge of current page
            const toX = to.x + cellWidth / 2 // Middle of top edge
            const toY = to.y // Top edge of next page

            const midY = (fromY + toY) / 2

            return (
              <g key={idx}>
                {/* Curved arrow path - thicker and more visible */}
                <path
                  d={`M ${fromX} ${fromY} Q ${fromX} ${midY} ${toX} ${toY}`}
                  fill="none"
                  stroke="#ff6b35"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead)"
                  opacity="0.9"
                />
              </g>
            )
          })}
        </svg>

        {/* Container for positioned pages - on top of arrows */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {positions.map((pos) => {
            const scene = machineStates[pos.id]?.meta as ChallengeSceneData | undefined

            return (
              <div
                key={pos.id}
                id={`cell-${pos.id}`}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  width: 480,
                  border: '2px solid #0066cc',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                }}
              >
                {/* State ID label */}
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f0f7ff',
                    borderBottom: '1px solid #e0e0e0',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#0066cc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{shortStateId(pos.id)}</span>
                  <span style={{ fontSize: '10px', color: '#999' }}>L{pos.level}</span>
                </div>

                {/* Phone frame with scene */}
                <div
                  style={{
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '9 / 16',
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0',
                      transformOrigin: 'top center',
                      margin: '0 auto',
                    }}
                  >
                    {scene ? (
                      <div style={{ height: '100%', overflow: 'auto', fontSize: '11px' }}>
                        <ChallengeScene scene={scene} onComplete={() => {}} />
                      </div>
                    ) : (
                      <div style={{ padding: '12px', color: '#999', fontSize: '12px' }}>
                        No scene data
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
