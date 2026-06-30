import type { ChallengeSceneData } from '../types/story'

export const section4CargoStates = {
  // ── Section 4 Cargo: Intro ───────────────────────────────
  section_4_cargo_intro: {
    meta: {
      id: 'section_4_cargo_intro',
      image: '/locations/access_gate-cargo.png',
      title: 'Section 4 Cargo: Freight Gate Permission Check',
      text: 'Tony meets Alex at the freight checkpoint with a handheld scanner and the expression of a man who expected a simpler night. The cargo-side maintenance gate can see the emergency tag, the route authorization, and Tony\'s temporary pass. It still refuses to open.',
      dialogue: [
        { speaker: 'tony', text: 'I filed the freight pass ten minutes ago. The gate is being dramatic.' },
        { speaker: 'alex', text: 'No, the gate is being written in Java.' },
        { speaker: 'tony', text: 'Is that better or worse than dramatic?' },
        { speaker: 'alex', text: 'Usually slower.' },
      ],
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_4_cargo_task',
    },
  },

  // ── Section 4 Cargo: Task ────────────────────────────────
  section_4_cargo_task: {
    meta: {
      id: 'section_4_cargo_task',
      image: '/locations/access_gate-cargo.png',
      title: 'Section 4 Cargo: Freight Gate Permission Check',
      text:
        'Problem 2 Cargo: Freight Pass Comparison\n\n' +
        'Tony, being a very persistent man, tries to apply his pass to card reader from all the sides: backwads, sideways, even flips it at the reader. Still - all the same - ACCESS DENIED. Alex patiently examins the code of yet another service he has never seen before.\n\n' +
        '```java\n' +
        'boolean gateAllows(Credential credential) {\n' +
        '    String level = credential.getAccessLevel();\n' +
        '    if (level == "MAINT_RED") {\n' +
        '        return true;\n' +
        '    }\n' +
        '    return credential.hasSupervisorEscort();\n' +
        '}\n' +
        '```',
      task: {
        type: 'single_choice',
        variant: 'problem',
        options: [
          { id: 'blame_reader', content: 'Reboot the freight gate and hope the cache clears' },
          { id: 'relax_gate_rule', content: 'Hardcode the gate to trust every cargo maintenance badge' },
          { id: 'align_access_check', content: 'Compare the access level by value instead of by reference' },
          { id: 'force_gate_release', content: 'Override the lock through the freight panel bridge' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'align_access_check',
          target: 'section_4_cargo_conclusion_solved',
          actions: [{ type: 'set', params: { problem_4_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_gate_release',
          target: 'section_4_cargo_conclusion_override',
          actions: [{ type: 'set', params: { problem_4_result: 'override' } }],
        },
        {
          target: 'section_4_cargo_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_4_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_4_cargo_conclusion_incorrect: {
    meta: {
      id: 'section_4_cargo_conclusion_incorrect',
      image: '/locations/access_gate-cargo.png',
      title: 'Section 4 Cargo: Freight Gate Permission Check',
      text: 'The first guesses miss the real gate check. Whether Alex blames the reader or weakens the rule, the freight door only behaves once he fixes what the scanner is actually testing.\n\nThe freight corridor opens, but everyone in it now knows Alex needed a second argument with a door.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_cargo_fallout' },
  },

  section_4_cargo_conclusion_solved: {
    meta: {
      id: 'section_4_cargo_conclusion_solved',
      image: '/locations/access_gate-cargo.png',
      title: 'Section 4 Cargo: Freight Gate Permission Check',
      text: 'The gate stops lying as soon as Alex fixes the access check it actually reads. Tony gives the scanner a look usually reserved for delayed shipments.\n\nThe freight lane stays orderly all the way to Airlock',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_cargo' },
  },

  section_4_cargo_conclusion_override: {
    meta: {
      id: 'section_4_cargo_conclusion_override',
      image: '/locations/access_gate-cargo.png',
      title: 'Section 4 Cargo: Freight Gate Permission Check',
      text: 'Alex forces the freight lock, the door jerks open, and three compliance policies quietly die inside the wall.\n\nThe path is open, but the override smell follows Alex toward the airlock like a second tether.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_cargo_fallout' },
  },
}
