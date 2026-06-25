import type { YamlBranchTask } from '../types/story'

type Props = {
  task: YamlBranchTask
  onSubmit: (answer: string) => void
}

export default function YamlBranch({ task, onSubmit }: Props) {
  return (
    <>
      <p className="scene-text"><em>{task.prompt}</em></p>
      <ul className="option-list">
        {task.actions.map((action) => (
          <li key={action.id}>
            <button
              type="button"
              className="option"
              onClick={() => onSubmit(action.id)}
            >
              <span className="option-label">{action.text}</span>
              {action.description && (
                <span className="option-desc">{action.description}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
