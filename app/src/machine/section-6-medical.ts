import type { ChallengeSceneData } from '../types/story'

export const section6MedicalStates = {
  // ── Section 6 Medical: Intro ─────────────────────────────
  section_6_medical_intro: {
    meta: {
      id: 'section_6_medical_intro',
      image: '/locations/airlock_4.png',
      title: 'Sterile Shell Profile',
      text: 'The medical shell closes around Shmiel with a soft click. The drone gets the new settings, but once it moves into outside mode, it never turns on the clean shell setting.',
      dialogue: [
        { speaker: 'vex', text: 'The drone gets the message, but it never sees the switch that should turn the clean shell on.' },
        { speaker: 'alex', text: 'So the message arrives, but the important bit is written the wrong way.' },
        { speaker: 'clara', text: 'That is a much friendlier sentence than the one you usually say.' },
        { speaker: 'alex', text: 'I contain multitudes.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_6_medical_task',
    },
  },

  // ── Section 6 Medical: Task ──────────────────────────────
  section_6_medical_task: {
    meta: {
      id: 'section_6_medical_task',
      image: '/locations/airlock_4.png',
      title: 'Sterile Shell Profile',
      text:
        'The shell setup writes the on switch under the wrong name. The airlock accepts the message, but the drone never turns on clean outside mode.\n\n' +
        '```javascript\n' +
        'function buildShellProfile(mode) {\n' +
        '  const payload = { mode, sterileMode: false, beaconFollow: false };\n' +
        '  if (mode === "eva-med") {\n' +
        '    payload.sterile_mode = true;\n' +
        '    payload.beaconFollow = true;\n' +
        '  }\n' +
        '  return deployProfile(payload);\n' +
        '}\n' +
        '```',
      task: {
        type: 'single_choice',
        variant: 'problem',
        options: [
          { id: 'blame_hardware', content: 'Replace the drone battery pack' },
          { id: 'fake_safe_mode', content: 'Hardcode a fixed standoff distance and ignore shell state' },
          { id: 'align_profile_value', content: 'Write sterileMode to the field the profile actually reads' },
          { id: 'force_profile_override', content: 'Override the profile and force manual shell behavior' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'align_profile_value',
          target: 'section_6_medical_conclusion_solved',
          actions: [{ type: 'set', params: { problem_6_result: 'solved' } }, { type: 'score', params: { technical: 2, dedication: 1, social: 0 } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_profile_override',
          target: 'section_6_medical_conclusion_override',
          actions: [{ type: 'set', params: { problem_6_result: 'override' } }, { type: 'score', params: { technical: 1, dedication: -1, social: -1 } }],
        },
        {
          target: 'section_6_medical_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_6_result: 'incorrect' } }, { type: 'score', params: { technical: -1, dedication: 0, social: 0 } }],
        },
      ],
    },
  },

  section_6_medical_conclusion_incorrect: {
    meta: {
      id: 'section_6_medical_conclusion_incorrect',
      image: '/locations/airlock_4.png',
      title: 'Sterile Shell Profile',
      text: 'The wrong guesses never touch the real profile problem. Alex still has to align the shell payload with what the drone actually reads before the outside mode behaves.\n\nThe shell finally behaves, and Ray is already waiting at the outer hatch with fresh bad ideas.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_medical_conclusion_solved: {
    meta: {
      id: 'section_6_medical_conclusion_solved',
      image: '/locations/airlock_4.png',
      title: 'Sterile Shell Profile',
      text: 'The corrected payload works, clean mode turns on, and the shell suddenly looks useful instead of dangerous.\n\nThe outer hatch is ready, and Ray is already clipped in like this was always going to happen.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_medical_conclusion_override: {
    meta: {
      id: 'section_6_medical_conclusion_override',
      image: '/locations/airlock_4.png',
      title: 'Sterile Shell Profile',
      text: 'Alex forces the shell into a manual fallback that works right away and inspires no long-term confidence at all.\n\nThe hatch is ready, but the outside segment now begins with one more procedural compromise.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },
}
