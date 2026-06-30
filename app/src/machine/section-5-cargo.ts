import type { ChallengeSceneData } from '../types/story'

export const section5CargoStates = {
  // ── Section 5 Cargo: Clean Arrival At Airlock #4 ────────
  section_5_cargo: {
    meta: {
      id: 'section_5_cargo',
      image: '/locations/airlock_4.png',
      title: 'Section 5 Cargo: Clean Arrival At Airlock #4',
      text: 'The cargo lane reaches Airlock #4, where Vex already has Shmiel waiting. The drone is on site, but its current profile still thinks this is an indoor freight job, and space has very strict feedback about that kind of mistake.',
      dialogue: [
        { speaker: 'vex', text: 'You made good time. Meet Shmiel - general purpose maintenance drone. Last time it was used for some inside dust removal so his software might be a bit surprised by your open space mission.' },
        { speaker: 'alex', text: 'So we have a hull job and a drone that still thinks in vacuum cleaner terms.' },
        { speaker: 'vex', text: 'Exactly. We can patch the profile properly, or bully it into follow mode and hope space stays patient.' },
        { speaker: 'alex', text: 'Then let us choose what kind of bad idea it becomes.' },
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
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_cargo_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_cargo_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
      ],
    },
  },

  section_5_cargo_conclusion_patch: {
    meta: {
      id: 'section_5_cargo_conclusion_patch',
      image: '/locations/airlock_4.png',
      title: 'Section 5 Cargo: Clean Arrival At Airlock #4',
      text: 'Vex loads a careful patch and the drone settles into a less offended idle pattern.\n\nThe hatch can cycle once the hull follow profile stops arguing with the cargo clamp package.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_cargo_intro' },
  },

  section_5_cargo_conclusion_override: {
    meta: {
      id: 'section_5_cargo_conclusion_override',
      image: '/locations/airlock_4.png',
      title: 'Section 5 Cargo: Clean Arrival At Airlock #4',
      text: 'Vex slams the override path through and the drone obeys with the nervous energy of a badly supervised forklift.\n\nThe hatch can cycle, provided Alex fixes the follow profile before the override starts improvising.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_cargo_intro' },
  },

  // ── Section 5 Cargo: Airlock #4 Under Audit Smoke ───────
  section_5_cargo_fallout: {
    meta: {
      id: 'section_5_cargo_fallout',
      image: '/locations/airlock_4.png',
      title: 'Section 5 Cargo: Airlock #4 Under Audit Smoke',
      text: 'By the time Alex reaches Airlock #4, Vex already has Shmiel waiting. The drone is on site, but its current profile still expects a routine indoor freight task, and vacuum is famously unhelpful when software makes that assumption.',
      dialogue: [
        { speaker: 'vex', text: 'You smell like a door override and a rushed explanation. Meet Shmiel - general purpose maintenance drone. Last time it was used for indoor freight work, so its software may take your hull mission as a personal insult.' },
        { speaker: 'alex', text: 'So the route is already messy, and now the drone thinks we are still inside.' },
        { speaker: 'vex', text: 'Exactly. We can patch the profile properly, or bully it into follow mode and hope space stays weirdly forgiving.' },
        { speaker: 'alex', text: 'No promises, but I respect the goal.' },
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
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_cargo_fallout_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_cargo_fallout_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
      ],
    },
  },

  section_5_cargo_fallout_conclusion_patch: {
    meta: {
      id: 'section_5_cargo_fallout_conclusion_patch',
      image: '/locations/airlock_4.png',
      title: 'Section 5 Cargo: Airlock #4 Under Audit Smoke',
      text: 'Alex chooses the slower patch and buys one honest component inside an increasingly dishonest evening.\n\nIf the profile payload behaves, the airlock may still forgive the rest.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_cargo_intro' },
  },

  section_5_cargo_fallout_conclusion_override: {
    meta: {
      id: 'section_5_cargo_fallout_conclusion_override',
      image: '/locations/airlock_4.png',
      title: 'Section 5 Cargo: Airlock #4 Under Audit Smoke',
      text: 'Alex chooses speed again, and Vex decides that judgment can wait until everyone is back inside with all limbs attached.\n\nThe hatch can cycle, but the drone link now carries the moral texture of wet duct tape.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_6_cargo_intro' },
  },
}
