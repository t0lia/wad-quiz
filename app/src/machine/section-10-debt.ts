import type { ChallengeSceneData } from '../types/story'

export const section10DebtStates = {
  // ── Section 10 Debt: Intro ───────────────────────────────
  section_10_debt_intro: {
    meta: {
      id: 'section_10_debt_intro',
      text: 'Inside the distributor core, earlier shortcuts are still echoing through the control layer. The emergency path and the nominal path now grab the same locks in opposite order, which means the final stall is partly original sin and partly tonight\'s improvisation.',
      dialogue: [
        { speaker: 'captain', text: 'Engineer, tell me this is still one bug.' },
        { speaker: 'alex', text: 'It is one bug with excellent networking skills.' },
        { speaker: 'elena', text: 'Can you stabilize it without creating a sequel?' },
        { speaker: 'alex', text: 'That depends on whether everyone can survive me refusing the fastest wrong answer.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_10_debt_task',
    },
  },

  // ── Section 10 Debt: Task ────────────────────────────────
  section_10_debt_task: {
    meta: {
      id: 'section_10_debt_task',
      text:
        'Task 5B: Emergency Path Lock Reversal\n\n' +
        'Earlier shortcuts are still echoing through the control layer. The emergency path and the nominal path now grab the same locks in opposite order, creating a deadlock whenever nominal and emergency restoration overlap. Too many explicit shortcuts have turned the final console into a map of past compromises.\n\n' +
        '```java\n' +
        'void distributeEmergency(Lock main, Lock backup) {\n' +
        '    synchronized (backup) {\n' +
        '        synchronized (main) { reroute(main, backup); }\n' +
        '    }\n' +
        '}\n' +
        'void restoreNominal(Lock main, Lock backup) {\n' +
        '    synchronized (main) {\n' +
        '        synchronized (backup) { reroute(backup, main); }\n' +
        '    }\n' +
        '}\n' +
        '```',
      task: {
        type: 'single_choice',
        variant: 'problem',
        options: [
          { id: 'blame_deploy', content: 'Redeploy the emergency wrapper and hope the deadlock disappears' },
          { id: 'remove_safety_lock', content: 'Remove one lock from the emergency path and trust luck' },
          { id: 'normalize_concurrency_rule', content: 'Make nominal and emergency paths acquire locks in the same order' },
          { id: 'pin_emergency_execution', content: 'Pin the core in emergency mode and defer the real repair' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'normalize_concurrency_rule',
          target: 'section_10_debt_conclusion_solved',
          actions: [{ type: 'set', params: { problem_10_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'pin_emergency_execution',
          target: 'section_10_debt_conclusion_override',
          actions: [{ type: 'set', params: { problem_10_result: 'override' } }],
        },
        {
          target: 'section_10_debt_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_10_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_10_debt_conclusion_incorrect: {
    meta: {
      id: 'section_10_debt_conclusion_incorrect',
      text: 'Wrapper redeploys and lock removal only make the core louder. Alex still has to unify the acquisition order before the sector will stay up.\n\nPower returns, but the logs now read like a confession written in stack traces.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  section_10_debt_conclusion_solved: {
    meta: {
      id: 'section_10_debt_conclusion_solved',
      text: 'The debt-tangled core settles once Alex forces both paths to obey the same lock order again.\n\nFull power returns, and the resulting logs point toward an anomaly that was never supposed to be visible.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  section_10_debt_conclusion_override: {
    meta: {
      id: 'section_10_debt_conclusion_override',
      text: 'Alex pins the core in emergency mode and gets power back through one last intentional compromise.\n\nThe sector is alive, but the recovery logs now contain a larger problem than the one Alex came here to solve.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  // ── Section 10 Exit: Sign Off Or Pull The Thread ────────
  section_10_exit: {
    meta: {
      id: 'section_10_exit',
      image: '/locations/incubator_4.png',
      text:
        'By the time Alex returns to Incubator #4, the folding chair is still there and the Nevsky potato is still growing like none of this should be surprising. Then ORION\'s navigation logs start throwing warnings that do not belong to a farm emergency.',
      task: {
        type: 'single_choice',
        variant: 'branch',
        options: [
          { id: 'stop', content: 'Sign off - repair complete' },
          { id: 'continue', content: 'Investigate ORION warnings' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'stop',
          target: 'ending_4',
          actions: [{ type: 'set', params: { accepted_exit_10: true } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'continue',
          target: 'ending_5',
        },
      ],
    },
  },
}
