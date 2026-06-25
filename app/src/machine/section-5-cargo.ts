import type { ChallengeSceneData } from '../types/story'

export const section5CargoStates = {
  // ── Section 5 Cargo: Clean Arrival At Airlock #4 ────────
  section_5_cargo: {
    meta: {
      id: 'section_5_cargo',
      text:
        'The cargo lane reaches Airlock #4 without incident. Tony waves you through with his scanner now properly accepting the shared credential model. The container prep sequence is running clean.\n\n' +
        'VEX: Freight delivered you in one piece. I respect that lane more than most people.\n' +
        'ALEX: Is the drone ready for hull work or just ready to complain about hull work?\n' +
        'VEX: Both. It is a very complete machine.\n' +
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
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_cargo_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_cargo_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
      ],
    },
  },

  section_5_cargo_conclusion_patch: {
    meta: {
      id: 'section_5_cargo_conclusion_patch',
      text: 'Vex loads a careful patch and the drone settles into a less offended idle pattern.\n\nThe hatch can cycle once the hull follow profile stops arguing with the cargo clamp package.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_cargo_intro' },
  },

  section_5_cargo_conclusion_override: {
    meta: {
      id: 'section_5_cargo_conclusion_override',
      text: 'Vex slams the override path through and the drone obeys with the nervous energy of a badly supervised forklift.\n\nThe hatch can cycle, provided Alex fixes the follow profile before the override starts improvising.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_cargo_intro' },
  },

  // ── Section 5 Cargo: Airlock #4 Under Audit Smoke ───────
  section_5_cargo_fallout: {
    meta: {
      id: 'section_5_cargo_fallout',
      text:
        'By the time Alex reaches Airlock #4, there\'s a maintenance alarm cycling in the corner. The freight pass issue left some debris in the audit logs, and now the gate is double-checking permissions with suspicious slowness.\n\n' +
        'VEX: You smell like a door override and a rushed explanation.\n' +
        'ALEX: That is because both happened.\n' +
        'VEX: Fine. Then let us avoid adding drone rebellion to the list.\n' +
        'ALEX: No promises, but I respect the goal.',
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
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_cargo_fallout_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_cargo_fallout_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
      ],
    },
  },

  section_5_cargo_fallout_conclusion_patch: {
    meta: {
      id: 'section_5_cargo_fallout_conclusion_patch',
      text: 'Alex chooses the slower patch and buys one honest component inside an increasingly dishonest evening.\n\nIf the profile payload behaves, the airlock may still forgive the rest.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_cargo_intro' },
  },

  section_5_cargo_fallout_conclusion_override: {
    meta: {
      id: 'section_5_cargo_fallout_conclusion_override',
      text: 'Alex chooses speed again, and Vex decides that judgment can wait until everyone is back inside with all limbs attached.\n\nThe hatch can cycle, but the drone link now carries the moral texture of wet duct tape.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_cargo_intro' },
  },
}
