export type Option = {
  id: string
  content: string
}

export type MultipleChoiceTask = {
  type: 'multiple_choice'
  options: Option[]
}

export type DragAndDropItem = {
  id: string
  content: string
}

export type DragAndDropTask = {
  type: 'drag_and_drop'
  items: DragAndDropItem[]
}

export type ResourceAllocationItem = {
  id: string
  label: string
  min: number
  max: number
}

export type ResourceAllocationTask = {
  type: 'resource_allocation'
  totalResource: number
  unit: string
  items: ResourceAllocationItem[]
}

export type Task = MultipleChoiceTask | DragAndDropTask | ResourceAllocationTask

export type ChallengeSceneData = {
  id: string
  text: string
  task: Task
}
