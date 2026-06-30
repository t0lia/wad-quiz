import type { ChallengeSceneData } from '../types/story'

export const section9States = {
  // ── Section 9: Connector Swap Method ────────────────────
  section_9: {
    meta: {
      id: 'section_9',
      title: 'Section 9: Connector Swap Method',
      text:
        'The burned cable is fused into the connector and the replacement line is ready in its case. Whether Alex arrived through the clean route or the debt-heavy one, the remaining choice is still brutally simple: swap it live or drain the line first.',
      task: {
        type: 'single_choice',
        variant: 'branch',
        options: [
          { id: 'hot', content: 'Hot swap' },
          { id: 'drain', content: 'Drain first' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'hot', target: 'section_9_exit', actions: [{ type: 'set', params: { swap_mode: 'hot' } }] },
        { guard: ({ event }: any) => event.answer === 'drain', target: 'section_9_exit', actions: [{ type: 'set', params: { swap_mode: 'drain' } }] },
      ],
    },
  },

  // ── Section 9 Exit: Connector go or no-go ───────────────
  section_9_exit: {
    meta: {
      id: 'section_9_exit',
      title: 'Section 9 Exit: Connector Go Or No-Go',
      text:
        'The old cable is loose enough to move, the replacement is ready, and the distributor core waits one layer deeper. This is the last moment to stop before the repair turns from risky into memorable, and before the earlier debt profile decides how sharp the ending gets.',
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
          target: 'ending_3',
          actions: [{ type: 'set', params: { accepted_exit_9: true } }],
        },
        {
          guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count < 2,
          target: 'section_10_clean_intro',
        },
        {
          guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count >= 2,
          target: 'section_10_debt_intro',
        },
      ],
    },
  },
}
