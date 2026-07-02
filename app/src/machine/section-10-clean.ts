import type { ChallengeSceneData } from '../types/story'
import { javaLockOrderDeadlockTaskState } from './tasks/11-java_lock_order_deadlock'
import { javaEmergencyLockReversalTaskState } from './tasks/12-java_emergency_lock_reversal'
import { javaAuditLockInversionTaskState } from './tasks/23-java_audit_lock_inversion'
import { javaCallbackLockReentryTaskState } from './tasks/24-java_callback_lock_reentry'
import { javaBatchCommitLockOrderTaskState } from './tasks/25-java_batch_commit_lock_order'

export const section10CleanStates = {
  // ── Section 10 Clean: Intro ──────────────────────────────
  section_10_clean_intro: {
    meta: {
      id: 'section_10_clean_intro',
      text: 'Inside the distributor core, the remaining fault is at least honest. Two power routines grab the same locks in opposite order. Under load they freeze each other and stall the whole sector.\n\n' +
        'CAPTAIN: Alex, the sector is close to coming back. What is still holding it down?\n' +
        'ALEX: Two threads with bad manners and opposite lock order.\n' +
        'ELENA: How long until they behave?\n' +
        'ALEX: That depends on how loudly the rest of the ship panics while I work.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.rand < 0.2,
          target: 'section_10_clean_task_1',
        },
        {
          guard: ({ event }: any) => event.rand < 0.4,
          target: 'section_10_clean_task_2',
        },
        {
          guard: ({ event }: any) => event.rand < 0.6,
          target: 'section_10_clean_task_3',
        },
        {
          guard: ({ event }: any) => event.rand < 0.8,
          target: 'section_10_clean_task_4',
        },
        {
          target: 'section_10_clean_task_5',
        },
      ],
    },
  },

  ...javaLockOrderDeadlockTaskState({
    stateId: 'section_10_clean_task_1',
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),

  ...javaEmergencyLockReversalTaskState({
    stateId: 'section_10_clean_task_2',
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),

  ...javaAuditLockInversionTaskState({
    stateId: 'section_10_clean_task_3',
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),

  ...javaCallbackLockReentryTaskState({
    stateId: 'section_10_clean_task_4',
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),

  ...javaBatchCommitLockOrderTaskState({
    stateId: 'section_10_clean_task_5',
    solvedTarget: 'section_10_exit',
    overrideTarget: 'section_10_exit',
    incorrectTarget: 'section_10_exit',
  }),
}
