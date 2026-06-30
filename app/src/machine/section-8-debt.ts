import type { ChallengeSceneData } from '../types/story'

export const section8DebtStates = {
  // ── Section 8 Debt: Intro ────────────────────────────────
  section_8_debt_intro: {
    meta: {
      id: 'section_8_debt_intro',
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
          { id: 'cycle_everything', content: 'Bounce the tunnel, the switch, and the visor and hope one of them learns something' },
          { id: 'layer_more_static', content: 'Add another emergency route on top of the bad one' },
          { id: 'narrow_the_tunnel_prefix', content: 'Narrow the tunnel boundary so only the farm path uses it' },
          { id: 'keep_force_mode', content: 'Keep the forced tunnel and pin it with an ugly manual rule' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'narrow_the_tunnel_prefix',
          target: 'section_8_debt_conclusion_solved',
          actions: [{ type: 'set', params: { problem_8_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'keep_force_mode',
          target: 'section_8_debt_conclusion_override',
          actions: [{ type: 'set', params: { problem_8_result: 'override' } }],
        },
        {
          target: 'section_8_debt_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_8_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_8_debt_conclusion_incorrect: {
    meta: {
      id: 'section_8_debt_conclusion_incorrect',
      text: 'The bounce cycle wastes time and proves that the tunnel stays bad. Alex narrows the boundary under Ray\'s increasingly colorful commentary.\n\nThe hull route stabilizes but carries the load of all the shortcuts that are holding up the rest of the stack.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_debt' },
  },

  section_8_debt_conclusion_solved: {
    meta: {
      id: 'section_8_debt_conclusion_solved',
      text: 'The boundary narrows, the tunnel stays contained, and the hull systems stop screaming at each other.\n\nThe rescue route is now holding steady, built on honest corrections under a night of shortcuts.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_debt' },
  },

  section_8_debt_conclusion_override: {
    meta: {
      id: 'section_8_debt_conclusion_override',
      text: 'Alex pins the tunnel with a manual rule that works now and looks like a warning label.\n\nThe hull route is passable now, but the override weight is getting heavier with each decision.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_debt' },
  },

  section_8_exit_debt: {
    meta: {
      id: 'section_8_exit_debt',
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
          actions: [{ type: 'set', params: { accepted_exit_8: true } }],
        },
        { guard: ({ event }: any) => event.answer === 'continue', target: 'section_9' },
      ],
    },
  },
}
