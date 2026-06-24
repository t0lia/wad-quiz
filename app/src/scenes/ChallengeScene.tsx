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

  function handleSubmit(a?: string) {
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
