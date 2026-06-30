import type { ChallengeSceneData } from '../types/story'

export const section6CargoStates = {
  // ── Section 6 Cargo: Intro ───────────────────────────────
  section_6_cargo_intro: {
    meta: {
      id: 'section_6_cargo_intro',
      image: '/locations/airlock_4.png',
      title: 'Section 6 Cargo: Clamp Follow Profile',
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
      image: '/locations/airlock_4.png',
      title: 'Section 6 Cargo: Clamp Follow Profile',
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
        type: 'single_choice',
        variant: 'problem',
        options: [
          { id: 'blame_hardware', content: 'Replace the drone battery pack' },
          { id: 'fake_safe_mode', content: 'Hardcode a fixed standoff distance and ignore clamp state' },
          { id: 'align_profile_value', content: 'Send magClamp as a real boolean value' },
          { id: 'force_profile_override', content: 'Override the profile and force manual clamp behavior' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'align_profile_value',
          target: 'section_6_cargo_conclusion_solved',
          actions: [{ type: 'set', params: { problem_6_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_profile_override',
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
      image: '/locations/airlock_4.png',
      title: 'Section 6 Cargo: Clamp Follow Profile',
      text: 'Battery guesses and rough fallback behavior waste time. Alex still has to correct the profile value the drone actually reads before the outside setup behaves.\n\nHull movement is possible now, and the only remaining question is whether Alex takes Ray along.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_cargo_conclusion_solved: {
    meta: {
      id: 'section_6_cargo_conclusion_solved',
      image: '/locations/airlock_4.png',
      title: 'Section 6 Cargo: Clamp Follow Profile',
      text: 'The corrected profile goes in cleanly, the clamp behaves, and Shmiel suddenly looks much more useful.\n\nThe outer hatch is ready, and Ray is already waiting with a new definition of teamwork.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_cargo_conclusion_override: {
    meta: {
      id: 'section_6_cargo_conclusion_override',
      image: '/locations/airlock_4.png',
      title: 'Section 6 Cargo: Clamp Follow Profile',
      text: 'Alex forces the drone into a manual support mode that works right away and looks very temporary. The hatch is ready, but Alex steps outside relying on another temporary fix. However he\'s feeling lucky.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },
}
