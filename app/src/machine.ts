import { createMachine, assign } from 'xstate'
import type { ChallengeSceneData } from './types/story'
import { allMachineStates } from './machine/index'

/**
 * Code of Growth — Hydroworld — XState routing machine
 *
 * Scenario structure:
 * - Section 1: Shared intro (boot choice)
 * - Sections 2-3: Shared path (dependencies, crossing ship)
 * - Sections 4-6: Split by route (cargo vs medical)
 * - Section 7: Shared EVA decision
 * - Sections 8-10: Split by debt level
 * - Endings: Five possible endings based on exit point and state
 *
 * Each problem section is split into:
 * - *_intro: Narrative and dialogue
 * - *_task: Code snippet and choices
 *
 * State flags track:
 *  boot_mode (standard | unsigned)
 *  route_choice (cargo | medical)
 *  problem_*_result (solved | incorrect | override)
 *  debt_count (derived from overrides)
 *  accepted_exit_* (early exit decisions)
 *  score (technical | dedication | social — see data/02-metrics.md)
 *
 * Every state-node transition can carry two action types:
 *  { type: 'set', params: {...} }   — merges params into context
 *  { type: 'score', params: {...} } — adds a delta to context.score
 * Both are implemented below via .provide() since the section files are
 * authored with loosely-typed (`any`) guards/actions.
 */
type ScoreDelta = { technical?: number; dedication?: number; social?: number }

const initialScore = { technical: 0, dedication: 0, social: 0 }

const baseMachine = createMachine<
  {
    boot_mode?: 'standard' | 'unsigned'
    route_choice?: 'cargo' | 'medical'
    eva_mode?: 'team' | 'solo'
    swap_mode?: 'hot' | 'drain'
    drone_mode?: 'patch' | 'override'
    problem_2_result?: 'solved' | 'incorrect' | 'override'
    problem_4_result?: 'solved' | 'incorrect' | 'override'
    problem_6_result?: 'solved' | 'incorrect' | 'override'
    problem_8_result?: 'solved' | 'incorrect' | 'override'
    problem_10_result?: 'solved' | 'incorrect' | 'override'
    accepted_exit_7?: boolean
    accepted_exit_8?: boolean
    accepted_exit_9?: boolean
    accepted_exit_10?: boolean
    debt_count?: number
    ending_tier?: string
    score: { technical: number; dedication: number; social: number }
  },
  { type: 'NEXT'; answer?: string },
  any,
  any,
  any,
  string,
  string,
  any,
  unknown,
  any,
  ChallengeSceneData
>({
  id: 'hydroworld',
  initial: 'section_1',
  context: {
    boot_mode: undefined,
    route_choice: undefined,
    eva_mode: undefined,
    swap_mode: undefined,
    drone_mode: undefined,
    problem_2_result: undefined,
    problem_4_result: undefined,
    problem_6_result: undefined,
    problem_8_result: undefined,
    problem_10_result: undefined,
    accepted_exit_7: false,
    accepted_exit_8: false,
    accepted_exit_9: false,
    accepted_exit_10: false,
    debt_count: 0,
    ending_tier: undefined,
    score: initialScore,
  },
  types: {} as {
    events: { type: 'NEXT'; answer?: string }
  },
  states: allMachineStates as any,
})

export const hydroMachine = baseMachine.provide({
  actions: {
    set: assign(({ context }: any, params: Record<string, unknown>) => ({
      ...context,
      ...params,
    })),
    score: assign(({ context }: any, params: ScoreDelta) => ({
      score: {
        technical: context.score.technical + (params.technical ?? 0),
        dedication: context.score.dedication + (params.dedication ?? 0),
        social: context.score.social + (params.social ?? 0),
      },
    })),
  } as any,
})

