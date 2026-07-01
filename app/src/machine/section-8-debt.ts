import type { ChallengeSceneData } from '../types/story'

export const section8DebtStates = {
  // ── Section 8 Debt: Intro ────────────────────────────────
  section_8_debt_intro: {
    meta: {
      id: 'section_8_debt_intro',
      image: '/locations/technical_gap.png',
      title: 'Section 8D: Hull Gap - Debt Recovery Route',
      text: 'The technical gap is no longer polite. Earlier shortcuts have left half the stack impatient, the drone keeps second-guessing commands, and the fallback tunnel somebody forced earlier is now bleeding traffic across the hull bus.',
      dialogue: [
        { speaker: 'ray', text: 'We are not fixing one clean route anymore. We are fixing the bad rescue path on top of it.' },
        { speaker: 'alex', text: 'Good. I was worried the night might become straightforward.' },
        { speaker: 'ray', text: 'That concern has passed.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_8_debt_task',
    },
  },

  // ── Section 8 Debt: Task ─────────────────────────────────
  section_8_debt_task: {
    meta: {
      id: 'section_8_debt_task',
      image: '/locations/technical_gap.png',
      title: 'Section 8D: Hull Gap - Debt Recovery Route',
      text:
        'Task 4B: Debt Tunnel Prefix Leak\n\n' +
        'The emergency tunnel path uses an address boundary that is far too broad. Too many earlier shortcuts have made the whole stack impatient and brittle, and the fallback tunnel is now bleeding traffic across the hull bus. The rescue route keeps stealing traffic from unrelated hull systems.\n\n' +
        '```python\n' +
        'def recover_tunnel(iface):\n' +
        '    run(f"ip addr replace 10.20.5.14/16 dev {iface}")\n' +
        '    run(f"ip route replace 10.0.0.0/8 dev {iface}")\n' +
        '    run("connect_switch 10.20.0.1 --force")\n' +
        '    return verify_link(iface)\n' +
        '```',
      task: {
        type: 'single_choice',
        variant: 'problem',
        options: [
          { id: 'blame_switch', content: 'Bounce the tunnel, the switch, and the visor and hope one of them learns something' },
          { id: 'add_shortcut_route', content: 'Add another emergency route on top of the bad one' },
          { id: 'correct_network_boundary', content: 'Narrow the tunnel boundary so only the farm path uses it' },
          { id: 'force_recovery_tunnel', content: 'Keep the forced tunnel and pin it with an ugly manual rule' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'correct_network_boundary',
          target: 'section_8_debt_conclusion_solved',
          actions: [{ type: 'set', params: { problem_8_result: 'solved' } }, { type: 'score', params: { technical: 2, dedication: 1, social: 0 } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_recovery_tunnel',
          target: 'section_8_debt_conclusion_override',
          actions: [{ type: 'set', params: { problem_8_result: 'override' } }, { type: 'score', params: { technical: 1, dedication: -1, social: -1 } }],
        },
        {
          target: 'section_8_debt_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_8_result: 'incorrect' } }, { type: 'score', params: { technical: -1, dedication: 0, social: 0 } }],
        },
      ],
    },
  },

  section_8_debt_conclusion_incorrect: {
    meta: {
      id: 'section_8_debt_conclusion_incorrect',
      image: '/locations/technical_gap.png',
      title: 'Section 8D: Hull Gap - Debt Recovery Route',
      text: 'The tunnel thrash proves motion is not the same as progress, and Alex has to narrow the route properly while the whole hull bus complains.\n\nConnectivity is back, but the system now feels like it survived by accumulation rather than design.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_debt' },
  },

  section_8_debt_conclusion_solved: {
    meta: {
      id: 'section_8_debt_conclusion_solved',
      image: '/locations/technical_gap.png',
      title: 'Section 8D: Hull Gap - Debt Recovery Route',
      text: 'The broad tunnel stops stealing traffic the moment Alex restores a sane boundary around it.\n\nThe farm path holds, the debt stack quiets down a little, and the burned connector becomes the last obvious threat.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_debt' },
  },

  section_8_debt_conclusion_override: {
    meta: {
      id: 'section_8_debt_conclusion_override',
      image: '/locations/technical_gap.png',
      title: 'Section 8D: Hull Gap - Debt Recovery Route',
      text: 'Alex pins the forced tunnel in place with one more manual rule and gets the sector stable in the least comforting possible way.\n\nThe ship is moving again, but not because the software has learned anything.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_debt' },
  },

  section_8_exit_debt: {
    meta: {
      id: 'section_8_exit_debt',
      image: '/locations/technical_gap.png',
      title: 'Section 8 Exit: Containment Offer',
      text:
        'The next notice arrives with the nervous politeness of people who know the system is technically up and emotionally one sharp tap from another incident. Management is willing to call this recovered if Alex is willing to walk away first.',
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
