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
      text: 'Inside the distributor core, earlier shortcuts are still echoing through the control layer. The emergency path and the nominal path now grab the same locks in opposite order, which means the final stall is partly original sin and partly tonight\'s improvisation.\n\n' +
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
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),

  ...javaEmergencyLockReversalTaskState({
    stateId: 'section_10_debt_task_2',
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),

  ...javaAuditLockInversionTaskState({
    stateId: 'section_10_debt_task_3',
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),

  ...javaCallbackLockReentryTaskState({
    stateId: 'section_10_debt_task_4',
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),

  ...javaBatchCommitLockOrderTaskState({
    stateId: 'section_10_debt_task_5',
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),

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
      text:
        'By the time Alex returns to Incubator #4, the folding chair is still there and the Nevsky potato is still growing like none of this should be surprising. Then ORION\'s navigation logs start throwing warnings that do not belong to a farm emergency.',
      task: {
        type: 'single_choice', variant: 'problem',
        options: [
          { id: 'stop', content: 'Sign Off Now' },
          { id: 'continue', content: 'Keep Digging' },
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
