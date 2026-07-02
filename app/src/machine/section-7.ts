import type { ChallengeSceneData } from '../types/story'

export const section7States = {
  // ── Section 7: EVA Decision ────────────────────────────────
  section_7: {
    meta: {
      id: 'section_7',
      text:
        'The outer hatch grinds open and the dark gap outside the ship answers with silence. Ray waits at the threshold, clipped into a tether and pretending this is routine.\n\n' +
        'RAY: I can stay on the inner panel and work the checklist with you, or you can go solo and enjoy pure professional freedom.\n' +
        'ALEX: Your definition of freedom feels hostile.\n' +
        'RAY: Vacuum improves honesty.',
      task: {
        type: 'single_choice', variant: 'problem',
        options: [
          { id: 'team_eva', content: 'Shared Tether with Ray' },
          { id: 'solo_eva', content: 'Solo Tether' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event, context }: any) => event.answer === 'team_eva' && context.route_choice === 'cargo', target: 'section_7_exit_cargo', actions: [{ type: 'set', params: { eva_mode: 'team' } }, { type: 'score', params: { technical: 0.1, dedication: 0.2, social: 0.7 } }] },
        { guard: ({ event, context }: any) => event.answer === 'team_eva' && context.route_choice === 'medical', target: 'section_7_exit_medical', actions: [{ type: 'set', params: { eva_mode: 'team' } }, { type: 'score', params: { technical: 0.1, dedication: 0.2, social: 0.7 } }] },
        { guard: ({ event, context }: any) => event.answer === 'solo_eva' && context.route_choice === 'cargo', target: 'section_7_exit_cargo', actions: [{ type: 'set', params: { eva_mode: 'solo' } }, { type: 'score', params: { technical: 0.2, dedication: 0.1, social: -0.5 } }] },
        { guard: ({ event, context }: any) => event.answer === 'solo_eva' && context.route_choice === 'medical', target: 'section_7_exit_medical', actions: [{ type: 'set', params: { eva_mode: 'solo' } }, { type: 'score', params: { technical: 0.2, dedication: 0.1, social: -0.5 } }] },
      ],
    },
  },

  // ── Section 7 Exit: Cargo Route ────────────────────────────
  section_7_exit_cargo: {
    meta: {
      id: 'section_7_exit_cargo',
      text:
        'A legal handoff notice appears on the PDA just as the cargo-side support line steadies. Behind Alex, the freight path is finally quiet, which feels less like peace than a pause between incidents.\n\n' +
        'RAY: Freight is stable enough that you could hand this off and let another shift hate the rest.\n' +
        'ALEX: That is a strangely persuasive sales pitch.\n' +
        'RAY: It comes from experience and lower optimism.',
      task: {
        type: 'single_choice', variant: 'problem',
        options: [
          { id: 'stop_after_7', content: 'My shift is over, I\'ve had enough for tonight!' },
          { id: 'continue_after_7', content: 'Duty calls! Who will fix this mess if not me?! I carry on' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'stop_after_7', target: 'section_7_exit_cargo_stop', actions: [{ type: 'set', params: { accepted_exit_7: true } }, { type: 'score', params: { technical: 0, dedication: -0.6, social: 0.4 } }] },
        { guard: ({ event, context }: any) => event.answer === 'continue_after_7' && context.debt_count >= 2, target: 'section_8_debt_intro', actions: [{ type: 'set', params: { accepted_exit_7: false } }, { type: 'score', params: { technical: 0, dedication: 0.5, social: -0.2 } }] },
        { guard: ({ event, context }: any) => event.answer === 'continue_after_7' && context.debt_count < 2, target: 'section_8_clean_intro', actions: [{ type: 'set', params: { accepted_exit_7: false } }, { type: 'score', params: { technical: 0, dedication: 0.5, social: -0.2 } }] },
      ],
    },
  },

  section_7_exit_cargo_stop: {
    meta: {
      id: 'section_7_exit_cargo_stop',
      text: 'Alex closes the emergency session while freight keeps breathing and the audit trail keeps waiting.\n\nThe ship survives the night, though not cleanly and not entirely because of Alex.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'ending_1' },
  },

  // ── Section 7 Exit: Medical Route ──────────────────────────
  section_7_exit_medical: {
    meta: {
      id: 'section_7_exit_medical',
      text: 'As Alex reaches the first stable foothold outside, the PDA projects a medical risk waiver across the visor. Someone in Compliance has concluded that partial recovery plus distance from liability now counts as a plan.\n\n' +
        'RAY: Medical is offering you a respectable retreat while everyone is still technically safe.\n' +
        'ALEX: Respectable is doing a lot of work there.\n' +
        'RAY: That is why they let the form write itself.',
      task: {
        type: 'single_choice', variant: 'problem',
        options: [
          { id: 'stop_after_7', content: 'My shift is over, I\'ve had enough for tonight!' },
          { id: 'continue_after_7', content: 'Duty calls! Who will fix this mess if not me?! I carry on' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'stop_after_7', target: 'section_7_exit_medical_stop', actions: [{ type: 'set', params: { accepted_exit_7: true } }, { type: 'score', params: { technical: 0, dedication: -0.6, social: 0.4 } }] },
        { guard: ({ event, context }: any) => event.answer === 'continue_after_7' && context.debt_count >= 2, target: 'section_8_debt_intro', actions: [{ type: 'set', params: { accepted_exit_7: false } }, { type: 'score', params: { technical: 0, dedication: 0.5, social: -0.2 } }] },
        { guard: ({ event, context }: any) => event.answer === 'continue_after_7' && context.debt_count < 2, target: 'section_8_clean_intro', actions: [{ type: 'set', params: { accepted_exit_7: false } }, { type: 'score', params: { technical: 0, dedication: 0.5, social: -0.2 } }] },
      ],
    },
  },

  section_7_exit_medical_stop: {
    meta: {
      id: 'section_7_exit_medical_stop',
      text: 'Alex takes the respectable retreat and lets a future shift inherit the part that still involves vacuum and regret.\n\nThe ship survives the night, and Clara gets a cleaner report than she expected.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'ending_1' },
  },
}
