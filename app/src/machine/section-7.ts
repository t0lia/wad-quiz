import type { ChallengeSceneData } from '../types/story'

export const section7States = {
  // ── Section 7: Outer Hull Plan ──────────────────────────
  section_7: {
    meta: {
      id: 'section_7',
      text:
        'The outer hatch grinds open and the dark hull gap answers with silence. Ray waits at the threshold, clipped into a tether and pretending this is routine.',
      task: {
        type: 'multiple_choice',
        options: [
          { id: 'team', content: 'Team EVA' },
          { id: 'solo', content: 'Solo EVA' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'team', target: 'section_7_exit', actions: [{ type: 'set', params: { eva_mode: 'team' } }] },
        { guard: ({ event }: any) => event.answer === 'solo', target: 'section_7_exit', actions: [{ type: 'set', params: { eva_mode: 'solo' } }] },
      ],
    },
  },

  // ── Section 7 Exit: Cargo/Medical handoff with stop/continue choice
  section_7_exit: {
    meta: {
      id: 'section_7_exit',
      text:
        'A legal handoff notice appears on the PDA. Behind you, the support line steadies. This is the first moment to hand off and stop, or push deeper into the hull repair.',
      task: {
        type: 'multiple_choice',
        options: [
          { id: 'stop', content: 'My shift is over, I\'ve had enough for tonight!' },
          { id: 'continue', content: 'Duty calls! Who will fix this mess if not me?! I carry on' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'stop',
          target: 'ending_1',
          actions: [{ type: 'set', params: { accepted_exit_7: true } }],
        },
        {
          guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count < 2,
          target: 'section_8_clean_intro',
        },
        {
          guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count >= 2,
          target: 'section_8_debt_intro',
        },
      ],
    },
  },
}
