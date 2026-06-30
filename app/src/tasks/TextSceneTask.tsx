import type { TextSceneTask } from '../types/story'

type Props = { task: TextSceneTask, onSubmit: (answer?: string) => void }

export default function TextSceneTask({ task, onSubmit }: Props) {
  if (!task.choices) {
    return <p className="tap-hint">next</p>
  }

  return (
    <div className="text-scene-actions">
      {task.choices.map((choice) => (
        <button
          key={`${choice.event}:${choice.label}`}
          type="button"
          className="submit-btn"
          onClick={() => onSubmit(choice.label)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  )
}
