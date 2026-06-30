import type { ChallengeSceneData } from '../types/story'

export const section2StandardStates = {
  // ── Section 2 Standard: Intro ────────────────────────────
  section_2_standard_intro: {
    meta: {
      id: 'section_2_standard_intro',
      title: 'Section 2 Standard: Sector A - Missing Dependencies',
      text: 'The enterprise console takes a little longer, but it arrives with calmer telemetry and fewer visual fireworks. The comfort lasts only until the dependency panel starts blinking. Sector A still cannot close the control handshake, and the same lock remains in place.',
      dialogue: [
        { speaker: 'lina', text: 'Slower boot, cleaner dashboard. Why is Sector A still dead?' },
        { speaker: 'alex', text: 'One startup module from the station update is racing ahead of its dependencies.' },
        { speaker: 'lina', text: 'So even the safe build inherited the same bad idea?' },
        { speaker: 'alex', text: 'Yes. We still need `sector-link` to wait for the service chain before handshaking.' },
        { speaker: 'lina', text: 'Then fix it once, and let\'s not debug this corridor again tonight.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_2_standard_task',
    },
  },

  // ── Section 2 Standard: Task ─────────────────────────────
  section_2_standard_task: {
    meta: {
      id: 'section_2_standard_task',
      title: 'Section 2 Standard: Sector A - Missing Dependencies',
      text:
        'Problem 2 Standard: Sector Link Race Condition\n\n' +
        'Even the standard build carries one rushed startup module from the latest station-wide update. The race is less flashy, but no less real.\n\n' +
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
        type: 'single_choice',
        variant: 'problem',
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
          target: 'section_2_standard_conclusion_solved',
          actions: [{ type: 'set', params: { problem_2_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_sector_link',
          target: 'section_2_standard_conclusion_override',
          actions: [{ type: 'set', params: { problem_2_result: 'override' } }],
        },
        {
          target: 'section_2_standard_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_2_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_2_standard_conclusion_incorrect: {
    meta: {
      id: 'section_2_standard_conclusion_incorrect',
      title: 'Section 2 Standard: Sector A - Missing Dependencies',
      text: 'The first guesses waste another minute. Whether Alex reboots the controller room or leans on a timing hack, `sector-link` only stays up after the startup order is forced back into line.\n\nWater starts moving again, but the main valve farther down the ship is still blocked.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_3' },
  },

  section_2_standard_conclusion_solved: {
    meta: {
      id: 'section_2_standard_conclusion_solved',
      title: 'Section 2 Standard: Sector A - Missing Dependencies',
      text: 'The startup order settles down, `sector-link` comes up cleanly, and the controller answers at last. The enterprise build stays stable, but only after Alex forces it to finish one conversation before starting the next.\n\nSector A finally responds, but the command path still points toward the next blocked compartment. Alex grabs the PDA and moves on before the station software finds a new way to surprise him.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_3' },
  },

  section_2_standard_conclusion_override: {
    meta: {
      id: 'section_2_standard_conclusion_override',
      title: 'Section 2 Standard: Sector A - Missing Dependencies',
      text: 'Alex shoves sector-link past its checks and the controller answers with visible bad temper. The dashboard turns green faster than it turns trustworthy.\n\nWater moves again, but the ship now owes Alex one hidden failure and the main valve is still ahead.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_3' },
  },
}
