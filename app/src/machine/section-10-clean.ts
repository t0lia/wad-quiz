import type { ChallengeSceneData } from '../types/story'

export const section10CleanStates = {
  // ── Section 10 Clean: Intro ──────────────────────────────
  section_10_clean_intro: {
    meta: {
      id: 'section_10_clean_intro',
      text: 'Inside the distributor core, the remaining fault is at least honest. Two power routines grab the same locks in opposite order. Under load they freeze each other and stall the whole sector.',
      dialogue: [
        { speaker: 'captain', text: 'Alex, the sector is close to coming back. What is still holding it down?' },
        { speaker: 'alex', text: 'Two threads with bad manners and opposite lock order.' },
        { speaker: 'elena', text: 'How long until they behave?' },
        { speaker: 'alex', text: 'That depends on how loudly the rest of the ship panics while I work.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_10_clean_task',
    },
  },

  // ── Section 10 Clean: Task ───────────────────────────────
  section_10_clean_task: {
    meta: {
      id: 'section_10_clean_task',
      text:
        'Task 5A: Distributor Lock Ordering\n\n' +
        'Two power routines grab the same locks in opposite order. Under load they freeze each other and stall the whole sector. The remaining fault is at least honest.\n\n' +
        '```java\n' +
        'void distributePower(Lock main, Lock backup) {\n' +
        '    synchronized (main) {\n' +
        '        synchronized (backup) { reroute(main, backup); }\n' +
        '    }\n' +
        '}\n' +
        'void restorePower(Lock main, Lock backup) {\n' +
        '    synchronized (backup) {\n' +
        '        synchronized (main) { reroute(backup, main); }\n' +
        '    }\n' +
        '}\n' +
        '```',
      task: {
        type: 'multiple_choice',
        options: [
          { id: 'reinstall_firmware', content: 'Reinstall distributor firmware and hope the deadlock disappears' },
          { id: 'skip_one_lock', content: 'Remove one lock and trust low traffic to save the night' },
          { id: 'normalize_lock_order', content: 'Make both routines acquire locks in the same order' },
          { id: 'emergency_single_thread', content: 'Override the core into single-thread emergency mode' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'normalize_lock_order',
          target: 'section_10_clean_conclusion_solved',
          actions: [{ type: 'set', params: { problem_10_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'emergency_single_thread',
          target: 'section_10_clean_conclusion_override',
          actions: [{ type: 'set', params: { problem_10_result: 'override' } }],
        },
        {
          target: 'section_10_clean_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_10_result: 'incorrect' } }],
        },
      ],
    },
  },

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
