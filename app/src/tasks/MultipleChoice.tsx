import type { Option } from '../types/story'

type Props = {
  options: Option[]
  selected: Set<string>
  onChange: (id: string) => void
  disabled: boolean
}

export default function MultipleChoice({ options, selected, onChange, disabled }: Props) {
  return (
    <ul className="option-list">
      {options.map((opt) => (
        <li key={opt.id}>
          <button
            type="button"
            className={`option${selected.has(opt.id) ? ' selected' : ''}`}
            onClick={() => onChange(opt.id)}
            disabled={disabled}
          >
            {opt.content}
          </button>
        </li>
      ))}
    </ul>
  )
}
