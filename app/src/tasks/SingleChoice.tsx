import { useState } from 'react'
import type { SingleChoiceTask } from '../types/story'

type Props = { task: SingleChoiceTask; submitted: boolean; onSubmit: (answer?: string) => void }

export default function SingleChoice({ task, submitted, onSubmit }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function select(id: string) {
    if (!submitted) setSelected(id)
  }

  return (
    <>
      <ul className="option-list">
        {task.options.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              className={`option${selected === opt.id ? ' selected' : ''}`}
              onClick={() => select(opt.id)}
              disabled={submitted}
            >
              {opt.content}
            </button>
          </li>
        ))}
      </ul>
      {!submitted && (
        <button
          type="button"
          className="submit-btn submit-btn--problem"
          disabled={selected === null}
          onClick={() => onSubmit(selected!)}
        >
          {task.variant === 'problem' ? 'apply' : 'next'}
        </button>
      )}
    </>
  )
}
