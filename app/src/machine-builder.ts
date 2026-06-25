import { createMachine, assign } from 'xstate'
import type {
  StoryDocument,
  YamlSection,
  ConclusionEntry,
  NextWhenEntry,
  BranchAction,
  ProblemAction,
} from './types/yaml-story'

// ── Context ────────────────────────────────────────────────────────────────

export interface MachineContext {
  boot_mode: string | null
  route_choice: string | null
  drone_mode: string | null
  eva_mode: string | null
  swap_mode: string | null
  accepted_exit_7: boolean
  accepted_exit_8: boolean
  accepted_exit_9: boolean
  accepted_exit_10: boolean
  problem_2_result: string | null
  problem_4_result: string | null
  problem_6_result: string | null
  problem_8_result: string | null
  problem_10_result: string | null
  debt_count: number
}

type ContextBase = Omit<MachineContext, 'debt_count'>

function computeDebt(ctx: ContextBase): number {
  let d = 0
  if (ctx.boot_mode === 'unsigned') d++
  if (ctx.drone_mode === 'override') d++
  if (ctx.eva_mode === 'solo') d++
  if (ctx.swap_mode === 'hot') d++
  for (const result of [
    ctx.problem_2_result,
    ctx.problem_4_result,
    ctx.problem_6_result,
    ctx.problem_8_result,
    ctx.problem_10_result,
  ]) {
    if (result === 'override') d++
  }
  return d
}

function parseValue(raw: string): string | boolean {
  if (raw === 'true') return true
  if (raw === 'false') return false
  return raw
}

function applyFlag(flag: string | undefined, ctx: MachineContext): MachineContext {
  if (!flag) return ctx
  const colonIdx = flag.indexOf(':')
  if (colonIdx < 0) return ctx
  const key = flag.slice(0, colonIdx).trim()
  const value = parseValue(flag.slice(colonIdx + 1).trim())
  const updated = { ...ctx, [key]: value }
  return { ...updated, debt_count: computeDebt(updated) }
}

// ── Condition evaluator ────────────────────────────────────────────────────

function evalCondition(expr: string, ctx: MachineContext): boolean {
  const debtMatch = expr.match(/^debt_count\s*(>=|==|<=|>|<)\s*(\d+)$/)
  if (debtMatch) {
    const op = debtMatch[1]
    const n = parseInt(debtMatch[2], 10)
    if (op === '>=') return ctx.debt_count >= n
    if (op === '>') return ctx.debt_count > n
    if (op === '<=') return ctx.debt_count <= n
    if (op === '<') return ctx.debt_count < n
    return ctx.debt_count === n
  }
  const flagMatch = expr.match(/^(\w+)\s*==\s*(\w+)$/)
  if (flagMatch) {
    const k = flagMatch[1] as keyof MachineContext
    return ctx[k] === flagMatch[2]
  }
  console.warn(`[machine-builder] Unknown condition: "${expr}"`)
  return false
}

// ── Target resolution ──────────────────────────────────────────────────────

type ResolvedTarget = { condition: string | null; target: string }

function resolveTargets(
  actionNext: string | undefined,
  conclusionEntry: ConclusionEntry | undefined,
): ResolvedTarget[] {
  if (actionNext) return [{ condition: null, target: actionNext }]
  if (!conclusionEntry) return []
  if (conclusionEntry.next) return [{ condition: null, target: conclusionEntry.next }]
  if (conclusionEntry.next_section) return [{ condition: null, target: conclusionEntry.next_section }]
  if (conclusionEntry.next_section_when) {
    return conclusionEntry.next_section_when.map((entry: NextWhenEntry) => ({
      condition: 'if' in entry ? (entry.if ?? null) : null,
      target: 'value' in entry ? (entry.value ?? '') : (entry.else ?? ''),
    }))
  }
  return []
}

// ── Transition builder ─────────────────────────────────────────────────────

function buildTransitions(section: YamlSection): unknown[] {
  const { interaction, conclusion } = section
  const byAction = 'by_action' in conclusion
  const conclusionMap: Record<string, ConclusionEntry> = byAction
    ? conclusion.by_action
    : conclusion.by_outcome

  const transitions: unknown[] = []

  if (interaction.type === 'branch') {
    for (const action of interaction.actions as BranchAction[]) {
      const conclusionEntry = conclusionMap[action.id]
      const targets = resolveTargets(action.next, conclusionEntry)
      const actionId = action.id
      const flagToApply = action.sets_flag

      for (const { condition, target } of targets) {
        if (!target) continue
        transitions.push({
          guard: condition !== null
            ? ({ context, event }: { context: MachineContext; event: { answer: string } }) =>
                event.answer === actionId && evalCondition(condition, context)
            : ({ event }: { event: { answer: string } }) =>
                event.answer === actionId,
          target,
          actions: assign(({ context }: { context: MachineContext }) =>
            applyFlag(flagToApply, context),
          ),
        })
      }
    }
  } else {
    for (const action of interaction.actions as ProblemAction[]) {
      const conclusionKey = byAction ? action.id : action.outcome
      const conclusionEntry = conclusionMap[conclusionKey]
      const targets = resolveTargets(undefined, conclusionEntry)
      const actionId = action.id
      const flagToApply = action.sets_flag

      for (const { condition, target } of targets) {
        if (!target) continue
        transitions.push({
          guard: condition !== null
            ? ({ context, event }: { context: MachineContext; event: { answer: string } }) =>
                event.answer === actionId && evalCondition(condition, context)
            : ({ event }: { event: { answer: string } }) =>
                event.answer === actionId,
          target,
          actions: assign(({ context }: { context: MachineContext }) =>
            applyFlag(flagToApply, context),
          ),
        })
      }
    }
  }

  return transitions
}

// ── Builder ────────────────────────────────────────────────────────────────

export function buildMachineFromYaml(doc: StoryDocument) {
  const { sections, endings, start_section } = doc.scenario

  const baseCtx: ContextBase = {
    boot_mode: null,
    route_choice: null,
    drone_mode: null,
    eva_mode: null,
    swap_mode: null,
    accepted_exit_7: false,
    accepted_exit_8: false,
    accepted_exit_9: false,
    accepted_exit_10: false,
    problem_2_result: null,
    problem_4_result: null,
    problem_6_result: null,
    problem_8_result: null,
    problem_10_result: null,
  }

  const initialContext: MachineContext = { ...baseCtx, debt_count: 0 }

  const states: Record<string, unknown> = {}

  for (const section of sections) {
    states[section.id] = {
      meta: { section },
      on: { NEXT: buildTransitions(section) },
    }
  }

  for (const ending of endings) {
    states[ending.id] = {
      meta: { ending },
      type: 'final',
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createMachine({ id: doc.scenario.id, initial: start_section, context: initialContext, states } as any)
}
