import type { ChallengeSceneData } from '../types/story'
import { javaAccessLevelCompareTaskState } from './tasks/05-java_access_level_compare'
import { javaWaiverFieldAlignmentTaskState } from './tasks/06-java_waiver_field_alignment'
import { javaBadgeCaseNormalizationTaskState } from './tasks/14-java_badge_case_normalization'
import { jsWaiverScopeArrayTaskState } from './tasks/15-js_waiver_scope_array'
import { javaEscortNullFallbackTaskState } from './tasks/16-java_escort_null_fallback'

export const section4MedicalStates = {
  // ── Section 4 Medical: Intro ─────────────────────────────
  section_4_medical_intro: {
    meta: {
      id: 'section_4_medical_intro',
      text:
        'Clara leads Alex through the medical corridor to a quarantine side gate with cleaner walls and angrier software. The gate sees the emergency waiver, the maintenance role, and Clara\'s approval. It still declares the record incomplete and keeps the lock engaged.\n\n' +
        'CLARA: The waiver exists. I signed it myself.\n' +
        'ALEX: Then the gate is either afraid of doctors or confused by field names.\n' +
        'CLARA: I can work with either diagnosis.\n' +
        'ALEX: Let us start with the one that compiles.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.rand < 0.2,
          target: 'section_4_medical_task_1',
        },
        {
          guard: ({ event }: any) => event.rand < 0.4,
          target: 'section_4_medical_task_2',
        },
        {
          guard: ({ event }: any) => event.rand < 0.6,
          target: 'section_4_medical_task_3',
        },
        {
          guard: ({ event }: any) => event.rand < 0.8,
          target: 'section_4_medical_task_4',
        },
        {
          target: 'section_4_medical_task_5',
        },
      ],
    },
  },

  ...javaAccessLevelCompareTaskState({
    stateId: 'section_4_medical_task_1',
    solvedTarget: 'section_4_medical_conclusion_solved',
    overrideTarget: 'section_4_medical_conclusion_override',
    incorrectTarget: 'section_4_medical_conclusion_incorrect',
  }),

  ...javaWaiverFieldAlignmentTaskState({
    stateId: 'section_4_medical_task_2',
    solvedTarget: 'section_4_medical_conclusion_solved',
    overrideTarget: 'section_4_medical_conclusion_override',
    incorrectTarget: 'section_4_medical_conclusion_incorrect',
  }),

  ...javaBadgeCaseNormalizationTaskState({
    stateId: 'section_4_medical_task_3',
    solvedTarget: 'section_4_medical_conclusion_solved',
    overrideTarget: 'section_4_medical_conclusion_override',
    incorrectTarget: 'section_4_medical_conclusion_incorrect',
  }),

  ...jsWaiverScopeArrayTaskState({
    stateId: 'section_4_medical_task_4',
    solvedTarget: 'section_4_medical_conclusion_solved',
    overrideTarget: 'section_4_medical_conclusion_override',
    incorrectTarget: 'section_4_medical_conclusion_incorrect',
  }),

  ...javaEscortNullFallbackTaskState({
    stateId: 'section_4_medical_task_5',
    solvedTarget: 'section_4_medical_conclusion_solved',
    overrideTarget: 'section_4_medical_conclusion_override',
    incorrectTarget: 'section_4_medical_conclusion_incorrect',
  }),

  section_4_medical_conclusion_incorrect: {
    meta: {
      id: 'section_4_medical_conclusion_incorrect',
      text: '',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_medical_fallout' },
  },

  section_4_medical_conclusion_solved: {
    meta: {
      id: 'section_4_medical_conclusion_solved',
      text: '',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_medical' },
  },

  section_4_medical_conclusion_override: {
    meta: {
      id: 'section_4_medical_conclusion_override',
      text: '',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_medical_fallout' },
  },
}
