import type { ChallengeSceneData } from '../types/story'
import { jsClampBooleanPayloadTaskState } from './tasks/07-js_clamp_boolean_payload'
import { javaShellFieldAlignmentTaskState } from './tasks/08-java_shell_field_alignment'
import { javaProfileMergeResetTaskState } from './tasks/17-java_profile_merge_reset'
import { jsBeaconNestedFieldTaskState } from './tasks/18-js_beacon_nested_field'
import { javaModeSuffixAlignmentTaskState } from './tasks/19-java_mode_suffix_alignment'

export const section6MedicalStates = {
  section_6_medical_intro: {
    meta: {
      id: 'section_6_medical_intro',
      text:
        'The medical shell closes around Shmiel with a soft click. The drone gets the new settings, but once it moves into outside mode, it never turns on the clean shell setting.\n\n' +
        'VEX: The drone gets the message, but it never sees the switch that should turn the clean shell on.\n' +
        'ALEX: So the message arrives, but the important bit is written the wrong way.\n' +
        'CLARA: That is a much friendlier sentence than the one you usually say.\n' +
        'ALEX: I contain multitudes.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.rand < 0.2,
          target: 'section_6_medical_task_1',
        },
        {
          guard: ({ event }: any) => event.rand < 0.4,
          target: 'section_6_medical_task_2',
        },
        {
          guard: ({ event }: any) => event.rand < 0.6,
          target: 'section_6_medical_task_3',
        },
        {
          guard: ({ event }: any) => event.rand < 0.8,
          target: 'section_6_medical_task_4',
        },
        {
          target: 'section_6_medical_task_5',
        },
      ],
    },
  },

  ...jsClampBooleanPayloadTaskState({
    stateId: 'section_6_medical_task_1',
    solvedTarget: 'section_7',
    overrideTarget: 'section_7',
    incorrectTarget: 'section_7',
  }),

  ...javaShellFieldAlignmentTaskState({
    stateId: 'section_6_medical_task_2',
    solvedTarget: 'section_7',
    overrideTarget: 'section_7',
    incorrectTarget: 'section_7',
  }),

  ...javaProfileMergeResetTaskState({
    stateId: 'section_6_medical_task_3',
    solvedTarget: 'section_7',
    overrideTarget: 'section_7',
    incorrectTarget: 'section_7',
  }),

  ...jsBeaconNestedFieldTaskState({
    stateId: 'section_6_medical_task_4',
    solvedTarget: 'section_7',
    overrideTarget: 'section_7',
    incorrectTarget: 'section_7',
  }),

  ...javaModeSuffixAlignmentTaskState({
    stateId: 'section_6_medical_task_5',
    solvedTarget: 'section_7',
    overrideTarget: 'section_7',
    incorrectTarget: 'section_7',
  }),
}
