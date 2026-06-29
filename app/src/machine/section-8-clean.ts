import type { ChallengeSceneData } from '../types/story'

export const section8CleanStates = {
  // ── Section 8 Clean: Intro ───────────────────────────────
  section_8_clean_intro: {
    meta: {
      id: 'section_8_clean_intro',
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
      text:
        'Task 4A: Farm Segment Prefix\n\n' +
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
        type: 'multiple_choice',
        options: [
          { id: 'reset_switch', content: 'Reset the switch and hope it comes back smarter' },
          { id: 'static_shortcut', content: 'Add a one-off static shortcut and leave the mask wrong' },
          { id: 'correct_prefix', content: 'Change the prefix to match the farm network segment' },
          { id: 'force_tunnel', content: 'Override the route and build a brittle direct tunnel' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'correct_prefix',
          target: 'section_8_clean_conclusion_solved',
          actions: [{ type: 'set', params: { problem_8_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_tunnel',
          target: 'section_8_clean_conclusion_override',
          actions: [{ type: 'set', params: { problem_8_result: 'override' } }],
        },
        {
          target: 'section_8_clean_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_8_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_8_clean_conclusion_incorrect: {
    meta: {
      id: 'section_8_clean_conclusion_incorrect',
      text: 'The workaround holds right up to the next stress test, then something else breaks under the weight. Alex fixes the mask under the accumulated frustration.\n\nThe interface stabilizes but carries the smell of all the shortcuts that came before it.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  section_8_clean_conclusion_solved: {
    meta: {
      id: 'section_8_clean_conclusion_solved',
      text: 'The prefix correction lands cleanly, traffic routes stay inside their boundaries, and the farm switch finally behaves.\n\nThe hull path is stable now, held by one honest configuration in a night full of shortcuts.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  section_8_clean_conclusion_override: {
    meta: {
      id: 'section_8_clean_conclusion_override',
      text: 'Alex forces a tunnel bridge that bypasses the real fix, and it works immediately but looks fundamentally dishonest.\n\nThe hull route is open now, but one more promise is being kept by borrowed certainty.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  // ── Section 8 Exit: Partial recovery or containment ──────
  section_8_exit_clean: {
    meta: {
      id: 'section_8_exit_clean',
      text:
        'The PDA receives a second notice. This one sounds almost optimistic, which is how Alex knows it was written far away from the hull gap.',
      task: {
        type: 'multiple_choice',
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
          actions: [{ type: 'set', params: { accepted_exit_8: true } }],
        },
        { guard: ({ event }: any) => event.answer === 'continue', target: 'section_9' },
      ],
    },
  },
}
