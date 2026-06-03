import type { TextSceneData } from '../scenario'

type Props = {
  scene: TextSceneData
  onChoice: (event: 'NEXT' | 'SKIP') => void
}

export default function TextScene({ scene, onChoice }: Props) {
  const choices = scene.choices ?? [{ label: 'Continue →', event: 'NEXT' as const }]

  return (
    <div className="scene">
      <p className="scene-text" style={{ whiteSpace: 'pre-line' }}>
        {scene.text}
      </p>
      <div className="text-scene-actions">
        {choices.map((c) => (
          <button
            key={c.event}
            type="button"
            className="submit-btn"
            onClick={() => onChoice(c.event)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
