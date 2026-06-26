import type { ChallengeSceneData } from '../types/story'

export const section6MedicalStates = {
  // ── Section 6 Medical: Intro ─────────────────────────────
  section_6_medical_intro: {
    meta: {
      id: 'section_6_medical_intro',
      text:
        'The medical shell closes around Shmiel with a soft click. The drone gets the new settings, but once it moves into outside mode, it never turns on the clean shell setting.\n\n' +
        'VEX: The drone gets the message, but it never sees the switch that should turn the clean shell on.\n' +
        'ALEX: So the message arrives, but the important bit is written the wrong way.\n' +
        'CLARA: That is a much friendlier sentence than the one you usually say.\n' +
        'ALEX: I contain multitudes.',
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
      text: 'The hardware was never the problem, but it becomes part of the story anyway while Alex fixes the field name and avoids Clara\'s eyes for three full seconds.\n\nThe shell finally behaves, and Ray is already waiting at the outer hatch with fresh bad ideas.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_medical_conclusion_solved: {
    meta: {
      id: 'section_6_medical_conclusion_solved',
      text: 'The new field name works, clean mode turns on, and the shell suddenly looks useful instead of dangerous.\n\nThe outer hatch is ready, and Ray is already clipped in like this was always going to happen.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },

  section_6_medical_conclusion_override: {
    meta: {
      id: 'section_6_medical_conclusion_override',
      text: 'Alex forces the shell into a manual fallback that works right away and inspires no long-term confidence at all.\n\nThe hatch is ready, but the outside segment now begins with one more procedural compromise.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_7' },
  },
}
