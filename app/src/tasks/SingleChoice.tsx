import { useState } from 'react'
import type { SingleChoiceTask } from '../types/story'

type Props = {
  task: SingleChoiceTask
  submitted: boolean
  onSubmit: (answer?: string) => void
  readOnly?: boolean
  selectedAnswer?: string
}

export default function SingleChoice({ task, submitted, onSubmit, readOnly = false, selectedAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const activeSelection = readOnly ? (selectedAnswer ?? null) : selected

  function select(id: string) {
    if (!submitted && !readOnly) setSelected(id)
  }

  return (
    <>
      <ul className="option-list">
        {task.options.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              className={`option${activeSelection === opt.id ? ' selected' : ''}`}
              onClick={() => select(opt.id)}
              disabled={submitted || readOnly}
            >
              {opt.content}
            </button>
          </li>
        ))}
      </ul>
      {!submitted && !readOnly && (
        <button
          type="button"
          className="submit-btn submit-btn--problem"
          disabled={selected === null}
          onClick={() => onSubmit(selected!)}
        >
          submit
        </button>
      )}
    </>
  )
}
