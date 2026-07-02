import type { ChallengeSceneData } from '../types/story'
import { javaShellFieldAlignmentTaskState } from './tasks/08-java_shell_field_alignment'

export const section6MedicalStates = {
  section_6_medical_intro: {
    meta: {
      id: 'section_6_medical_intro',
      text:
        'The medical corridor reaches Airlock #4, where Vex already has Shmiel waiting. The drone is on site, but its current profile still thinks this is a routine indoor maintenance job, and sterile hull work is not known for forgiving that kind of confusion.\n\n' +
        'VEX: You made good time. Meet Shmiel - general purpose maintenance drone. Last time it was used for routine indoor cleanup, so its software may be a little confused by sterile hull work.\n' +
        'ALEX: So we have a medical EVA and a drone that still thinks this is housekeeping.\n' +
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
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_6_medical_task', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_6_medical_task', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
      ],
    },
  },

  ...javaShellFieldAlignmentTaskState({
    stateId: 'section_6_medical_task',
    solvedTarget: 'section_6_medical_conclusion_solved',
    overrideTarget: 'section_6_medical_conclusion_override',
    incorrectTarget: 'section_6_medical_conclusion_incorrect',
  }),

  section_6_medical_conclusion_incorrect: {
    meta: {
      id: 'section_6_medical_conclusion_incorrect',
      text: 'Guesses about hardware or emergency overrides do not fix what the drone actually reads. Alex has to correct the seal comparison before the sterile containment behaves.\n\nHull movement is finally possible, and Ray is waiting for Alex outside, along with medical\'s persistent question about whether Alex took sterility seriously.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_medical_conclusion_solved: {
    meta: {
      id: 'section_6_medical_conclusion_solved',
      text: 'The corrected seal comparison goes in cleanly, the containment stabilizes, and Shmiel suddenly looks properly sterile.\n\nThe outer hatch is ready, and Ray is already waiting with a new definition of medical teamwork.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_medical_conclusion_override: {
    meta: {
      id: 'section_6_medical_conclusion_override',
      text: 'Alex overrides the containment check and forces Shmiel into manual mode that ignores the sterility warnings. It works immediately and looks extremely temporary.\n\nThe outer hatch is ready, but medical sterility is now an optimistic concept. Ray is waiting with questions about how confident Alex is in this approach.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },
}
