import type { ChallengeSceneData } from '../types/story'

export const section5MedicalStates = {
  // ── Section 5 Medical: Clean Airlock Prep ───────────────
  section_5_medical: {
    meta: {
      id: 'section_5_medical',
      image: '/locations/airlock_4.png',
      title: 'Clean Airlock Prep',
      text: 'The medical corridor reaches Airlock #4, where Vex already has Shmiel waiting. The maintenance drone is on site, but its current profile still thinks this is a routine indoor maintenance job, and sterile outside work is not known for forgiving that kind of confusion.',
      dialogue: [
        { speaker: 'vex', text: 'You made good time. Meet Shmiel, a maintenance drone. Last time it was used for routine indoor cleanup, so its software may be a little confused by sterile outside work.' },
        { speaker: 'clara', text: 'I am staying until the shell profile behaves. Medical does not sign off on improvisation in vacuum.' },
        { speaker: 'alex', text: 'So we have a medical EVA and a drone that still thinks this is housekeeping.' },
        { speaker: 'vex', text: 'Exactly. We can patch the profile properly, or bully it into follow mode and hope contamination rules stay theoretical.' },
        { speaker: 'alex', text: 'Then let us choose whether to improve it or frighten it.' },
      ],
      task: {
        type: 'single_choice',
        variant: 'branch',
        options: [
          { id: 'patch_drone', content: 'Software Patch' },
          { id: 'override_drone', content: 'Hard Override' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_6_medical_intro', actions: [{ type: 'set', params: { drone_mode: 'patch' } }, { type: 'score', params: { technical: 0.5, dedication: 0.4, social: 0.1 } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_6_medical_intro', actions: [{ type: 'set', params: { drone_mode: 'override' } }, { type: 'score', params: { technical: -0.4, dedication: -0.5, social: -0.2 } }] },
      ],
    },
  },

  section_5_medical_fallout: {
    meta: {
      id: 'section_5_medical_fallout',
      image: '/locations/airlock_4.png',
      title: 'Airlock Prep After A Dirty Shortcut',
      text: 'By the time Alex reaches Airlock #4, Vex already has Shmiel waiting. The maintenance drone is on site, but its current profile still expects routine indoor maintenance, and sterile outside work is not known for tolerating that kind of confusion.',
      dialogue: [
        { speaker: 'clara', text: 'I am going to describe that gate incident later with adjectives.' },
        { speaker: 'alex', text: 'Please choose gentle adjectives.' },
        { speaker: 'vex', text: 'First survive vacuum. Meet Shmiel, a maintenance drone. Last time it was used for routine indoor cleanup, so its software may be a little confused by sterile outside work.' },
        { speaker: 'alex', text: 'Fine. So my bad options are to educate the drone properly or scare it into cooperation.' },
      ],
      task: {
        type: 'single_choice',
        variant: 'branch',
        options: [
          { id: 'patch_drone', content: 'Software Patch' },
          { id: 'override_drone', content: 'Hard Override' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_6_medical_intro', actions: [{ type: 'set', params: { drone_mode: 'patch' } }, { type: 'score', params: { technical: 0.5, dedication: 0.4, social: 0.1 } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_6_medical_intro', actions: [{ type: 'set', params: { drone_mode: 'override' } }, { type: 'score', params: { technical: -0.4, dedication: -0.5, social: -0.2 } }] },
      ],
    },
  },
}
