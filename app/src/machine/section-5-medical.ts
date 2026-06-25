import type { ChallengeSceneData } from '../types/story'

export const section5MedicalStates = {
  // ── Section 5 Medical: Clean Airlock Prep ───────────────
  section_5_medical: {
    meta: {
      id: 'section_5_medical',
      text:
        'The medical corridor reaches Airlock #4 with Clara\'s approval logs clean. The medical checklist is advancing without hiccups. Clara nods and marks you clear for the next phase.\n\n' +
        'CLARA: The drone payload is ready. The sterile shell is installed.\n' +
        'ALEX: Is the profile loaded correctly or are we fixing problems as we go?\n' +
        'CLARA: Choose your style.\n' +
        'VEX: Both styles work. One just keeps the drama downstairs.',
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
        'The shortcut through the quarantine gate has left compliance debris. Clara is still professional, but now there\'s extra documentation and a note about the override in the handoff packet.\n\n' +
        'CLARA: I am going to describe that gate incident later with adjectives.\n' +
        'ALEX: Please choose gentle adjectives.\n' +
        'VEX: First survive vacuum. Then negotiate vocabulary.\n' +
        'ALEX: Fine. What are my bad options for the drone?',
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
