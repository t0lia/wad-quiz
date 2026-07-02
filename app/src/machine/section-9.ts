import type { ChallengeSceneData } from '../types/story'

export const section9States = {
  // ── Section 9: Connector Swap Method ────────────────────
  section_9: {
    meta: {
      id: 'section_9',
      title: 'Connector Swap Method',
      text:
        'The burned cable is fused into the connector and the replacement line is ready in its case. Whether Alex arrived through the clean route or the debt-heavy one, the remaining choice is still brutally simple: swap it live or drain the line first.',
      task: {
        type: 'single_choice',
        variant: 'branch',
        options: [
          { id: 'hot', content: 'Hot Swap' },
          { id: 'drain', content: 'Drain Then Replace' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'hot', target: 'section_9_exit', actions: [{ type: 'set', params: { swap_mode: 'hot' } }, { type: 'score', params: { technical: -0.2, dedication: 0.1, social: -0.4 } }] },
        { guard: ({ event }: any) => event.answer === 'drain', target: 'section_9_exit', actions: [{ type: 'set', params: { swap_mode: 'drain' } }, { type: 'score', params: { technical: 0.4, dedication: 0.3, social: 0.3 } }] },
      ],
    },
  },

  // ── Section 9 Exit: Connector go or no-go ───────────────
  section_9_exit: {
    meta: {
      id: 'section_9_exit',
      title: 'Connector Go Or No-Go',
      text:
        'The old cable is loose enough to move, the replacement is ready, and the distributor core waits one layer deeper. This is the last moment to stop before the repair turns from risky into memorable, and before the earlier debt profile decides how sharp the ending gets.',
      task: {
        type: 'single_choice',
        variant: 'branch',
        options: [
          { id: 'stop', content: 'Stop Before The Core' },
          { id: 'continue', content: 'Continue Into The Core' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'stop',
          target: 'ending_3',
          actions: [{ type: 'set', params: { accepted_exit_9: true } }, { type: 'score', params: { technical: 0, dedication: -0.3, social: 0.4 } }],
        },
        {
          guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count < 2,
          target: 'section_10_clean_intro',
          actions: [{ type: 'score', params: { technical: 0.1, dedication: 0.4, social: -0.1 } }],
        },
        {
          guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count >= 2,
          target: 'section_10_debt_intro',
          actions: [{ type: 'score', params: { technical: 0.1, dedication: 0.4, social: -0.1 } }],
        },
      ],
    },
  },
}
