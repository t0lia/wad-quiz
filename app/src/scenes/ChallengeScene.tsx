import { useState } from 'react'
import type { ChallengeSceneData } from '../types/story'
import TaskRouter from '../tasks/TaskRouter'

type Props = {
  scene: ChallengeSceneData
  /** Called when the user completes the task; answer carries optional payload (e.g. first block for git task). */
  onComplete: (answer?: string) => void
}

export default function ChallengeScene({ scene, onComplete }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [answer, setAnswer] = useState<string | undefined>(undefined)

  function handleSubmit(a?: string) {
    setAnswer(a)
    setSubmitted(true)
  }

  return (
    <div className="scene">
      <p className="scene-text">{scene.text}</p>
      <TaskRouter task={scene.task} submitted={submitted} onSubmit={handleSubmit} />
      {submitted && (
        <div className="feedback correct">
          Done!
          <button type="button" className="secondary-btn" onClick={() => onComplete(answer)}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
