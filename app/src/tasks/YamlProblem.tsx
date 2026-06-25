import type { YamlProblemTask } from '../types/story'

type Props = {
  task: YamlProblemTask
  onSubmit: (answer: string) => void
}

export default function YamlProblem({ task, onSubmit }: Props) {
  return (
    <>
      <p className="scene-text"><em>{task.prompt}</em></p>
      {task.snippet && task.snippet.length > 0 && (
        <pre className="snippet">{task.snippet.join('\n')}</pre>
      )}
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
