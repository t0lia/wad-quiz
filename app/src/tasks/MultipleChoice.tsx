import { useState } from 'react'
import type { MultipleChoiceTask } from '../types/story'

type Props = { task: MultipleChoiceTask; submitted: boolean; onSubmit: () => void }

export default function MultipleChoice({ task, submitted, onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    if (submitted) return
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <>
      <ul className="option-list">
        {task.options.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              className={`option${selected.has(opt.id) ? ' selected' : ''}`}
              onClick={() => toggle(opt.id)}
              disabled={submitted}
            >
              {opt.content}
            </button>
          </li>
        ))}
      </ul>
      {!submitted && (
        <button type="button" className="submit-btn" disabled={selected.size === 0} onClick={onSubmit}>
          Submit
        </button>
      )}
    </>
  )
}
