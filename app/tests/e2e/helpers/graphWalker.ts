/**
 * Graph walker — given a parsed StageGraph, produce the set of "test cases"
 * that cover every (stage, choice option, task variant) combination.
 *
 * The walker splits coverage into two independent plans:
 *
 *   1. `planChoiceWalks` — for each choice stage, one test branch per
 *      outgoing option. Branches share prefixes (we don't replay the
 *      prefix every time — the spec uses `driveToStage` to teleport).
 *      Cardinality: sum over choice stages of (number of options).
 *
 *   2. `planTaskAnswers` — for each task stage, enumerate every variant
 *      in its pool × every option in the variant. Cardinality: sum over
 *      task stages of (variants_in_pool × options_per_variant).
 *
 *   Together: every (choice-stage, option) is exercised, every
 *   (task-stage, variant, option) is enumerated, no combinatorial explosion.
 *
 * Guarded branches (if/else on context flags like route_cargo) are treated
 * by picking the **first** alternative target as the "expected next stage"
 * for the test. If a guarded branch is hit, the variant's option must
 * have produced the context flag that flips the branch — we don't try to
 * force both branches in one spec; coverage of the second branch is
 * implicit because some other (stage, option) will set the flag.
 */

import type { StageGraph, StageTransitionMap } from '../graphSchema.ts'
import { expandTargets } from '../graphSchema.ts'

// --- Choice plan -------------------------------------------------------------

export interface ChoiceWalk {
  stageId: string
  choiceId: string
  optionId: string
  optionText: string
  /** The stage we expect to land on after clicking this option. */
  expectedNextStage: string
}

export function planChoiceWalks(graph: StageGraph): ChoiceWalk[] {
  const out: ChoiceWalk[] = []
  for (const stage of Object.values(graph.stages)) {
    if (stage.stageType !== 'choice' || !stage.choiceId) continue
    const choice = graph.choices[stage.choiceId]
    if (!choice) continue
    const trans = graph.transitions[stage.id] ?? {}
    for (const option of choice.options) {
      const ref = trans[option.id]
      if (!ref) continue
      const targets = expandTargets(ref)
      if (!targets[0]) continue
      out.push({
        stageId: stage.id,
        choiceId: stage.choiceId,
        optionId: option.id,
        optionText: option.text,
        expectedNextStage: targets[0],
      })
    }
  }
  return out
}

// --- Task plan ---------------------------------------------------------------

export interface TaskAnswer {
  stageId: string
  taskPoolId: string
  variantId: string
  optionId: string
  optionText: string
  outcome: string
  /** The stage we expect to land on after submitting this option. */
  expectedNextStage: string
}

export function planTaskAnswers(graph: StageGraph): TaskAnswer[] {
  const out: TaskAnswer[] = []
  for (const stage of Object.values(graph.stages)) {
    if (stage.stageType !== 'task' || !stage.taskPoolId) continue
    const trans = graph.transitions[stage.id] ?? {}
    const outcomeToTarget = new Map<string, string>()
    for (const [outcome, ref] of Object.entries(trans)) {
      const targets = expandTargets(ref)
      if (targets[0]) outcomeToTarget.set(outcome, targets[0])
    }
    const variants = Object.values(graph.tasks).filter(t => t.poolId === stage.taskPoolId)
    for (const variant of variants) {
      for (const option of variant.options) {
        const expected = outcomeToTarget.get(option.outcome)
        if (!expected) continue
        out.push({
          stageId: stage.id,
          taskPoolId: stage.taskPoolId,
          variantId: variant.id,
          optionId: option.id,
          optionText: option.text,
          outcome: option.outcome,
          expectedNextStage: expected,
        })
      }
    }
  }
  return out
}

// --- Coverage summary --------------------------------------------------------

export interface Coverage {
  stagesReachable: number
  stagesTotal: number
  choiceOptionsCovered: number
  taskVariantsCovered: number
  taskAnswersCovered: number
  unreachable: string[]
  deadEnds: string[]
}

export function summarize(graph: StageGraph, choices: ChoiceWalk[], tasks: TaskAnswer[]): Coverage {
  const reachable = new Set<string>([graph.entry])
  const stack = [graph.entry]
  while (stack.length) {
    const cur = stack.pop()!
    const trans: StageTransitionMap = graph.transitions[cur] ?? {}
    for (const ref of Object.values(trans)) {
      for (const id of expandTargets(ref)) {
        if (!reachable.has(id)) { reachable.add(id); stack.push(id) }
      }
    }
  }
  const unreachable = Object.keys(graph.stages).filter(s => !reachable.has(s))
  const deadEnds = Object.keys(graph.stages).filter(s => {
    if (graph.terminals.includes(s)) return false
    const t = graph.transitions[s] ?? {}
    return Object.keys(t).length === 0
  })
  return {
    stagesReachable: reachable.size,
    stagesTotal: Object.keys(graph.stages).length,
    choiceOptionsCovered: choices.length,
    taskVariantsCovered: new Set(tasks.map(t => t.variantId)).size,
    taskAnswersCovered: tasks.length,
    unreachable,
    deadEnds,
  }
}