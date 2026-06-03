import { useState, useRef, useEffect } from 'react'
import type { MappingTask } from '../types/story'

type Props = { task: MappingTask; submitted: boolean; onSubmit: () => void }

export default function Mapping({ task, submitted, onSubmit }: Props) {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null)
  const [pairs, setPairs] = useState<Record<string, string>>({})
  const gridRef = useRef<HTMLDivElement>(null)
  const [rowStep, setRowStep] = useState(52)

  useEffect(() => {
    if (!gridRef.current) return
    const btns = gridRef.current.querySelectorAll<HTMLElement>('[data-right-index]')
    if (btns.length >= 2) {
      const r0 = btns[0].getBoundingClientRect()
      const r1 = btns[1].getBoundingClientRect()
      setRowStep(Math.round(r1.top - r0.top))
    }
  }, [])

  const pairedRightIds = new Set(Object.values(pairs))
  const canSubmit = Object.keys(pairs).length === task.left.length

  function handleLeft(id: string) {
    if (submitted) return
    setSelectedLeftId((prev) => (prev === id ? null : id))
  }

  function handleRight(rightId: string) {
    if (submitted || !selectedLeftId) return
    setPairs((prev) => {
      const next = { ...prev }
      for (const [lId, rId] of Object.entries(next)) {
        if (rId === rightId) delete next[lId]
      }
      next[selectedLeftId] = rightId
      return next
    })
    setSelectedLeftId(null)
  }

  // Compute target visual row for each right item (index into task.left rows)
  const unpairedRight = task.right.filter((r) => !pairedRightIds.has(r.id))
  let ui = 0
  const displayRight = task.left.map((l) => {
    const pairedId = pairs[l.id]
    if (pairedId) return task.right.find((r) => r.id === pairedId)!
    return unpairedRight[ui++] ?? null
  })

  function getTargetRow(rightId: string): number {
    return displayRight.findIndex((r) => r?.id === rightId)
  }

  return (
    <>
      <div className="mapping-grid" ref={gridRef}>
        {task.left.flatMap((leftItem, i) => {
          const isPaired = !!pairs[leftItem.id]
          return [
            <button
              key={leftItem.id}
              type="button"
              style={{ gridRow: i + 1, gridColumn: 1 }}
              className={[
                'mapping-item',
                selectedLeftId === leftItem.id ? 'active' : '',
                isPaired ? 'paired' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleLeft(leftItem.id)}
              disabled={submitted}
            >
              {leftItem.content}
            </button>,
            <div
              key={`conn-${leftItem.id}`}
              style={{ gridRow: i + 1, gridColumn: 2 }}
              className="mapping-connector"
            >
              {isPaired && <div className="mapping-line" />}
            </div>,
          ]
        })}
        {task.right.map((rightItem, j) => {
          const targetRow = getTargetRow(rightItem.id)
          const shift = targetRow !== -1 ? (targetRow - j) * rowStep : 0
          const isPaired = pairedRightIds.has(rightItem.id)
          return (
            <button
              key={rightItem.id}
              data-right-index={j}
              type="button"
              style={{
                gridRow: j + 1,
                gridColumn: 3,
                transform: `translateY(${shift}px)`,
                transition: 'transform 0.35s ease',
              }}
              className={[
                'mapping-item',
                isPaired ? 'paired' : '',
                selectedLeftId && !isPaired ? 'available' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleRight(rightItem.id)}
              disabled={submitted || !selectedLeftId}
            >
              {rightItem.content}
            </button>
          )
        })}
      </div>
      {!submitted && (
        <button type="button" className="submit-btn" disabled={!canSubmit} onClick={onSubmit}>
          Submit
        </button>
      )}
    </>
  )
}
