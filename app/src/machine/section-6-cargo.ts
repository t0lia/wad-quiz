import type { ChallengeSceneData } from '../types/story'
import { jsClampBooleanPayloadTaskState } from './tasks/07-js_clamp_boolean_payload'

export const section6CargoStates = {
  section_6_cargo_intro: {
    meta: {
      id: 'section_6_cargo_intro',
      text:
        'The cargo lane reaches Airlock #4, where Vex already has Shmiel waiting. The drone is on site, but its current profile still thinks this is an indoor freight job, and space has very strict feedback about that kind of mistake.\n\n' +
        'VEX: You made good time. Meet Shmiel - general purpose maintenance drone. Last time it was used for some inside dust removal so his software might be a bit surprised by your open space mission.\n' +
        'ALEX: So we have a hull job and a drone that still thinks in vacuum cleaner terms.\n' +
        'VEX: Exactly. We can patch the profile properly, or bully it into follow mode and hope space stays patient.\n' +
        'ALEX: Then let us choose what kind of bad idea it becomes.',
      task: {
        type: 'multiple_choice',
        options: [
          { id: 'patch_drone', content: 'Software Patch' },
          { id: 'override_drone', content: 'Hard Override' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_6_cargo_task', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_6_cargo_task', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
      ],
    },
  },

  ...jsClampBooleanPayloadTaskState({
    stateId: 'section_6_cargo_task',
    solvedTarget: 'section_6_cargo_conclusion_solved',
    overrideTarget: 'section_6_cargo_conclusion_override',
    incorrectTarget: 'section_6_cargo_conclusion_incorrect',
  }),

  section_6_cargo_conclusion_incorrect: {
    meta: {
      id: 'section_6_cargo_conclusion_incorrect',
      text: 'Battery guesses and rough fallback behavior waste time. Alex still has to correct the profile value the drone actually reads before the outside setup behaves.\n\nHull movement is possible now, and the only remaining question is whether Alex takes Ray along.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_cargo_conclusion_solved: {
    meta: {
      id: 'section_6_cargo_conclusion_solved',
      text: 'The corrected profile goes in cleanly, the clamp behaves, and Shmiel suddenly looks much more useful.\n\nThe outer hatch is ready, and Ray is already waiting with a new definition of teamwork.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_cargo_conclusion_override: {
    meta: {
      id: 'section_6_cargo_conclusion_override',
      text: 'Alex forces the drone into a manual support mode that works right away and looks very temporary. The hatch is ready, but Alex steps outside relying on another temporary fix. However he\'s feeling lucky.\n\nThe outer hatch is ready, and Ray is waiting with questions about exactly how confident Alex is today.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },
}
