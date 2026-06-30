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
          { id: 'redeploy_wrapper', content: 'Redeploy the emergency wrapper and hope the deadlock disappears' },
          { id: 'remove_backup_lock', content: 'Remove one lock from the emergency path and trust luck' },
          { id: 'unify_lock_order', content: 'Make nominal and emergency paths acquire locks in the same order' },
          { id: 'pin_emergency_mode', content: 'Pin the core in emergency mode and defer the real repair' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'unify_lock_order',
          target: 'section_10_debt_conclusion_solved',
          actions: [{ type: 'set', params: { problem_10_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'pin_emergency_mode',
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
      text: 'The wrapper redeploy wastes time and leaves the deadlock untouched. Alex fixes the lock order under the accumulated memory of all the shortcuts that built up to this moment.\n\nThe distributor stabilizes, but it now runs with the weight of every compromise that brought it here.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  section_10_debt_conclusion_solved: {
    meta: {
      id: 'section_10_debt_conclusion_solved',
      text: 'Both paths now acquire locks in the same order, the deadlock dissolves, and the distributor finally breathes despite all the shortcuts that tried to break it.\n\nThe final fault is fixed, held by one honest synchronization in a night of compromises.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  section_10_debt_conclusion_override: {
    meta: {
      id: 'section_10_debt_conclusion_override',
      text: 'Alex pins the core in emergency mode and the deadlock stops appearing but so does most of the system\'s capacity.\n\nPower flows again, but the distributor now runs in emergency mode, carrying one final compromise.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  // ── Section 10 Exit: Sign Off Or Pull The Thread ────────
  section_10_exit: {
    meta: {
      id: 'section_10_exit',
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
