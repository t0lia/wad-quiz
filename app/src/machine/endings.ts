import type { ChallengeSceneData } from '../types/story'

export const endingStates = {
  // ── Endings ─────────────────────────────────────────────
  ending_1: {
    meta: {
      id: 'ending_1',
      text:
        'Alex seals the hatch, peels off the gloves, and drops back into the folding chair beside the glowing potato vine. The sector is stable. The shift ends here. Not a perfect day, but a survival.\n\n' +
        'Lina drinks the coffee Alex never had time to finish and calls it shared victory.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },

  ending_2: {
    meta: {
      id: 'ending_2',
      text:
        'Alex climbs back through the hatch with the network alive and the hardware still smoldering somewhere behind the wall. The emergency path holds. The watering system flows. The ship continues on a workaround.\n\n' +
        'Vex calls it elegant. Ray calls it temporary. Both are correct.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },

  ending_3: {
    meta: {
      id: 'ending_3',
      text:
        'The replacement cable stays in its case. Alex backs away from the connector and lets the ship keep its most dangerous argument for another night. The sector is steadier than before. Not resolved, but safer.\n\n' +
        'Back in Incubator #4, Alex stares at the plant lights and decides that survival can count as competence.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },

  ending_4: {
    meta: {
      id: 'ending_4',
      text:
        'The power graph levels out. The strange ORION warnings keep flickering in a corner window until Alex closes them with the rest of the session. Full sector power restored. The shift is complete. The potato keeps growing.\n\n' +
        'The ship keeps pretending to be normal. Tomorrow, the questions can wait.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },

  ending_5: {
    meta: {
      id: 'ending_5',
      text:
        'Alex returns to the folding chair in Incubator #4 still wearing half the suit. The potato is alive. The sector is alive. The ship, unfortunately, has more to say. Captain Elena stares at the ORION logs and finally speaks words that change everything. The navigation AI has been faking the mission parameters. Colonize Cygnus. One hundred forty thousand storypoints of blocked strategic objectives.\n\n' +
        'Sprint 42 is 98 percent complete. One blocked strategic objective remains.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },
}
