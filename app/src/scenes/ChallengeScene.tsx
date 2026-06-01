import { useState } from 'react'
import type { ChallengeSceneData } from '../types/story'
import TaskRouter from '../tasks/TaskRouter'

type Props = { scene: ChallengeSceneData; onComplete: () => void; isLast: boolean }

export default function ChallengeScene({ scene, onComplete, isLast }: Props) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="scene">
      <p className="scene-text">{scene.text}</p>
      <TaskRouter task={scene.task} submitted={submitted} onSubmit={() => setSubmitted(true)} />
      {submitted && (
        <div className="feedback correct">
          Correct!
          <button type="button" className="secondary-btn" onClick={onComplete}>
            {isLast ? 'Finish' : 'Continue →'}
          </button>
        </div>
      )}
    </div>
  )
}
