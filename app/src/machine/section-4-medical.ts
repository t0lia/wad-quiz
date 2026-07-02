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
        'Clara leads Alex through the medical corridor to a quarantine side gate with cleaner walls and stricter software. Alex presses the emergency keycard to the reader while Clara adds her medical approval to the request. The gate still marks the record as incomplete and keeps the lock sealed.\n\n' +
        'CLARA: The waiver exists. I signed it myself.\n' +
        'ALEX: Then the approval is arriving, but the gate is checking the wrong thing.\n' +
        'CLARA: I can work with either diagnosis.\n' +
        'ALEX: Good. Let us fix the check before we argue with the hardware.',
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
    solvedTarget: 'section_5_medical',
    overrideTarget: 'section_5_medical_fallout',
    incorrectTarget: 'section_5_medical_fallout',
  }),

  ...javaWaiverFieldAlignmentTaskState({
    stateId: 'section_4_medical_task_2',
    solvedTarget: 'section_5_medical',
    overrideTarget: 'section_5_medical_fallout',
    incorrectTarget: 'section_5_medical_fallout',
  }),

  ...javaBadgeCaseNormalizationTaskState({
    stateId: 'section_4_medical_task_3',
    solvedTarget: 'section_5_medical',
    overrideTarget: 'section_5_medical_fallout',
    incorrectTarget: 'section_5_medical_fallout',
  }),

  ...jsWaiverScopeArrayTaskState({
    stateId: 'section_4_medical_task_4',
    solvedTarget: 'section_5_medical',
    overrideTarget: 'section_5_medical_fallout',
    incorrectTarget: 'section_5_medical_fallout',
  }),

  ...javaEscortNullFallbackTaskState({
    stateId: 'section_4_medical_task_5',
    solvedTarget: 'section_5_medical',
    overrideTarget: 'section_5_medical_fallout',
    incorrectTarget: 'section_5_medical_fallout',
  }),
}
