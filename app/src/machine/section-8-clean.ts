import type { ChallengeSceneData } from '../types/story'

export const section8CleanStates = {
  // ── Section 8 Clean: Intro ───────────────────────────────
  section_8_clean_intro: {
    meta: {
      id: 'section_8_clean_intro',
      image: '/locations/technical_gap.png',
      title: 'Hull Gap - Clean Routing Fix',
      text: 'The technical gap is narrow, dark, and almost manageable. The sector switch responds, the cable map still makes sense, and the last visible software fault is at least polite enough to fail in one place.',
      dialogue: [
        { speaker: 'alex', text: 'The switch responds, but traffic keeps wandering off into the wrong network.' },
        { speaker: 'ray', text: 'Then bring the network boundary back where it belongs.' },
        { speaker: 'alex', text: 'I would love one problem tonight that stays politely inside its own lines.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_8_clean_task',
    },
  },

  // ── Section 8 Clean: Task ────────────────────────────────
  section_8_clean_task: {
    meta: {
      id: 'section_8_clean_task',
      image: '/locations/technical_gap.png',
      title: 'Hull Gap - Clean Routing Fix',
      text:
        'The interface is configured with a network prefix that is too broad. Traffic for the farm switch leaks into unrelated segments instead of staying inside the correct boundary. The sector switch responds, but traffic keeps wandering off into the wrong network.\n\n' +
        '```python\n' +
        'def configure_interface(iface):\n' +
        '    address = "10.20.5.14/8"\n' +
        '    run(f"ip addr replace {address} dev {iface}")\n' +
        '    run(f"ip route replace 10.20.0.0/16 dev {iface}")\n' +
        '    run("connect_switch 10.20.0.1")\n' +
        '    return verify_link(iface)\n' +
        '```',
      task: {
        type: 'single_choice',
        variant: 'problem',
        options: [
          { id: 'blame_switch', content: 'Reset the switch and hope it comes back smarter' },
          { id: 'add_shortcut_route', content: 'Add a one-off static shortcut and leave the mask wrong' },
          { id: 'correct_network_boundary', content: 'Change the prefix to match the farm network segment' },
          { id: 'force_recovery_tunnel', content: 'Override the route and build a brittle direct tunnel' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'correct_network_boundary',
          target: 'section_8_clean_conclusion_solved',
          actions: [{ type: 'set', params: { problem_8_result: 'solved' } }, { type: 'score', params: { technical: 2, dedication: 1, social: 0 } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_recovery_tunnel',
          target: 'section_8_clean_conclusion_override',
          actions: [{ type: 'set', params: { problem_8_result: 'override' } }, { type: 'score', params: { technical: 1, dedication: -1, social: -1 } }],
        },
        {
          target: 'section_8_clean_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_8_result: 'incorrect' } }, { type: 'score', params: { technical: -1, dedication: 0, social: 0 } }],
        },
      ],
    },
  },

  section_8_clean_conclusion_incorrect: {
    meta: {
      id: 'section_8_clean_conclusion_incorrect',
      image: '/locations/technical_gap.png',
      title: 'Hull Gap - Clean Routing Fix',
      text: 'The switch reboot adds noise, the static shortcut adds future pain, and Alex still ends up correcting the boundary before the segment behaves.\n\nConnectivity is back, but the hull repair ahead no longer feels like the only fragile thing on the ship.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  section_8_clean_conclusion_solved: {
    meta: {
      id: 'section_8_clean_conclusion_solved',
      image: '/locations/technical_gap.png',
      title: 'Hull Gap - Clean Routing Fix',
      text: 'The route settles the moment the farm segment gets the boundary it should have had from the start.\n\nBackbone service is mostly restored, and the burned connector is now the last obvious wound.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  section_8_clean_conclusion_override: {
    meta: {
      id: 'section_8_clean_conclusion_override',
      image: '/locations/technical_gap.png',
      title: 'Hull Gap - Clean Routing Fix',
      text: 'Alex forces a direct tunnel through the gap and gets traffic moving again under a layer of technical debt thin enough to hear creak.\n\nThe ship can breathe, but it has started depending on one more bad secret.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  // ── Section 8 Exit: Partial recovery or containment ──────
  section_8_exit_clean: {
    meta: {
      id: 'section_8_exit_clean',
      image: '/locations/technical_gap.png',
      title: 'Partial Recovery Offer',
      text:
        'The PDA receives a second notice. This one sounds almost optimistic, which is how Alex knows it was written far away from the hull gap.',
      task: {
        type: 'single_choice',
        variant: 'branch',
        options: [
          { id: 'stop', content: 'Stop and sign off' },
          { id: 'continue', content: 'Continue to distributor' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'stop',
          target: 'ending_2',
          actions: [{ type: 'set', params: { accepted_exit_8: true } }, { type: 'score', params: { technical: 0, dedication: -1, social: 0 } }],
        },
        { guard: ({ event }: any) => event.answer === 'continue', target: 'section_9', actions: [{ type: 'score', params: { technical: 0, dedication: 1, social: 0 } }] },
      ],
    },
  },
}
