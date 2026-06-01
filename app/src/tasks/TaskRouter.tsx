import type { Task, DragAndDropItem } from '../types/story'
import MultipleChoice from './MultipleChoice'
import DragAndDrop from './DragAndDrop'

type Props = {
  task: Task
  mcSelected: Set<string>
  onMcChange: (id: string) => void
  dndOrder: DragAndDropItem[]
  onDndReorder: (items: DragAndDropItem[]) => void
  disabled: boolean
}

export default function TaskRouter({
  task,
  mcSelected,
  onMcChange,
  dndOrder,
  onDndReorder,
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
  return (
    <DragAndDrop
      items={dndOrder}
      onReorder={onDndReorder}
      disabled={disabled}
    />
  )
}
