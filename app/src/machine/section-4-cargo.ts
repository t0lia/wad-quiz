import type { ChallengeSceneData } from '../types/story'
import { javaAccessLevelCompareTaskState } from './tasks/05-java_access_level_compare'
import { javaWaiverFieldAlignmentTaskState } from './tasks/06-java_waiver_field_alignment'
import { javaBadgeCaseNormalizationTaskState } from './tasks/14-java_badge_case_normalization'
import { jsWaiverScopeArrayTaskState } from './tasks/15-js_waiver_scope_array'
import { javaEscortNullFallbackTaskState } from './tasks/16-java_escort_null_fallback'

export const section4CargoStates = {
  // ── Section 4 Cargo: Intro ───────────────────────────────
  section_4_cargo_intro: {
    meta: {
      id: 'section_4_cargo_intro',
      text:
        'Tony meets Alex at the freight checkpoint with a handheld scanner and the expression of a man who expected a simpler night. The cargo-side maintenance gate can see the emergency tag, the route authorization, and Tony\'s temporary pass. It still refuses to open.\n\n' +
        'TONY: I filed the freight pass ten minutes ago. The gate is being dramatic.\n' +
        'ALEX: No, the gate is being written in Java.\n' +
        'TONY: Is that better or worse than dramatic?\n' +
        'ALEX: Usually slower.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.rand < 0.2,
          target: 'section_4_cargo_task_1',
        },
        {
          guard: ({ event }: any) => event.rand < 0.4,
          target: 'section_4_cargo_task_2',
        },
        {
          guard: ({ event }: any) => event.rand < 0.6,
          target: 'section_4_cargo_task_3',
        },
        {
          guard: ({ event }: any) => event.rand < 0.8,
          target: 'section_4_cargo_task_4',
        },
        {
          target: 'section_4_cargo_task_5',
        },
      ],
    },
  },

  ...javaAccessLevelCompareTaskState({
    stateId: 'section_4_cargo_task_1',
    solvedTarget: 'section_5_cargo',
    overrideTarget: 'section_5_cargo_fallout',
    incorrectTarget: 'section_5_cargo_fallout',
  }),

  ...javaWaiverFieldAlignmentTaskState({
    stateId: 'section_4_cargo_task_2',
    solvedTarget: 'section_5_cargo',
    overrideTarget: 'section_5_cargo_fallout',
    incorrectTarget: 'section_5_cargo_fallout',
  }),

  ...javaBadgeCaseNormalizationTaskState({
    stateId: 'section_4_cargo_task_3',
    solvedTarget: 'section_5_cargo',
    overrideTarget: 'section_5_cargo_fallout',
    incorrectTarget: 'section_5_cargo_fallout',
  }),

  ...jsWaiverScopeArrayTaskState({
    stateId: 'section_4_cargo_task_4',
    solvedTarget: 'section_5_cargo',
    overrideTarget: 'section_5_cargo_fallout',
    incorrectTarget: 'section_5_cargo_fallout',
  }),

  ...javaEscortNullFallbackTaskState({
    stateId: 'section_4_cargo_task_5',
    solvedTarget: 'section_5_cargo',
    overrideTarget: 'section_5_cargo_fallout',
    incorrectTarget: 'section_5_cargo_fallout',
  }),
}
