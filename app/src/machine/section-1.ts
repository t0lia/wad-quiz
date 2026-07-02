import type { ChallengeSceneData } from '../types/story'

export const section1States = {
  // ── Section 1: Boot Choice in the Incubator Zone ──────────────
  section_1: {
    meta: {
      id: 'section_1',
      image: '/locations/incubator_4.png',
      title: 'Boot Choice in the Incubator Zone',
      text: 'Alex drops into a folding chair in Incubator #4. A potato vine glows inside a glass growth chamber while red alarm lights pulse across the aisle. Sector A is locked after the control link fails, and the watering system is frozen. The PDA opens a local maintenance terminal. To Alex surprise, instead of the standard welcome screen he\'s presented with boot menu he has not seen before. A call from Lina distracts his uncertainty.',
      dialogue: [
        { speaker: 'lina', text: 'How are things looking?' },
        { speaker: 'alex', text: 'That\'s a strange new boot menu I\'m getting...' },
        { speaker: 'lina', text: 'Huh? Must be yet another half baked software update. What does it say?' },
        { speaker: 'alex', text: 'Boot V9 or boot V10.0037.custom.experimental.unsigned' },
        { speaker: 'lina', text: 'You\'re on your own with this one. Who knows what promisses unsigned gives...' },
      ],
      task: {
        type: 'single_choice',
        variant: 'branch',
        options: [
          { id: 'standard', content: 'V9 Enterprise' },
          { id: 'unsigned', content: 'V10.0037.custom.experimental.unsigned' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'standard', target: 'section_2_standard_intro', actions: [{ type: 'set', params: { boot_mode: 'standard' } }, { type: 'score', params: { technical: 0.4, dedication: 0.3, social: 0 } }] },
        { guard: ({ event }: any) => event.answer === 'unsigned', target: 'section_2_unsigned_intro', actions: [{ type: 'set', params: { boot_mode: 'unsigned' } }, { type: 'score', params: { technical: -0.3, dedication: -0.2, social: 0 } }] },
      ],
    },
  },
}
