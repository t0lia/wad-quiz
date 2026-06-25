export interface NextWhenEntry {
  if?: string
  value?: string
  else?: string
}

export interface ConclusionEntry {
  narrative: string
  next_section?: string
  next?: string
  next_section_when?: NextWhenEntry[]
}

export interface BranchAction {
  id: string
  text: string
  description: string
  sets_flag?: string
  next?: string
}

export interface ProblemAction {
  id: string
  text: string
  description: string
  outcome: 'solved' | 'incorrect' | 'override'
  sets_flag?: string
}

export interface BranchInteraction {
  type: 'branch'
  title: string
  prompt: string
  actions: BranchAction[]
}

export interface ProblemInteraction {
  type: 'problem'
  title: string
  prompt: string
  snippet?: string[]
  modifiers?: Array<{ condition: string; effect: string }>
  actions: ProblemAction[]
}

export type YamlInteraction = BranchInteraction | ProblemInteraction

export interface YamlSection {
  id: string
  title: string
  location_id: string
  intro: {
    narrative: string
    dialogue?: Array<{ speaker: string; text: string }>
  }
  interaction: YamlInteraction
  conclusion:
    | { by_action: Record<string, ConclusionEntry> }
    | { by_outcome: Record<string, ConclusionEntry> }
}

export interface YamlEnding {
  id: string
  title: string
  tier: string
  condition: string
  summary: string
  epilogue: { narrative: string; [k: string]: unknown }
  variant_pool: { count: number; selection: string }
}

export interface StoryDocument {
  format: string
  version: number
  language: string
  session: {
    post_node_exit_sections: Array<{ after_node: string; section_id: string }>
    [k: string]: unknown
  }
  scenario: {
    id: string
    title: string
    start_section: string
    sections: YamlSection[]
    endings: YamlEnding[]
    [k: string]: unknown
  }
  [k: string]: unknown
}
