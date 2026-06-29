import type { ChallengeSceneData } from '../types/story'

export const section2UnsignedStates = {
  // ── Section 2 Unsigned: Intro ────────────────────────────
  section_2_unsigned_intro: {
    meta: {
      id: 'section_2_unsigned_intro',
      text: 'Alex barely taps the confirm key before the experimental build jumps to the desktop. The quick boot looks great for about three seconds. Then the status panel fills with yellow warnings instead of green INFOs. Most of the console is awake, but currently it looks like a traffic light with big red, medium amber and a small touch of green.',
      dialogue: [
        { speaker: 'lina', text: 'That was fast. So why is Sector A still dead?' },
        { speaker: 'alex', text: 'Because this build boots the interface before the background services finish sorting themselves out.' },
        { speaker: 'lina', text: 'Which one do we actually need?' },
        { speaker: 'alex', text: '`sector-link`. Without it, this nice new desktop is as good as a screensaver.' },
        { speaker: 'lina', text: 'Then fix the race, and keep the wallpaper if you must.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_2_unsigned_task',
    },
  },

  // ── Section 2 Unsigned: Task ─────────────────────────────
  section_2_unsigned_task: {
    meta: {
      id: 'section_2_unsigned_task',
      text:
        'Problem 2 Unsigned: Sector Link Race Condition\n\n' +
        'The unsigned build skips its normal startup barrier, so the race is visible immediately. Services start in chaotic parallel, and the interface boots before the foundation is ready.\n\n' +
        '```javascript\n' +
        'async function bootSectorLink(services) {\n' +
        '  services.map((service) => service.start());\n' +
        '  const link = await sectorLink.handshake();\n' +
        '  if (!link.ok) throw new Error("sector-link offline");\n' +
        '  return "ready";\n' +
        '}\n' +
        '```\n\n' +
        'How should Alex fix this?',
      task: {
        type: 'multiple_choice',
        options: [
          { id: 'blame_controller', content: 'Blame the controller rack and restart it from the wall panel' },
          { id: 'sleep_then_retry', content: 'Add a fixed delay before the handshake' },
          { id: 'await_service_barrier', content: 'Wait for all service startups before sector-link handshakes' },
          { id: 'force_sector_link', content: 'Override startup checks and force sector-link online' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'await_service_barrier',
          target: 'section_2_unsigned_conclusion_solved',
          actions: [{ type: 'set', params: { problem_2_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_sector_link',
          target: 'section_2_unsigned_conclusion_override',
          actions: [{ type: 'set', params: { problem_2_result: 'override' } }],
        },
        {
          target: 'section_2_unsigned_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_2_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_2_unsigned_conclusion_incorrect: {
    meta: {
      id: 'section_2_unsigned_conclusion_incorrect',
      text: 'The controller room reboots, loses another minute, and comes back exactly as stubborn as before. Alex pokes the service order until the link finally answers.\n\nWater starts moving again, but the main valve farther down the ship is still blocked.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_3' },
  },

  section_2_unsigned_conclusion_solved: {
    meta: {
      id: 'section_2_unsigned_conclusion_solved',
      text: 'The startup order settles down, `sector-link` comes up cleanly, and the controller answers at last. The fast build keeps its speed, but only after Alex forces it to finish one conversation before starting the next.\n\nSector A finally responds, but the command path still points toward the next blocked compartment. Alex grabs the PDA and moves on before the experimental build finds a new way to surprise him.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_3' },
  },

  section_2_unsigned_conclusion_override: {
    meta: {
      id: 'section_2_unsigned_conclusion_override',
      text: 'Alex shoves sector-link past its checks and the controller answers with visible bad temper. The dashboard turns green faster than it turns trustworthy.\n\nWater moves again, but the ship now owes Alex one hidden failure and the main valve is still ahead.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_3' },
  },
}
