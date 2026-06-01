import { useState } from 'react'
import type { CardFilterTask } from '../types/story'

type Props = { task: CardFilterTask; submitted: boolean; onSubmit: () => void }

export default function CardFilter({ task, submitted, onSubmit }: Props) {
  const [index, setIndex] = useState(0)

  const card = task.cards[index]

  function assign() {
    if (index === task.cards.length - 1) onSubmit()
    else setIndex((i) => i + 1)
  }

  if (!card) return null

  return (
    <>
      <div className="card-progress">{index + 1} / {task.cards.length}</div>
      <div className="cf-card">
        <p className="card-content">{card.content}</p>
        {Object.keys(card.meta).length > 0 && (
          <ul className="card-meta">
            {Object.entries(card.meta).map(([k, v]) => (
              <li key={k}><span className="meta-key">{k}:</span> {v}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="bucket-btns">
        {task.buckets.map((bucket) => (
          <button
            key={bucket.id}
            type="button"
            className="bucket-btn"
            onClick={assign}
            disabled={submitted}
          >
            {bucket.label}
          </button>
        ))}
      </div>
    </>
  )
}
