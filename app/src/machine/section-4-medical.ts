import type { ChallengeSceneData } from '../types/story'

export const section4MedicalStates = {
  // ── Section 4 Medical: Intro ─────────────────────────────
  section_4_medical_intro: {
    meta: {
      id: 'section_4_medical_intro',
      text: 'Clara leads Alex through the medical corridor to a quarantine side gate with cleaner walls and angrier software. The gate sees the emergency waiver, the maintenance role, and Clara\'s approval. It still declares the record incomplete and keeps the lock engaged.',
      dialogue: [
        { speaker: 'clara', text: 'The waiver exists. I signed it myself.' },
        { speaker: 'alex', text: 'Then the gate is either afraid of doctors or confused by field names.' },
        { speaker: 'clara', text: 'I can work with either diagnosis.' },
        { speaker: 'alex', text: 'Let us start with the one that compiles.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_4_medical_task',
    },
  },

  // ── Section 4 Medical: Task ──────────────────────────────
  section_4_medical_task: {
    meta: {
      id: 'section_4_medical_task',
      text:
        'Problem 2 Medical: Waiver Field Mismatch\n\n' +
        'The quarantine gate writes the approval flag to the wrong field name, so Clara\'s valid medical waiver never reaches the logic that unlocks the door. The gate sees the data but misses the meaning.\n\n' +
        '```python\n' +
        'def build_clearance(record):\n' +
        '    payload = {"level": record["level"], "waiverApproved": False}\n' +
        '    if record["doctor_ok"]:\n' +
        '        payload["waiver_approved"] = True\n' +
        '    return payload\n' +
        '```',
      task: {
        type: 'single_choice',
        variant: 'problem',
        options: [
          { id: 'rescan_wristband', content: 'Rescan Clara\'s wristband until the panel gives up' },
          { id: 'skip_quarantine_check', content: 'Bypass the quarantine check entirely' },
          { id: 'align_waiver_field', content: 'Write the approval flag to the field the gate actually reads' },
          { id: 'force_manual_release', content: 'Trigger a manual release and leave the paperwork behind' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'align_waiver_field',
          target: 'section_4_medical_conclusion_solved',
          actions: [{ type: 'set', params: { problem_4_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_manual_release',
          target: 'section_4_medical_conclusion_override',
          actions: [{ type: 'set', params: { problem_4_result: 'override' } }],
        },
        {
          target: 'section_4_medical_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_4_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_4_medical_conclusion_incorrect: {
    meta: {
      id: 'section_4_medical_conclusion_incorrect',
      text: 'The scanner accepts Clara perfectly every single time and remains wrong with perfect confidence. Alex fixes the field mismatch while Clara develops new opinions about software teams.\n\nThe quarantine lane opens, but only after the medical side learns exactly how avoidable this was.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_medical_fallout' },
  },

  section_4_medical_conclusion_solved: {
    meta: {
      id: 'section_4_medical_conclusion_solved',
      text: 'The payload lands cleanly, the waiver flag behaves, and Clara suddenly looks much more comfortable.\n\nThe gate is ready, and the medical side moves without the usual argument.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_medical' },
  },

  section_4_medical_conclusion_override: {
    meta: {
      id: 'section_4_medical_conclusion_override',
      text: 'Alex triggers a manual release and the quarantine gate opens, but the override echo follows them into the medical compartment like a second signature.\n\nClara looks at the logs and decides that judgment can wait until everyone is back.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_medical_fallout' },
  },
}
