export type Option = { id: string; content: string }
export type MultipleChoiceTask = { type: 'multiple_choice'; options: Option[] }

export type DragAndDropItem = { id: string; content: string }
export type DragAndDropTask = { type: 'drag_and_drop'; items: DragAndDropItem[] }

export type ResourceAllocationItem = { id: string; label: string; min: number; max: number }
export type ResourceAllocationTask = {
  type: 'resource_allocation'
  totalResource: number
  unit: string
  items: ResourceAllocationItem[]
}

export type ClickOnLineTask = {
  type: 'click_on_line'
  lines: { id: string; content: string }[]
}

export type MappingTask = {
  type: 'mapping'
  left: { id: string; content: string }[]
  right: { id: string; content: string }[]
}

export type CardFilterTask = {
  type: 'card_filter'
  cards: { id: string; content: string; meta: Record<string, string> }[]
  buckets: { id: string; label: string }[]
}

export type SwipeCardsTask = {
  type: 'swipe_cards'
  cards: { id: string; content: string; meta: Record<string, string> }[]
  options: { id: string; label: string }[]
}

export type BlockBuilderTask = {
  type: 'block_builder'
  availableBlocks: { id: string; content: string }[]
  slots: number
}

export type OneTapForwardTask = { type: 'one_tap_forward' }

export type DecisionMapNode = { id: string; label: string; x: number; y: number }
export type DecisionMapTask = {
  type: 'decision_map'
  nodes: DecisionMapNode[]
  edges: { from: string; to: string }[]
  correctNodeIds: string[]
}

export type TextSceneTask = {
  type: 'text_scene'
  choices?: { label: string; event: 'NEXT' }[]
}

export type YamlBranchTask = {
  type: 'yaml_branch'
  prompt: string
  actions: Array<{ id: string; text: string; description: string }>
}

export type YamlProblemTask = {
  type: 'yaml_problem'
  prompt: string
  snippet?: string[]
  actions: Array<{ id: string; text: string; description: string; outcome: string }>
}

export type Task =
  | MultipleChoiceTask
  | DragAndDropTask
  | ResourceAllocationTask
  | ClickOnLineTask
  | MappingTask
  | CardFilterTask
  | SwipeCardsTask
  | BlockBuilderTask
  | OneTapForwardTask
  | DecisionMapTask
  | TextSceneTask
  | YamlBranchTask
  | YamlProblemTask

export type ChallengeSceneData = { id: string; text: string; task: Task }

export type { YamlSection, YamlEnding } from './yaml-story'
export type { MachineContext } from '../machine-builder'

export type YamlSceneData = {
  section: import('./yaml-story').YamlSection
  context: import('../machine-builder').MachineContext
}

export type YamlEndingData = {
  ending: import('./yaml-story').YamlEnding
  context: import('../machine-builder').MachineContext
}
