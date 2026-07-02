import type { ChallengeSceneData } from '../types/story'
import { pyFarmPrefixBoundaryTaskState } from './tasks/09-py_farm_prefix_boundary'
import { javaRouteScopeBoundaryTaskState } from './tasks/10-java_route_scope_boundary'
import { javaGatewayHostRouteBoundaryTaskState } from './tasks/20-java_gateway_host_route_boundary'
import { pyHullVlanPrefixOverlapTaskState } from './tasks/21-py_hull_vlan_prefix_overlap'
import { jsTunnelPrefixFallbackTaskState } from './tasks/22-js_tunnel_prefix_fallback'

export const section8DebtStates = {
  // ── Section 8 Debt: Intro ───────────────────────────────
  section_8_debt_intro: {
    meta: {
      id: 'section_8_debt_intro',
      text:
        'The technical gap is no longer polite. Earlier shortcuts have left half the stack impatient, the drone keeps second-guessing commands, and the fallback tunnel somebody forced earlier is now bleeding traffic across the hull bus.\n\n' +
        'RAY: We are not fixing one clean route anymore. We are fixing the bad rescue path on top of it.\n' +
        'ALEX: Good. I was worried the night might become straightforward.\n' +
        'RAY: That concern has passed.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.rand < 0.2,
          target: 'section_8_debt_task_1',
        },
        {
          guard: ({ event }: any) => event.rand < 0.4,
          target: 'section_8_debt_task_2',
        },
        {
          guard: ({ event }: any) => event.rand < 0.6,
          target: 'section_8_debt_task_3',
        },
        {
          guard: ({ event }: any) => event.rand < 0.8,
          target: 'section_8_debt_task_4',
        },
        {
          target: 'section_8_debt_task_5',
        },
      ],
    },
  },

  ...pyFarmPrefixBoundaryTaskState({
    stateId: 'section_8_debt_task_1',
    solvedTarget: 'section_8_debt_conclusion_solved',
    overrideTarget: 'section_8_debt_conclusion_override',
    incorrectTarget: 'section_8_debt_conclusion_incorrect',
  }),

  ...javaRouteScopeBoundaryTaskState({
    stateId: 'section_8_debt_task_2',
    solvedTarget: 'section_8_debt_conclusion_solved',
    overrideTarget: 'section_8_debt_conclusion_override',
    incorrectTarget: 'section_8_debt_conclusion_incorrect',
  }),

  ...javaGatewayHostRouteBoundaryTaskState({
    stateId: 'section_8_debt_task_3',
    solvedTarget: 'section_8_debt_conclusion_solved',
    overrideTarget: 'section_8_debt_conclusion_override',
    incorrectTarget: 'section_8_debt_conclusion_incorrect',
  }),

  ...pyHullVlanPrefixOverlapTaskState({
    stateId: 'section_8_debt_task_4',
    solvedTarget: 'section_8_debt_conclusion_solved',
    overrideTarget: 'section_8_debt_conclusion_override',
    incorrectTarget: 'section_8_debt_conclusion_incorrect',
  }),

  ...jsTunnelPrefixFallbackTaskState({
    stateId: 'section_8_debt_task_5',
    solvedTarget: 'section_8_debt_conclusion_solved',
    overrideTarget: 'section_8_debt_conclusion_override',
    incorrectTarget: 'section_8_debt_conclusion_incorrect',
  }),

    section_8_debt_conclusion_incorrect: {
      meta: {
        id: 'section_8_debt_conclusion_incorrect',
        text: 'The tunnel thrash proves motion is not the same as progress, and Alex has to narrow the route properly while the whole hull bus complains.\n\nConnectivity is back, but the system now feels like it survived by accumulation rather than design.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_8_exit_debt' },
    },

    section_8_debt_conclusion_solved: {
      meta: {
        id: 'section_8_debt_conclusion_solved',
        text: 'The broad tunnel stops stealing traffic the moment Alex restores a sane boundary around it.\n\nThe farm path holds, the debt stack quiets down a little, and the burned connector becomes the last obvious threat.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_8_exit_debt' },
    },

    section_8_debt_conclusion_override: {
      meta: {
        id: 'section_8_debt_conclusion_override',
        text: 'Alex pins the forced tunnel in place with one more manual rule and gets the sector stable in the least comforting possible way.\n\nThe ship is moving again, but not because the software has learned anything.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_8_exit_debt' },
    },

    section_8_exit_debt: {
      meta: {
        id: 'section_8_exit_debt',
        text:
          'The next notice arrives with the nervous politeness of people who know the system is technically up and emotionally one sharp tap from another incident. Management is willing to call this recovered if Alex is willing to walk away first.',
        task: {
          type: 'single_choice', variant: 'problem',
          options: [
            { id: 'stop', content: 'Stop and sign off' },
            { id: 'continue', content: 'Continue to distributor' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'stop',
            target: 'ending_2',
            actions: [{ type: 'set', params: { accepted_exit_8: true } }, { type: 'score', params: { technical: 0, dedication: -0.4, social: 0.3 } }],
          },
          { guard: ({ event }: any) => event.answer === 'continue', target: 'section_9', actions: [{ type: 'score', params: { technical: 0.1, dedication: 0.4, social: -0.1 } }] },
        ],
      },
    },

}
