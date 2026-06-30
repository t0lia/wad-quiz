import type { TextSceneTask } from '../types/story'

type Props = { task: TextSceneTask; submitted: boolean; onSubmit: (answer?: string) => void }

export default function TextSceneTask({ task, submitted, onSubmit }: Props) {
  if (submitted) return null
  const choices = task.choices ?? [{ label: 'Continue →', event: 'NEXT' }]

  return (
    <div className="text-scene-actions">
      {choices.map((choice) => (
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
