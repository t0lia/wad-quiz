import type { ChallengeSceneData } from '../types/story'
import { javaLockOrderDeadlockTaskState } from './tasks/11-java_lock_order_deadlock'

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
      NEXT: 'section_10_clean_task',
    },
  },

  ...javaLockOrderDeadlockTaskState({
    stateId: 'section_10_clean_task',
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
