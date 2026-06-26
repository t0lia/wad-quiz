import type { ChallengeSceneData } from '../types/story'

export const section6MedicalStates = {
  // ── Section 6 Medical: Intro ─────────────────────────────
  section_6_medical_intro: {
    meta: {
      id: 'section_6_medical_intro',
      text:
        'The medical shell closes around Shmiel with a soft click and a great deal of bureaucratic self-esteem. The payload reaches the drone, but outside-hull mode never enables sterile shell behavior, which means the first dust cloud could end the argument badly.\n\n' +
        'VEX: The payload arrives, but the shell logic never sees the flag it needs.\n' +
        'ALEX: So the message survives transport and dies on schema mismatch.\n' +
        'CLARA: I could have told you that sentence before you opened the file.\n' +
        'ALEX: Yes, but then I would lose the joy of proving it.',
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
      text:
        'Problem 3 Medical: Shell Profile Field Name\n\n' +
        'The sterile shell payload writes the activation flag to the wrong field name, so the drone never enables contamination-safe mode outside. Schema mismatch means the protection is declared but never armed.\n\n' +
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
        type: 'multiple_choice',
        options: [
          { id: 'replace_battery', content: 'Replace the drone battery pack' },
          { id: 'static_distance', content: 'Hardcode a fixed standoff distance and ignore shell state' },
          { id: 'boolean_follow', content: 'Write sterileMode to the field the profile actually reads' },
          { id: 'manual_follow_override', content: 'Override the profile and force manual shell behavior' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'boolean_follow',
          target: 'section_6_medical_conclusion_solved',
          actions: [{ type: 'set', params: { problem_6_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'manual_follow_override',
          target: 'section_6_medical_conclusion_override',
          actions: [{ type: 'set', params: { problem_6_result: 'override' } }],
        },
        {
          target: 'section_6_medical_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_6_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_6_medical_conclusion_incorrect: {
    meta: {
      id: 'section_6_medical_conclusion_incorrect',
      text: 'The battery swap adds nothing but time, and the schema error remains patient. Alex corrects the field while Clara tracks contamination possibilities.\n\nThe drone is ready enough, and Ray is waiting outside with the full set of new surprises.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_medical_conclusion_solved: {
    meta: {
      id: 'section_6_medical_conclusion_solved',
      text: 'The payload lands cleanly, the sterile mode field works, and Shmiel suddenly looks much more trustworthy.\n\nThe outer hatch is ready, and Ray is already waiting with a familiar question about teamwork.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_medical_conclusion_override: {
    meta: {
      id: 'section_6_medical_conclusion_override',
      text: 'Alex forces the drone into a manual shell path that works now and looks deeply unsafe.\n\nThe hatch is ready, but the outside segment begins with one more borrowed trust from the medical side.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },
}
