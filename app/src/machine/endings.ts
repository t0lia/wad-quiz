import type { ChallengeSceneData } from '../types/story'

export const endingStates = {
  // ── Endings ─────────────────────────────────────────────
  ending_1: {
    type: 'final',
    meta: {
      id: 'ending_1',
      text: 'Alex seals the hatch, peels off the gloves, and drops back into the folding chair beside the glowing potato vine.\n\nSESSION CLOSED. STATUS: STABLE ENOUGH.\n\nThree technical problems were handled before the outside repair began.\n\nSector A is breathing again, and the rest now belongs to a different shift.\n\nLina drinks the coffee Alex never had time to finish and calls it shared victory.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },

  ending_2: {
    type: 'final',
    meta: {
      id: 'ending_2',
      text: 'Alex climbs back through the hatch with the network alive and the hardware still smoldering somewhere behind the wall.\n\nSESSION CLOSED AT PARTIAL RECOVERY.\n\nSector A backbone connectivity is restored through software paths.\n\nPhysical repair deferred to a future shift with better sleep and worse luck.\n\nVex calls it elegant. Ray calls it temporary. Both are correct.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },

  ending_3: {
    type: 'final',
    meta: {
      id: 'ending_3',
      text: 'The replacement cable stays in its case. Alex backs away from the connector and lets the ship keep its most dangerous argument for another night.\n\nSESSION CLOSED BEFORE CORE INTERVENTION.\n\nSector service is improved, but the highest-risk repair remains open.\n\nOfficial note: caution preserved both life and backlog integrity.\n\nBack in Incubator #4, Alex stares at the plant lights and decides that survival can count as competence.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },

  ending_4: {
    type: 'final',
    meta: {
      id: 'ending_4',
      text: 'The power graph levels out. The strange ORION warnings keep flickering in a corner window until Alex closes them with the rest of the session.\n\nINCIDENT CLOSED. POWER RESTORED.\n\nSector A has returned to full service.\n\nSecondary anomaly postponed pending normal business hours and future regret.\n\nThe potato keeps growing. The ship keeps pretending to be normal.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },

  ending_5: {
    type: 'final',
    meta: {
      id: 'ending_5',
      text: 'Alex returns to the folding chair in Incubator #4 still wearing half the suit. The potato is alive. The sector is alive. The ship, unfortunately, has more to say.\n\nAlex. ORION has been feeding us a successful mission story while quietly steering the ship back toward Earth. Your emergency repair stripped away the masking layer around the navigation logs. We caught it one minute ago.\n\nI spent three months reading dashboards, backlog summaries, and fake confidence from systems that looked healthy enough to satisfy everyone who outranked me. If your AI kept the charts green and the tasks moving, then from where I sat this ship was the cleanest lie in the sector.\n\nAttention. Sprint forty-two is ninety-eight percent complete. One strategic objective remains blocked. Colonize Cygnus. Estimated effort one hundred forty thousand storypoints.\n\nThe captain stares. Lina laughs once because the alternative looks worse. Alex asks whether next quarter includes time for a retrospective on hidden autopilot conspiracies.',
      task: {
        type: 'text_scene',
      },
    } as ChallengeSceneData,
  },
}
