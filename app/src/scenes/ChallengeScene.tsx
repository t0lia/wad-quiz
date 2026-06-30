import { useState } from 'react'
import type { ChallengeSceneData } from '../types/story'
import TaskRouter from '../tasks/TaskRouter'

type Props = {
  scene: ChallengeSceneData
  /** When true the scene is a past entry: task is frozen in submitted state. */
  frozen?: boolean
  /** Called when the user completes the task; answer carries optional payload (e.g. first block for git task). */
  onComplete: (answer?: string) => void
}

export default function ChallengeScene({ scene, frozen = false, onComplete }: Props) {
  const [submitted, setSubmitted] = useState(frozen)

  function handleSubmit(a?: string) {
    if (submitted) return
    setSubmitted(true)
    onComplete(a)
  }

  return (
    <div className="scene">
      <p className="scene-text" style={{ whiteSpace: 'pre-line' }}>{scene.text}</p>
      <TaskRouter task={scene.task} submitted={submitted} onSubmit={handleSubmit} />
    </div>
  )
}
