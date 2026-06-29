import type { ChallengeSceneData } from '../types/story'

export const section6CargoStates = {
  // ── Section 6 Cargo: Intro ───────────────────────────────
  section_6_cargo_intro: {
    meta: {
      id: 'section_6_cargo_intro',
      text: 'The cargo kit clicks onto Shmiel with a sharp snap. The drone accepts the new settings, but once it starts the outside setup, it acts like the magnetic clamp is optional.',
      dialogue: [
        { speaker: 'vex', text: 'The drone takes the settings, but outside it stops treating the clamp like a real on switch.' },
        { speaker: 'alex', text: 'So it reads the message, but gets the important part wrong.' },
        { speaker: 'vex', text: 'Exactly. Give me a simple, correct value and I will give you a drone that stays attached to the hull.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_6_cargo_task',
    },
  },

  // ── Section 6 Cargo: Task ────────────────────────────────
  section_6_cargo_task: {
    meta: {
      id: 'section_6_cargo_task',
      text:
        'Problem 3 Cargo: Clamp Mode Typing\n\n' +
        'The cargo setup sends the magnetic clamp setting in the wrong format. The drone accepts the data, but outside it behaves as if the clamp is turned off.\n\n' +
        '```javascript\n' +
        'function buildClampProfile(mode) {\n' +
        '  const profile = { mode, magClamp: false, tetherFollow: false };\n' +
        '  if (mode === "hull") {\n' +
        '    profile.magClamp = "true";\n' +
        '    profile.tetherFollow = true;\n' +
        '  }\n' +
        '  return deployProfile(profile);\n' +
        '}\n' +
        '```',
      task: {
        type: 'multiple_choice',
        options: [
          { id: 'replace_battery', content: 'Replace the drone battery pack' },
          { id: 'static_distance', content: 'Hardcode a fixed standoff distance and ignore clamp state' },
          { id: 'boolean_follow', content: 'Send magClamp as a real boolean value' },
          { id: 'manual_follow_override', content: 'Override the profile and force manual clamp behavior' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'boolean_follow',
          target: 'section_6_cargo_conclusion_solved',
          actions: [{ type: 'set', params: { problem_6_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'manual_follow_override',
          target: 'section_6_cargo_conclusion_override',
          actions: [{ type: 'set', params: { problem_6_result: 'override' } }],
        },
        {
          target: 'section_6_cargo_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_6_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_6_cargo_conclusion_incorrect: {
    meta: {
      id: 'section_6_cargo_conclusion_incorrect',
      text: 'The new battery changes nothing, because the real problem is still the bad setting. Alex fixes it with mild embarrassment and gets the hatch moving again.\n\nThe drone now behaves well enough to open the outer hatch, and Ray is waiting with the next questionable offer.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_cargo_conclusion_solved: {
    meta: {
      id: 'section_6_cargo_conclusion_solved',
      text: 'The new setting goes in cleanly, the clamp behaves, and Shmiel suddenly looks much more useful.\n\nThe outer hatch is ready, and Ray is already waiting with a new definition of teamwork.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_cargo_conclusion_override: {
    meta: {
      id: 'section_6_cargo_conclusion_override',
      text: 'Alex forces the drone into a manual clamp mode that works right away and looks very temporary.\n\nThe hatch is ready, but the outside segment now begins with one more borrowed certainty.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },
}
