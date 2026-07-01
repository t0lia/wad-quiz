import type { ChallengeSceneData } from '../types/story'

export const section10CleanStates = {
  // ── Section 10 Clean: Intro ──────────────────────────────
  section_10_clean_intro: {
    meta: {
      id: 'section_10_clean_intro',
      title: 'Distributor Core - Lock Order',
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
      title: 'Distributor Core - Lock Order',
      text:
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
        type: 'single_choice',
        variant: 'problem',
        options: [
          { id: 'blame_deploy', content: 'Reinstall distributor firmware and hope the deadlock disappears' },
          { id: 'remove_safety_lock', content: 'Remove one lock and trust low traffic to save the night' },
          { id: 'normalize_concurrency_rule', content: 'Make both routines acquire locks in the same order' },
          { id: 'pin_emergency_execution', content: 'Override the core into single-thread emergency mode' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'normalize_concurrency_rule',
          target: 'section_10_clean_conclusion_solved',
          actions: [{ type: 'set', params: { problem_10_result: 'solved' } }, { type: 'score', params: { technical: 2, dedication: 1, social: 0 } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'pin_emergency_execution',
          target: 'section_10_clean_conclusion_override',
          actions: [{ type: 'set', params: { problem_10_result: 'override' } }, { type: 'score', params: { technical: 1, dedication: -1, social: -1 } }],
        },
        {
          target: 'section_10_clean_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_10_result: 'incorrect' } }, { type: 'score', params: { technical: -1, dedication: 0, social: 0 } }],
        },
      ],
    },
  },

  section_10_clean_conclusion_incorrect: {
    meta: {
      id: 'section_10_clean_conclusion_incorrect',
      title: 'Distributor Core - Lock Order',
      text: 'Firmware guesses and unsafe lock removal waste time, then Alex restores a consistent acquisition order before the core can behave.\n\nFull power returns, and one last choice remains about the new anomaly rising beside the repair.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  section_10_clean_conclusion_solved: {
    meta: {
      id: 'section_10_clean_conclusion_solved',
      title: 'Distributor Core - Lock Order',
      text: 'The core comes back cleanly once both paths stop fighting over the same resources in opposite order.\n\nSector power is restored, and a fresh log anomaly points back toward Incubator #4.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },

  section_10_clean_conclusion_override: {
    meta: {
      id: 'section_10_clean_conclusion_override',
      title: 'Distributor Core - Lock Order',
      text: 'Alex forces the core into emergency single-thread mode and gets power back at once, steady only in the way a tired compromise can look steady.\n\nPower is restored, but the recovery logs now contain something larger than a plant incident.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_10_exit' },
  },
}
