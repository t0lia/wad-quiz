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
        'The medical corridor reaches Airlock #4, where Vex already has Shmiel waiting. The maintenance drone is on site, but its current profile still thinks this is a routine indoor maintenance job, and outside work is not known for forgiving that kind of confusion.\n\n' +
        'VEX: You made good time. Meet Shmiel, a maintenance drone. Last time it was used for routine indoor cleanup, so its software may be a bit confused by your mission outside.\n' +
        'ALEX: So we have an outside repair job and a drone that still thinks this is housekeeping.\n' +
        'VEX: Exactly. We can patch the profile properly, or bully it into follow mode and hope contamination rules stay theoretical.\n' +
        'ALEX: Then let us choose whether to improve it or frighten it.',
      task: {
        type: 'single_choice', variant: 'problem',
        options: [
          { id: 'patch_drone', content: 'Software Patch' },
          { id: 'override_drone', content: 'Hard Override' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'patch_drone' && event.rand < 0.2, target: 'section_6_medical_task_1', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'patch_drone' && event.rand < 0.4, target: 'section_6_medical_task_2', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'patch_drone' && event.rand < 0.6, target: 'section_6_medical_task_3', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'patch_drone' && event.rand < 0.8, target: 'section_6_medical_task_4', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_6_medical_task_5', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone' && event.rand < 0.2, target: 'section_6_medical_task_1', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone' && event.rand < 0.4, target: 'section_6_medical_task_2', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone' && event.rand < 0.6, target: 'section_6_medical_task_3', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone' && event.rand < 0.8, target: 'section_6_medical_task_4', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_6_medical_task_5', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
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
