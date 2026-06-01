import { useState } from 'react'
import type { ChallengeSceneData, DragAndDropItem } from '../types/story'
import TaskRouter from '../tasks/TaskRouter'

type Props = {
  scene: ChallengeSceneData
  onComplete: () => void
  isLast: boolean
}

export default function ChallengeScene({ scene, onComplete, isLast }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [mcSelected, setMcSelected] = useState<Set<string>>(new Set())
  const [dndOrder, setDndOrder] = useState<DragAndDropItem[]>(
    scene.task.type === 'drag_and_drop' ? scene.task.items : []
  )

  const canSubmit =
    scene.task.type === 'multiple_choice' ? mcSelected.size > 0 : true

  function toggleMc(id: string) {
    setMcSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="scene">
      <p className="scene-text">{scene.text}</p>

      <TaskRouter
        task={scene.task}
        mcSelected={mcSelected}
        onMcChange={toggleMc}
        dndOrder={dndOrder}
        onDndReorder={setDndOrder}
        disabled={submitted}
      />

      {!submitted && (
        <button
          type="button"
          className="submit-btn"
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
        >
          Submit
        </button>
      )}

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
