import type { Task } from '../types/story'
import MultipleChoice from './MultipleChoice'
import DragAndDrop from './DragAndDrop'
import ResourceAllocation from './ResourceAllocation'
import ClickOnLine from './ClickOnLine'
import Mapping from './Mapping'
import CardFilter from './CardFilter'
import SwipeCards from './SwipeCards'
import BlockBuilder from './BlockBuilder'

type Props = { task: Task; submitted: boolean; onSubmit: () => void }

export default function TaskRouter({ task, submitted, onSubmit }: Props) {
  const p = { submitted, onSubmit }
  switch (task.type) {
    case 'multiple_choice':    return <MultipleChoice    task={task} {...p} />
    case 'drag_and_drop':      return <DragAndDrop       task={task} {...p} />
    case 'resource_allocation':return <ResourceAllocation task={task} {...p} />
    case 'click_on_line':      return <ClickOnLine       task={task} {...p} />
    case 'mapping':            return <Mapping           task={task} {...p} />
    case 'card_filter':        return <CardFilter        task={task} {...p} />
    case 'swipe_cards':        return <SwipeCards        task={task} {...p} />
    case 'block_builder':      return <BlockBuilder      task={task} {...p} />
  }
}
