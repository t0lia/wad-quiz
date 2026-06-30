import type { ChallengeSceneData } from '../types/story'

export const section1States = {
  // ── Section 1: Boot Choice in the Grow Bay ──────────────
  section_1: {
    meta: {
      id: 'section_1',
      text:
        'Alex drops into a folding chair in Incubator #4. A potato vine glows inside a glass grow tube while red alarm lights pulse across the aisle. Sector A is locked after the control link fails, and the watering system is frozen. The PDA opens a local maintenance terminal. To Alex surprise, instead of the standard welcome screen he\'s presented with boot menu he has not seen before. A call from Lina distracts his uncertainty.\n\n' +
        'LINA: How are things looking?\n' +
        'ALEX: That\'s a strange new boot menu I\'m getting...\n' +
        'LINA: Huh? Must be yet another half baked software update. What does it say?\n' +
        'ALEX: Boot V9 or boot V10.0037.custom.experimental.unsigned\n' +
        'LINA: You\'re on your own with this one. Who knows what promisses unsigned gives...',
      task: {
        type: 'multiple_choice',
        options: [
          { id: 'standard', content: 'V9 Enterprise' },
          { id: 'unsigned', content: 'V10.0037.custom.experimental.unsigned' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'standard', target: 'section_1_conclusion_standard', actions: [{ type: 'set', params: { boot_mode: 'standard' } }] },
        { guard: ({ event }: any) => event.answer === 'unsigned', target: 'section_1_conclusion_unsigned', actions: [{ type: 'set', params: { boot_mode: 'unsigned' } }] },
      ],
    },
  },

  section_1_conclusion_standard: {
    meta: {
      id: 'section_1_conclusion_standard',
      text: 'The PDA loads the enterprise console and opens a verified device map across the screen. Sector A shows locked while the recovery tools finish loading. Alex moved with the same enterprise confidence as the build itself, because after all, if the console boot was still progressing, there was no reason to outrun the loading.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_2_standard_intro' },
  },

  section_1_conclusion_unsigned: {
    meta: {
      id: 'section_1_conclusion_unsigned',
      text: 'The PDA loads an unsigned experimental build. Alex is welcomed with a nice new background and soft music. During the load sequence Alex spots useless lines like "validation checks disabled" and "security checks disabled", but he doens\'t pay much attention to those - who reads logs before incidents anyway. With the custom tools and soft music, Alex heads to Sector A Control to start the reconnect.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_2_unsigned_intro' },
  },
}
