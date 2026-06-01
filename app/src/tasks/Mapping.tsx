import { useState } from 'react'
import type { MappingTask } from '../types/story'

type Props = { task: MappingTask; submitted: boolean; onSubmit: () => void }

export default function Mapping({ task, submitted, onSubmit }: Props) {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null)
  const [pairs, setPairs] = useState<Record<string, string>>({})

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

  return (
    <>
      <div className="mapping-grid">
        <ul className="mapping-col">
          {task.left.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={[
                  'mapping-item',
                  selectedLeftId === item.id ? 'active' : '',
                  pairs[item.id] ? 'paired' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleLeft(item.id)}
                disabled={submitted}
              >
                {item.content}
                {pairs[item.id] && <span className="pair-tick">✓</span>}
              </button>
            </li>
          ))}
        </ul>
        <ul className="mapping-col">
          {task.right.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={[
                  'mapping-item',
                  pairedRightIds.has(item.id) ? 'paired' : '',
                  selectedLeftId && !pairedRightIds.has(item.id) ? 'available' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleRight(item.id)}
                disabled={submitted || !selectedLeftId}
              >
                {item.content}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {!submitted && (
        <button type="button" className="submit-btn" disabled={!canSubmit} onClick={onSubmit}>
          Submit
        </button>
      )}
    </>
  )
}
