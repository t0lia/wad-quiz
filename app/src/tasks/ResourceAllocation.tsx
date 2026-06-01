import type { ResourceAllocationTask } from '../types/story'

type Props = {
  task: ResourceAllocationTask
  allocation: Record<string, number>
  onChange: (id: string, value: number) => void
  disabled: boolean
}

export default function ResourceAllocation({ task, allocation, onChange, disabled }: Props) {
  const spent = Object.values(allocation).reduce((s, v) => s + v, 0)
  const remaining = task.totalResource - spent

  return (
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
                  disabled={disabled || value <= item.min}
                  onClick={() => onChange(item.id, value - 1)}
                  aria-label={`Decrease ${item.label}`}
                >
                  −
                </button>
                <span className="stepper-value">
                  {value}{task.unit}
                </span>
                <button
                  type="button"
                  className="stepper-btn"
                  disabled={disabled || value >= item.max || remaining === 0}
                  onClick={() => onChange(item.id, value + 1)}
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
  )
}
