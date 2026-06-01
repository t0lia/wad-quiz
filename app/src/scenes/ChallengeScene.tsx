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
  const [allocation, setAllocation] = useState<Record<string, number>>(
    scene.task.type === 'resource_allocation'
      ? Object.fromEntries(scene.task.items.map((item) => [item.id, item.min]))
      : {}
  )

  function computeCanSubmit(): boolean {
    if (scene.task.type === 'multiple_choice') return mcSelected.size > 0
    if (scene.task.type === 'resource_allocation') {
      const spent = Object.values(allocation).reduce((s, v) => s + v, 0)
      return spent === scene.task.totalResource
    }
    return true
  }

  function toggleMc(id: string) {
    setMcSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function updateAllocation(id: string, value: number) {
    setAllocation((prev) => ({ ...prev, [id]: value }))
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
        allocation={allocation}
        onAllocationChange={updateAllocation}
        disabled={submitted}
      />

      {!submitted && (
        <button
          type="button"
          className="submit-btn"
          disabled={!computeCanSubmit()}
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
