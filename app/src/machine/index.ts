import { assign, createMachine } from 'xstate'
import type { AnyStateMachine } from 'xstate'

import { applyFlagOperations } from '../storyLogic'
import type { StoryFlagOperationSpec } from '../storyLogic'
import type { ChallengeSceneData } from '../types/story'
import { section1States } from './section-1'
import { section2StandardStates } from './section-2-standard'
import { section2UnsignedStates } from './section-2-unsigned'
import { section3States } from './section-3'
import { section4CargoStates } from './section-4-cargo'
import { section5CargoStates } from './section-5-cargo'
import { section6CargoStates } from './section-6-cargo'
import { section4MedicalStates } from './section-4-medical'
import { section5MedicalStates } from './section-5-medical'
import { section6MedicalStates } from './section-6-medical'
import { section7States } from './section-7'
import { section8CleanStates } from './section-8-clean'
import { section8DebtStates } from './section-8-debt'
import { section9States } from './section-9'
import { section10CleanStates } from './section-10-clean'
import { section10DebtStates } from './section-10-debt'
import { endingStates } from './endings'

type ScoreDelta = { technical?: number; dedication?: number; social?: number }

type MachineContext = {
  [key: string]: unknown
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
}

const initialScore = { technical: 0, dedication: 0, social: 0 }

export const allMachineStates = {
  ...section1States,
  ...section2StandardStates,
  ...section2UnsignedStates,
  ...section3States,
  ...section4CargoStates,
  ...section5CargoStates,
  ...section6CargoStates,
  ...section4MedicalStates,
  ...section5MedicalStates,
  ...section6MedicalStates,
  ...section7States,
  ...section8CleanStates,
  ...section8DebtStates,
  ...section9States,
  ...section10CleanStates,
  ...section10DebtStates,
  ...endingStates,
}

const baseMachine = createMachine<
  MachineContext,
  { type: 'NEXT'; answer?: string; rand?: number },
  never,
  never,
  never,
  string,
  string,
  never,
  unknown,
  never,
  ChallengeSceneData,
  { rand: number }
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
    events: { type: 'NEXT'; answer?: string; rand?: number }
  },
  states: allMachineStates as any,
})

export const hydroMachine = baseMachine.provide({
  actions: {
    set: assign(({ context }, params: Record<string, unknown>) => ({
      ...context,
      ...params,
    })),
    score: assign(({ context }, params: ScoreDelta) => ({
      score: {
        technical: context.score.technical + (params.technical ?? 0),
        dedication: context.score.dedication + (params.dedication ?? 0),
        social: context.score.social + (params.social ?? 0),
      },
    })),
    flagOps: assign(({ context }, params: StoryFlagOperationSpec[]) => applyFlagOperations(context, params)),
  },
}) as unknown as AnyStateMachine
