import type { ChallengeSceneData } from '../types/story'
import { javaWaiverFieldAlignmentTaskState } from './tasks/06-java_waiver_field_alignment'

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
      NEXT: 'section_4_medical_task',
    },
  },

  ...javaWaiverFieldAlignmentTaskState({
    stateId: 'section_4_medical_task',
    solvedTarget: 'section_4_medical_conclusion_solved',
    overrideTarget: 'section_4_medical_conclusion_override',
    incorrectTarget: 'section_4_medical_conclusion_incorrect',
  }),

  section_4_medical_conclusion_incorrect: {
    meta: {
      id: 'section_4_medical_conclusion_incorrect',
      text: 'The first guesses never reach the real gate logic. Whether Alex blames the scanner or weakens quarantine policy, the side gate only opens once he fixes the check it actually reads.\n\nThe quarantine lane opens, but only after the medical side learns exactly how avoidable this was.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_medical_fallout' },
  },

  section_4_medical_conclusion_solved: {
    meta: {
      id: 'section_4_medical_conclusion_solved',
      text: 'The gate unlocks the moment Alex aligns the access check with the field it was always supposed to read. Clara gives the panel a look usually reserved for contagious stupidity.\n\nThe decontamination corridor clears cleanly toward Airlock #4.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_medical' },
  },

  section_4_medical_conclusion_override: {
    meta: {
      id: 'section_4_medical_conclusion_override',
      text: 'Alex trips the manual release, the seal cycles open, and quarantine policy becomes an abstract concept for thirty uncomfortable seconds.\n\nThe route is open, but medical now owes itself a serious internal conversation.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_medical_fallout' },
  },
}
