import type { TextSceneTask } from '../types/story'

type Props = { task: TextSceneTask, onSubmit: (answer?: string) => void }

export default function TextSceneTask({ task, onSubmit }: Props) {
  const choices = task.choices ?? [{ label: 'Continue →', event: 'NEXT' }]

  return (
    <div className="text-scene-actions">
      {choices.map((choice) => (
        <button
          key={choice.event}
          type="button"
          className="submit-btn"
          onClick={() => onSubmit(choice.event)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  )
}
