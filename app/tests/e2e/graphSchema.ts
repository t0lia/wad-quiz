/**
 * TS-side shape of the parsed World/ bundle. The Python parser is gone —
 * `tests/e2e/build-graph.ts` reads YAML via `yaml` (already in devDeps) and
 * emits this shape as JSON into `tests/e2e/.cache/graph.json`.
 *
 * The contract between the parser and the test lives entirely in this file:
 * add a field here, validate it in build-graph.ts, read it in helpers/.
 */

// --- Raw structure (mirrors 01_structure.yaml) ---------------------------------

/** A static target stage id, or a guarded branch with optional `else`. */
export type GuardedBranch = { if?: string; value?: string; else?: string }

/** Either a static target, a single guarded branch, or a list of branches. */
export type NextRef = string | GuardedBranch | GuardedBranch[]

/** Resolved target stage id — what the engine would actually pick. */
export type ResolvedTarget = string

/**
 * Choice-action keyed transitions (next_by_action) or task-outcome keyed
 * transitions (next_by_outcome). Both shapes exist because some stages
 * are choice stages and some are task stages; a handful mix them.
 */
export type StageTransitionMap = Record<string, NextRef>

/** Flatten a NextRef to the list of candidate target stage ids. */
export function expandTargets(ref: NextRef): ResolvedTarget[] {
  if (typeof ref === 'string') return [ref]
  if (Array.isArray(ref)) {
    const out: ResolvedTarget[] = []
    for (const branch of ref) {
      if (typeof branch.value === 'string') out.push(branch.value)
      if (typeof branch.else === 'string') out.push(branch.else)
    }
    return out
  }
  if (typeof ref.value === 'string') return [ref.value]
  if (typeof ref.else === 'string') return [ref.else]
  return []
}

// --- Tasks / choices (parsed from raw2/World/tasks and choices) ---------------

export type TaskOutcome = 'incorrect' | 'solved' | 'override'

export interface TaskVariant {
  /** File basename without .yaml, e.g. "js_start_barrier_missing" */
  id: string
  /** Pool this variant belongs to. */
  poolId: string
  language: string
  title: string
  /** Every option the user can pick. We test each one. */
  options: TaskOption[]
}

export interface TaskOption {
  id: string
  text: string
  outcome: TaskOutcome
}

export interface ChoiceDef {
  /** File basename without .yaml — matches `choice_id` in stage config. */
  id: string
  kind: string
  title: string
  /** Every action the user can pick. We test each one. */
  options: ChoiceOption[]
}

export interface ChoiceOption {
  id: string
  text: string
}

// --- Stages (parsed from raw2/World/stages/01-stages.yaml) --------------------

export type StageType = 'choice' | 'task' | 'conclusion'

export interface StageNode {
  id: string
  stageType: StageType
  title: string
  /** Image basename, e.g. "incubator_4.webp" — used for diagnostics only. */
  image?: string
  /** For choice stages: which choice file to load. */
  choiceId?: string
  /** For task stages: which task pool to draw variants from. */
  taskPoolId?: string
}

// --- Top-level graph ----------------------------------------------------------

export interface StageGraph {
  /** Where the machine starts — must exist in `stages`. */
  entry: string
  /** Stages with no outgoing transitions — graph must reach them. */
  terminals: string[]
  /** Every stage node, keyed by id. */
  stages: Record<string, StageNode>
  /** Transition map for every stage, keyed by stage id. */
  transitions: Record<string, StageTransitionMap>
  /** Choice definitions, keyed by choice_id. */
  choices: Record<string, ChoiceDef>
  /** Task variants, keyed by task id. */
  tasks: Record<string, TaskVariant>
  /** Build metadata for diagnostics in failure reports. */
  meta: {
    builtAt: string
    bundleRoot: string
    stageCount: number
    taskCount: number
    choiceCount: number
  }
}