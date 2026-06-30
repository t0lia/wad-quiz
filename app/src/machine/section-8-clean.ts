import type { ChallengeSceneData } from '../types/story'
import { pyFarmPrefixBoundaryTaskState } from './tasks/09-py_farm_prefix_boundary'

export const section8CleanStates = {
  // ── Section 8 Clean: Intro ───────────────────────────────
  section_8_clean_intro: {
    meta: {
      id: 'section_8_clean_intro',
      text:
        'The technical gap is narrow, dark, and almost manageable. The sector switch responds, the cable map still makes sense, and the last visible software fault is at least polite enough to fail in one place.\n\n' +
        'ALEX: The switch responds, but traffic keeps wandering off into the wrong network.\n' +
        'RAY: Then bring the network boundary back where it belongs.\n' +
        'ALEX: I would love one problem tonight that stays politely inside its own lines.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: 'section_8_clean_task',
    },
  },

  ...pyFarmPrefixBoundaryTaskState({
    stateId: 'section_8_clean_task',
    solvedTarget: 'section_8_clean_conclusion_solved',
    overrideTarget: 'section_8_clean_conclusion_override',
    incorrectTarget: 'section_8_clean_conclusion_incorrect',
  }),

  section_8_clean_conclusion_incorrect: {
    meta: {
      id: 'section_8_clean_conclusion_incorrect',
      text: 'The workaround holds right up to the next stress test, then something else breaks under the weight. Alex fixes the mask under the accumulated frustration.\n\nThe interface stabilizes but carries the smell of all the shortcuts that came before it.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  section_8_clean_conclusion_solved: {
    meta: {
      id: 'section_8_clean_conclusion_solved',
      text: 'The prefix correction lands cleanly, traffic routes stay inside their boundaries, and the farm switch finally behaves.\n\nThe hull path is stable now, held by one honest configuration in a night full of shortcuts.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  section_8_clean_conclusion_override: {
    meta: {
      id: 'section_8_clean_conclusion_override',
      text: 'Alex forces a tunnel bridge that bypasses the real fix, and it works immediately but looks fundamentally dishonest.\n\nThe hull route is open now, but one more promise is being kept by borrowed certainty.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_8_exit_clean' },
  },

  // ── Section 8 Exit: Partial recovery or containment ──────
  section_8_exit_clean: {
    meta: {
      id: 'section_8_exit_clean',
      text:
        'The PDA receives a second notice. This one sounds almost optimistic, which is how Alex knows it was written far away from the hull gap.',
      task: {
        type: 'multiple_choice',
        options: [
          { id: 'stop', content: 'Stop and sign off' },
          { id: 'continue', content: 'Continue to distributor' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'stop',
          target: 'ending_2',
          actions: [{ type: 'set', params: { accepted_exit_8: true } }],
        },
        { guard: ({ event }: any) => event.answer === 'continue', target: 'section_9' },
      ],
    },
  },
}
