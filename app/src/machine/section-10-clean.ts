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
      text:
        'Inside the distributor core, the remaining fault is at least honest. Two power routines grab the same locks in opposite order. Under load they freeze each other and stall the whole sector.\n\n' +
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
    solvedTarget: 'section_10_clean_conclusion_solved',
    overrideTarget: 'section_10_clean_conclusion_override',
    incorrectTarget: 'section_10_clean_conclusion_incorrect',
  }),

  ...javaEmergencyLockReversalTaskState({
    stateId: 'section_10_clean_task_2',
    solvedTarget: 'section_10_clean_conclusion_solved',
    overrideTarget: 'section_10_clean_conclusion_override',
    incorrectTarget: 'section_10_clean_conclusion_incorrect',
  }),

  ...javaAuditLockInversionTaskState({
    stateId: 'section_10_clean_task_3',
    solvedTarget: 'section_10_clean_conclusion_solved',
    overrideTarget: 'section_10_clean_conclusion_override',
    incorrectTarget: 'section_10_clean_conclusion_incorrect',
  }),

  ...javaCallbackLockReentryTaskState({
    stateId: 'section_10_clean_task_4',
    solvedTarget: 'section_10_clean_conclusion_solved',
    overrideTarget: 'section_10_clean_conclusion_override',
    incorrectTarget: 'section_10_clean_conclusion_incorrect',
  }),

  ...javaBatchCommitLockOrderTaskState({
    stateId: 'section_10_clean_task_5',
    solvedTarget: 'section_10_clean_conclusion_solved',
    overrideTarget: 'section_10_clean_conclusion_override',
    incorrectTarget: 'section_10_clean_conclusion_incorrect',
  }),

  section_10_clean_conclusion_incorrect: {
    meta: {
      id: 'section_10_clean_conclusion_incorrect',
      text: 'The firmware reinstall wastes time and proves that the deadlock was always there. Alex fixes the lock order under the accumulated exhaustion.\n\nThe distributor stabilizes, but it carries the memory of all the shortcuts that led to this final argument.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  section_10_clean_conclusion_solved: {
    meta: {
      id: 'section_10_clean_conclusion_solved',
      text: 'Both routines now ask for locks in the same order, the deadlock dissolves, and the distributor finally breathes.\n\nThe last fault is fixed, held by one honest synchronization in a night full of compromises.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  section_10_clean_conclusion_override: {
    meta: {
      id: 'section_10_clean_conclusion_override',
      text: 'Alex forces the core into single-thread mode and the deadlock disappears but so does most of the parallelism.\n\nPower flows again, but the distributor now runs at a fraction of its capacity.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },
}
