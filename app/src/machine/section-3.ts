import type { ChallengeSceneData } from '../types/story'

export const section3States = {
  // ── Section 3: Crossing the Ship ────────────────────────
  section_3: {
    meta: {
      id: 'section_3',
      text: 'The terminal is finally holding a live connection to Sector A when a new alert climbs over the recovery logs. Water is not stuck here anymore. The line is blocked farther down the ship at Maintenance Access Gate before Airlock #4, where the supply path narrows into the outer service corridor. The damaged segment is outside the safe interior path, so Alex will need airlock access and a hull-work drone to reach it safely. Alex looks up from the screen and finds himself standing between two doors: the heavier cargo hatch on the left and the cleaner medical passage on the right.',
      dialogue: [
        { speaker: 'lina', text: 'The software side is breathing again. Now go move the part that refuses to move.' },
        { speaker: 'alex', text: 'It\'s like you imply that I have to do something physically?!' },
        { speaker: 'lina', text: 'Only eventually. For now you need to get there first.' },
        { speaker: 'alex', text: 'Cargo is slower and cleaner. Medical is shorter and stranger.' },
        { speaker: 'lina', text: 'Everything on this ship is shorter and stranger.' },
      ],
      task: {
        type: 'single_choice',
        variant: 'branch',
        options: [
          { id: 'cargo', content: 'Through Cargo management compartment' },
          { id: 'medical', content: 'Through Medical passage' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        { guard: ({ event }: any) => event.answer === 'cargo', target: 'section_3_conclusion_cargo', actions: [{ type: 'set', params: { route_choice: 'cargo' } }] },
        { guard: ({ event }: any) => event.answer === 'medical', target: 'section_3_conclusion_medical', actions: [{ type: 'set', params: { route_choice: 'medical' } }] },
      ],
    },
  },

  section_3_conclusion_cargo: {
    meta: {
      id: 'section_3_conclusion_cargo',
      text: 'Alex cuts through freight corridors where everything smells like dust, metal, and accounting.\n\nTony is already waiting by the freight checkpoint with a pass that should have worked the first time.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_4_cargo_intro' },
  },

  section_3_conclusion_medical: {
    meta: {
      id: 'section_3_conclusion_medical',
      text: 'Alex cuts through steam, vending noise, and medical scanners that look too awake for this hour.\n\nClara gets Alex to the quarantine side gate, where the paperwork is failing in a more creative way.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_4_medical_intro' },
  },
}
