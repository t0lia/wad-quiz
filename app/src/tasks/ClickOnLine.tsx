import { useState } from 'react'
import type { ClickOnLineTask } from '../types/story'

type Props = { task: ClickOnLineTask; submitted: boolean; onSubmit: (answer?: string) => void }

export default function ClickOnLine({ task, submitted, onSubmit }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <ul className="line-list">
        {task.lines.map((line, i) => (
          <li key={line.id}>
            <button
              type="button"
              className={`line-item${selectedId === line.id ? ' selected' : ''}`}
              onClick={() => !submitted && setSelectedId(line.id)}
              disabled={submitted}
            >
              <span className="line-num">{i + 1}</span>
              <code className="line-content">{line.content}</code>
            </button>
          </li>
        ))}
      </ul>
      {!submitted && (
        <button
          type="button"
          className="submit-btn"
          disabled={selectedId === null}
          onClick={() => onSubmit(selectedId ?? undefined)}
        >
          next
        </button>
      )}
    </>
  )
}
