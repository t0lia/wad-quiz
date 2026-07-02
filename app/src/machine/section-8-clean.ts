import type { ChallengeSceneData } from '../types/story'
import { pyFarmPrefixBoundaryTaskState } from './tasks/09-py_farm_prefix_boundary'
import { javaRouteScopeBoundaryTaskState } from './tasks/10-java_route_scope_boundary'
import { javaGatewayHostRouteBoundaryTaskState } from './tasks/20-java_gateway_host_route_boundary'
import { pyHullVlanPrefixOverlapTaskState } from './tasks/21-py_hull_vlan_prefix_overlap'
import { jsTunnelPrefixFallbackTaskState } from './tasks/22-js_tunnel_prefix_fallback'

export const section8CleanStates = {
  // ── Section 8 Clean: Intro ───────────────────────────────
  section_8_clean_intro: {
    meta: {
      id: 'section_8_clean_intro',
      text:
        'The technical gap is narrow, dark, and almost manageable. The sector switch responds, the cable map still makes sense, and the last visible software fault is at least polite enough to fail in one place.\n\n' +
        'ALEX: The switch responds, but traffic keeps wandering off into the wrong network.\n' +
        'RAY: Then bring the network boundary back where it belongs.\n' +
        'ALEX: I would love one problem tonight that stays politely inside its own lines.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.rand < 0.2,
          target: 'section_8_clean_task_1',
        },
        {
          guard: ({ event }: any) => event.rand < 0.4,
          target: 'section_8_clean_task_2',
        },
        {
          guard: ({ event }: any) => event.rand < 0.6,
          target: 'section_8_clean_task_3',
        },
        {
          guard: ({ event }: any) => event.rand < 0.8,
          target: 'section_8_clean_task_4',
        },
        {
          target: 'section_8_clean_task_5',
        },
      ],
    },
  },

  ...pyFarmPrefixBoundaryTaskState({
    stateId: 'section_8_clean_task_1',
    solvedTarget: 'section_8_clean_conclusion_solved',
    overrideTarget: 'section_8_clean_conclusion_override',
    incorrectTarget: 'section_8_clean_conclusion_incorrect',
  }),

  ...javaRouteScopeBoundaryTaskState({
    stateId: 'section_8_clean_task_2',
    solvedTarget: 'section_8_clean_conclusion_solved',
    overrideTarget: 'section_8_clean_conclusion_override',
    incorrectTarget: 'section_8_clean_conclusion_incorrect',
  }),

  ...javaGatewayHostRouteBoundaryTaskState({
    stateId: 'section_8_clean_task_3',
    solvedTarget: 'section_8_clean_conclusion_solved',
    overrideTarget: 'section_8_clean_conclusion_override',
    incorrectTarget: 'section_8_clean_conclusion_incorrect',
  }),

  ...pyHullVlanPrefixOverlapTaskState({
    stateId: 'section_8_clean_task_4',
    solvedTarget: 'section_8_clean_conclusion_solved',
    overrideTarget: 'section_8_clean_conclusion_override',
    incorrectTarget: 'section_8_clean_conclusion_incorrect',
  }),

  ...jsTunnelPrefixFallbackTaskState({
    stateId: 'section_8_clean_task_5',
    solvedTarget: 'section_8_clean_conclusion_solved',
    overrideTarget: 'section_8_clean_conclusion_override',
    incorrectTarget: 'section_8_clean_conclusion_incorrect',
  }),

  section_8_clean_conclusion_incorrect: {
    meta: {
      id: 'section_8_clean_conclusion_incorrect',
      text: 'The switch reboot adds noise, the static shortcut adds future pain, and Alex still ends up correcting the boundary before the segment behaves.\n\nConnectivity is back, but the outside repair ahead no longer feels like the only fragile thing on the ship.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  section_8_clean_conclusion_solved: {
    meta: {
      id: 'section_8_clean_conclusion_solved',
      text: 'The route settles the moment the farm segment gets the boundary it should have had from the start.\n\nBackbone service is mostly restored, and the burned connector is now the last obvious wound.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  section_8_clean_conclusion_override: {
    meta: {
      id: 'section_8_clean_conclusion_override',
      text: 'Alex forces a direct tunnel through the gap and gets traffic moving again under a layer of technical debt thin enough to hear creak.\n\nThe ship can breathe, but it has started depending on one more bad secret.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  // ── Section 8 Exit: Partial recovery or containment ──────
  section_8_exit_clean: {
    meta: {
      id: 'section_8_exit_clean',
      text:
        'The PDA receives a second notice. This one sounds almost optimistic, which is how Alex knows it was written far away from the outside repair site.',
      task: {
        type: 'single_choice', variant: 'problem',
        options: [
          { id: 'stop', content: 'Stop With Partial Recovery' },
          { id: 'continue', content: 'Continue To The Connector' },
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
