import type { ChallengeSceneData } from '../types/story'

export const section7States = {
  // ── Section 7: EVA Decision ────────────────────────────────
  section_7: {
    meta: {
      id: 'section_7',
      text:
        'The outer hatch grinds open and the dark hull gap answers with silence. Ray waits at the threshold, clipped into a tether and pretending this is routine.\n\n' +
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
        { guard: ({ event }: any) => event.answer === 'team_eva', target: 'section_7_conclusion_team', actions: [{ type: 'set', params: { eva_mode: 'team' } }, { type: 'score', params: { technical: 0.1, dedication: 0.2, social: 0.7 } }] },
        { guard: ({ event }: any) => event.answer === 'solo_eva', target: 'section_7_conclusion_solo', actions: [{ type: 'set', params: { eva_mode: 'solo' } }, { type: 'score', params: { technical: 0.2, dedication: 0.1, social: -0.5 } }] },
      ],
    },
  },

  section_7_conclusion_team: {
    meta: {
      id: 'section_7_conclusion_team',
      text: 'Ray clips into the shared plan and starts mirroring Alex\'s checklist from the inner panel.\n\nThe ship offers one polite chance to stop before the deeper hull work begins.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: ({ context }: any) => context.route_choice === 'cargo' ? 'section_7_exit_cargo' : 'section_7_exit_medical' },
  },

  section_7_conclusion_solo: {
    meta: {
      id: 'section_7_conclusion_solo',
      text: 'Alex takes the single tether and leaves Ray at the hatch with a look that means I told you so in advance.\n\nThe ship offers one polite chance to stop before Alex has to earn the rest of the night.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: ({ context }: any) => context.route_choice === 'cargo' ? 'section_7_exit_cargo' : 'section_7_exit_medical' },
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
      text:
        'As Alex reaches the first stable foothold outside, the PDA projects a medical risk waiver across the visor. Someone in Compliance has concluded that proceeding deeper carries liability.\n\n' +
        'RAY: Medical cleared you to stop now and pass the rest along. That notation actually makes sense for once.\n' +
        'ALEX: Stopping never felt like surrender before.\n' +
        'RAY: This is the time to learn.',
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
      text: 'Alex accepts the medical waiver and cycles back through the lock, passing the hull segment off to the next shift.\n\nThe ship stays breathing, though medical will have questions about the approach that led here.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'ending_1' },
  },
}
