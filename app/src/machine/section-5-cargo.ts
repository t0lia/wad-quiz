import type { ChallengeSceneData } from '../types/story'

export const section5CargoStates = {
  // ── Section 5 Cargo: Clean Arrival At Airlock #4 ────────
  section_5_cargo: {
    meta: {
      id: 'section_5_cargo',
      image: '/locations/airlock_4.png',
      title: 'Clean Arrival At Airlock #4',
      text: 'The cargo lane reaches Airlock #4, where Vex already has Shmiel waiting. The maintenance drone is on site, but its current profile still thinks this is an indoor freight job, and space has very strict feedback about that kind of mistake.',
      dialogue: [
        { speaker: 'vex', text: 'You made good time. Meet Shmiel, a maintenance drone. Last time it was used for inside dust removal, so its software might be a bit surprised by your mission outside.' },
        { speaker: 'alex', text: 'So we have an outside repair job and a drone that still thinks in vacuum cleaner terms.' },
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
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_6_cargo_intro', actions: [{ type: 'set', params: { drone_mode: 'patch' } }, { type: 'score', params: { technical: 0.5, dedication: 0.4, social: 0.1 } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_6_cargo_intro', actions: [{ type: 'set', params: { drone_mode: 'override' } }, { type: 'score', params: { technical: -0.4, dedication: -0.5, social: -0.2 } }] },
      ],
    },
  },

  // ── Section 5 Cargo: Airlock #4 Under Audit Smoke ───────
  section_5_cargo_fallout: {
    meta: {
      id: 'section_5_cargo_fallout',
      image: '/locations/airlock_4.png',
      title: 'Airlock #4 Under Audit Smoke',
      text: 'By the time Alex reaches Airlock #4, Vex already has Shmiel waiting. The maintenance drone is on site, but its current profile still expects a routine indoor freight task, and vacuum is famously unhelpful when software makes that assumption.',
      dialogue: [
        { speaker: 'vex', text: 'You smell like a door override and a rushed explanation. Meet Shmiel, a maintenance drone. Last time it was used for indoor freight work, so its software may take your outside mission as a personal insult.' },
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
        { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_6_cargo_intro', actions: [{ type: 'set', params: { drone_mode: 'patch' } }, { type: 'score', params: { technical: 0.5, dedication: 0.4, social: 0.1 } }] },
        { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_6_cargo_intro', actions: [{ type: 'set', params: { drone_mode: 'override' } }, { type: 'score', params: { technical: -0.4, dedication: -0.5, social: -0.2 } }] },
      ],
    },
  },
}
