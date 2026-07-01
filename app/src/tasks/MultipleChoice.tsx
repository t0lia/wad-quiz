import type { MultipleChoiceTask } from '../types/story'

type Props = { task: MultipleChoiceTask; submitted: boolean; onSubmit: (answer?: string) => void }

export default function MultipleChoice({ task, submitted, onSubmit }: Props) {
  return (
    <ul className="option-list">
      {task.options.map((opt) => (
        <li key={opt.id}>
          <button
            type="button"
            className="option"
            onClick={() => onSubmit(opt.id)}
            disabled={submitted}
          >
            {opt.description || opt.content}
          </button>
        </li>
      ))}
    </ul>
  )
}

