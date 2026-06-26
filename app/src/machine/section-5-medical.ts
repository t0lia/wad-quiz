import type { ChallengeSceneData } from '../types/story'

export const section5MedicalStates = {
  // ── Section 5 Medical: Clean Airlock Prep ───────────────
  section_5_medical: {
    meta: {
      id: 'section_5_medical',
      text:
        'The medical corridor reaches Airlock #4, where Vex already has Shmiel waiting. The drone is on site, but its current profile still thinks this is a routine indoor maintenance job, and sterile hull work is not known for forgiving that kind of confusion.\n\n' +
        'VEX: You made good time. Meet Shmiel - general purpose maintenance drone. Last time it was used for routine indoor cleanup, so its software may be a little confused by sterile hull work.\n' +
        'ALEX: So we have a medical EVA and a drone that still thinks this is housekeeping.\n' +
        'VEX: Exactly. We can patch the profile properly, or bully it into follow mode and hope contamination rules stay theoretical.\n' +
        'ALEX: Then let us choose whether to improve it or frighten it.',
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
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_medical_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_medical_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
      ],
    },
  },

  section_5_medical_conclusion_patch: {
    meta: {
      id: 'section_5_medical_conclusion_patch',
      text: 'Vex loads a careful patch and the drone settles into a less offended idle pattern.\n\nThe sterile profile settles cleanly, and the hatch can cycle once the shell thinks about what safety means.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_medical_intro' },
  },

  section_5_medical_conclusion_override: {
    meta: {
      id: 'section_5_medical_conclusion_override',
      text: 'Vex slams the override path through and the drone obeys with the nervous energy of a badly supervised forklift.\n\nThe hatch can cycle, but the drone link now carries the moral texture of wet duct tape.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_medical_intro' },
  },

  section_5_medical_fallout: {
    meta: {
      id: 'section_5_medical_fallout',
      text:
        'By the time Alex reaches Airlock #4, Vex already has Shmiel waiting. The drone is on site, but its current profile still expects routine indoor maintenance, and sterile hull work is not known for tolerating that kind of confusion.\n\n' +
        'CLARA: I am going to describe that gate incident later with adjectives.\n' +
        'ALEX: Please choose gentle adjectives.\n' +
        'VEX: First survive vacuum. Meet Shmiel - general purpose maintenance drone. Last time it was used for routine indoor cleanup, so its software may be a little confused by sterile hull work.\n' +
        'ALEX: Fine. So my bad options are to educate the drone properly or scare it into cooperation.',
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
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_medical_fallout_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_medical_fallout_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
      ],
    },
  },

  section_5_medical_fallout_conclusion_patch: {
    meta: {
      id: 'section_5_medical_fallout_conclusion_patch',
      text: 'Alex chooses the slower patch and buys one honest component inside an increasingly dishonest evening.\n\nIf the sterile payload behaves, the airlock may still forgive the rest.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_medical_intro' },
  },

  section_5_medical_fallout_conclusion_override: {
    meta: {
      id: 'section_5_medical_fallout_conclusion_override',
      text: 'Alex chooses speed again, and Clara decides that judgment can wait until everyone is back inside with all limbs attached.\n\nThe hatch can cycle, but the drone link now carries the moral texture of wet duct tape.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_medical_intro' },
  },
}
