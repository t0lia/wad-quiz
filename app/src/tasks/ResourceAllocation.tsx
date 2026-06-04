import { useState } from 'react'
import type { ResourceAllocationTask } from '../types/story'

type Props = { task: ResourceAllocationTask; submitted: boolean; onSubmit: (answer?: string) => void }

export default function ResourceAllocation({ task, submitted, onSubmit }: Props) {
  const [allocation, setAllocation] = useState<Record<string, number>>(
    Object.fromEntries(task.items.map((item) => [item.id, item.min]))
  )

  const spent = Object.values(allocation).reduce((s, v) => s + v, 0)
  const remaining = task.totalResource - spent

  function adjust(id: string, delta: number) {
    setAllocation((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + delta }))
  }

  return (
    <>
      <div className="resource-allocation">
        <div className={`budget-bar${remaining === 0 ? ' budget-done' : ''}`}>
          {remaining === 0
            ? `All ${task.totalResource}${task.unit} allocated`
            : `${remaining}${task.unit} remaining`}
        </div>
        <ul className="resource-list">
          {task.items.map((item) => {
            const value = allocation[item.id] ?? item.min
            return (
              <li key={item.id} className="resource-item">
                <span className="resource-label">{item.label}</span>
                <div className="stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    disabled={submitted || value <= item.min}
                    onClick={() => adjust(item.id, -1)}
                    aria-label={`Decrease ${item.label}`}
                  >
                    −
                  </button>
                  <span className="stepper-value">{value}{task.unit}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    disabled={submitted || value >= item.max || remaining === 0}
                    onClick={() => adjust(item.id, 1)}
                    aria-label={`Increase ${item.label}`}
                  >
                    +
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      {!submitted && (
        <button
          type="button"
          className="submit-btn"
          disabled={remaining !== 0}
          onClick={() => onSubmit(JSON.stringify(allocation))}
        >
          Submit
        </button>
      )}
    </>
  )
}
