import type { ChallengeSceneData } from '../types/story'
import { javaLockOrderDeadlockTaskState } from './tasks/11-java_lock_order_deadlock'
import { javaEmergencyLockReversalTaskState } from './tasks/12-java_emergency_lock_reversal'
import { javaAuditLockInversionTaskState } from './tasks/23-java_audit_lock_inversion'
import { javaCallbackLockReentryTaskState } from './tasks/24-java_callback_lock_reentry'
import { javaBatchCommitLockOrderTaskState } from './tasks/25-java_batch_commit_lock_order'

export const section10DebtStates = {
  // ── Section 10 Debt: Intro ───────────────────────────────
  section_10_debt_intro: {
    meta: {
      id: 'section_10_debt_intro',
      text:
        'Inside the distributor core, earlier shortcuts are still echoing through the control layer. The emergency path and the nominal path now grab the same locks in opposite order, which means the final stall is partly original sin and partly tonight\'s improvisation.\n\n' +
        'CAPTAIN: Engineer, tell me this is still one bug.\n' +
        'ALEX: It is one bug with excellent networking skills.\n' +
        'ELENA: Can you stabilize it without creating a sequel?\n' +
        'ALEX: That depends on whether everyone can survive me refusing the fastest wrong answer.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.rand < 0.2,
          target: 'section_10_debt_task_1',
        },
        {
          guard: ({ event }: any) => event.rand < 0.4,
          target: 'section_10_debt_task_2',
        },
        {
          guard: ({ event }: any) => event.rand < 0.6,
          target: 'section_10_debt_task_3',
        },
        {
          guard: ({ event }: any) => event.rand < 0.8,
          target: 'section_10_debt_task_4',
        },
        {
          target: 'section_10_debt_task_5',
        },
      ],
    },
  },

  ...javaLockOrderDeadlockTaskState({
    stateId: 'section_10_debt_task_1',
    solvedTarget: 'section_10_debt_conclusion_solved',
    overrideTarget: 'section_10_debt_conclusion_override',
    incorrectTarget: 'section_10_debt_conclusion_incorrect',
  }),

  ...javaEmergencyLockReversalTaskState({
    stateId: 'section_10_debt_task_2',
    solvedTarget: 'section_10_debt_conclusion_solved',
    overrideTarget: 'section_10_debt_conclusion_override',
    incorrectTarget: 'section_10_debt_conclusion_incorrect',
  }),

  ...javaAuditLockInversionTaskState({
    stateId: 'section_10_debt_task_3',
    solvedTarget: 'section_10_debt_conclusion_solved',
    overrideTarget: 'section_10_debt_conclusion_override',
    incorrectTarget: 'section_10_debt_conclusion_incorrect',
  }),

  ...javaCallbackLockReentryTaskState({
    stateId: 'section_10_debt_task_4',
    solvedTarget: 'section_10_debt_conclusion_solved',
    overrideTarget: 'section_10_debt_conclusion_override',
    incorrectTarget: 'section_10_debt_conclusion_incorrect',
  }),

  ...javaBatchCommitLockOrderTaskState({
    stateId: 'section_10_debt_task_5',
    solvedTarget: 'section_10_debt_conclusion_solved',
    overrideTarget: 'section_10_debt_conclusion_override',
    incorrectTarget: 'section_10_debt_conclusion_incorrect',
  }),

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
        type: 'single_choice', variant: 'problem',
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
          actions: [{ type: 'set', params: { accepted_exit_10: true } }, { type: 'score', params: { technical: 0, dedication: -0.2, social: 0.2 } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'continue',
          target: 'ending_5',
          actions: [{ type: 'score', params: { technical: 0.3, dedication: 0.3, social: -0.1 } }],
        },
      ],
    },
  },
}
