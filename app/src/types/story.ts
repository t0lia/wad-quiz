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

export type Task = MultipleChoiceTask | DragAndDropTask

export type ChallengeSceneData = {
  id: string
  text: string
  task: Task
}
