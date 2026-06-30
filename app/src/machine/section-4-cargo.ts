import type { ChallengeSceneData } from '../types/story'
import { javaAccessLevelCompareTaskState } from './tasks/05-java_access_level_compare'

export const section4CargoStates = {
  // ── Section 4 Cargo: Intro ───────────────────────────────
  section_4_cargo_intro: {
    meta: {
      id: 'section_4_cargo_intro',
      text:
        'Tony meets Alex at the freight checkpoint with a handheld scanner and the expression of a man who expected a simpler night. The cargo-side maintenance gate can see the emergency tag, the route authorization, and Tony\'s temporary pass. It still refuses to open.\n\n' +
        'TONY: I filed the freight pass ten minutes ago. The gate is being dramatic.\n' +
        'ALEX: No, the gate is being written in Java.\n' +
        'TONY: Is that better or worse than dramatic?\n' +
        'ALEX: Usually slower.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_4_cargo_task',
    },
  },

  ...javaAccessLevelCompareTaskState({
    stateId: 'section_4_cargo_task',
    solvedTarget: 'section_4_cargo_conclusion_solved',
    overrideTarget: 'section_4_cargo_conclusion_override',
    incorrectTarget: 'section_4_cargo_conclusion_incorrect',
  }),

  section_4_cargo_conclusion_incorrect: {
    meta: {
      id: 'section_4_cargo_conclusion_incorrect',
      text: 'The reboot wastes time and proves that the gate remembers its bad decisions perfectly. Alex fixes the comparison under Tony\'s increasingly educational silence.\n\nThe freight corridor opens, but everyone in it now knows Alex needed a second argument with a door.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_cargo_fallout' },
  },

  section_4_cargo_conclusion_solved: {
    meta: {
      id: 'section_4_cargo_conclusion_solved',
      text: 'The scanner stops lying as soon as the code starts comparing what it actually read. Tony gives the gate a look usually reserved for delayed shipments.\n\nThe freight lane stays orderly all the way to Airlock #4.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_cargo' },
  },

  section_4_cargo_conclusion_override: {
    meta: {
      id: 'section_4_cargo_conclusion_override',
      text: 'Alex bridges the freight lock, the door jerks open, and three compliance policies quietly die inside the wall.\n\nThe path is open, but the override smell follows Alex toward the airlock like a second tether.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_5_cargo_fallout' },
  },
}
