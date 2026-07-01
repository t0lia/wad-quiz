import { createMachine, assign } from 'xstate'
import type { ChallengeSceneData } from './types/story'
import type { MetricsDelta } from './types/story'
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
 */

type Option = { id: string; content: string; description?: string; metrics?: MetricsDelta }

export const addMetricsAction = (optionId: string, options: Option[]) =>
  assign(({ context }: any) => {
    const selectedOption = options.find((opt: Option) => opt.id === optionId)

    if (selectedOption?.metrics) {
      const metrics = selectedOption.metrics
      return {
        tek_score: (context.tek_score || 0) + (metrics.tek || 0),
        ded_score: (context.ded_score || 0) + (metrics.ded || 0),
        soc_score: (context.soc_score || 0) + (metrics.soc || 0),
      }
    }
    return {}
  })

export const hydroMachine = createMachine<
  {
    boot_mode?: 'standard' | 'unsigned'
    rand?: number
    route_choice?: 'cargo' | 'medical'
    eva_mode?: 'team' | 'solo'
    swap_mode?: 'hot' | 'drain'
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
    tek_score?: number
    ded_score?: number
    soc_score?: number
  },
  { type: 'NEXT'; answer?: string; rand?: number },
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
    rand: undefined,
    route_choice: undefined,
    eva_mode: undefined,
    swap_mode: undefined,
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
    tek_score: 0,
    ded_score: 0,
    soc_score: 0,
  },
  types: {} as {
    events: { type: 'NEXT'; answer?: string; rand?: 0 | 1 }
  },
  states: allMachineStates as any,
})
