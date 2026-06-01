import type { Task, DragAndDropItem } from '../types/story'
import MultipleChoice from './MultipleChoice'
import DragAndDrop from './DragAndDrop'
import ResourceAllocation from './ResourceAllocation'

type Props = {
  task: Task
  mcSelected: Set<string>
  onMcChange: (id: string) => void
  dndOrder: DragAndDropItem[]
  onDndReorder: (items: DragAndDropItem[]) => void
  allocation: Record<string, number>
  onAllocationChange: (id: string, value: number) => void
  disabled: boolean
}

export default function TaskRouter({
  task,
  mcSelected,
  onMcChange,
  dndOrder,
  onDndReorder,
  allocation,
  onAllocationChange,
  disabled,
}: Props) {
  if (task.type === 'multiple_choice') {
    return (
      <MultipleChoice
        options={task.options}
        selected={mcSelected}
        onChange={onMcChange}
        disabled={disabled}
      />
    )
  }
  if (task.type === 'drag_and_drop') {
    return (
      <DragAndDrop
        items={dndOrder}
        onReorder={onDndReorder}
        disabled={disabled}
      />
    )
  }
  return (
    <ResourceAllocation
      task={task}
      allocation={allocation}
      onChange={onAllocationChange}
      disabled={disabled}
    />
  )
}
