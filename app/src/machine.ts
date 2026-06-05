import { createMachine } from 'xstate'
import type { ChallengeSceneData } from './types/story'

const normalize = (value?: string) => (value ?? '').toLowerCase().trim()

const parseRecord = (value?: string): Record<string, string> => {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k, String(v)])
    )
  } catch {
    return {}
  }
}

const parseNumberRecord = (value?: string): Record<string, number> => {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed)
        .map(([k, v]) => [k, Number(v)] as const)
        .filter(([, v]) => Number.isFinite(v))
    )
  } catch {
    return {}
  }
}

const splitCsv = (value?: string) =>
  (value ?? '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)

const isExactOrder = (value: string | undefined, expected: string[]) =>
  splitCsv(value).join(',') === expected.join(',')

const isExpectedMapping = (
  value: string | undefined,
  expected: Record<string, string>
) => {
  const actual = parseRecord(value)
  return Object.entries(expected).every(([leftId, rightId]) => actual[leftId] === rightId)
}

const isExpectedSwipe = (
  value: string | undefined,
  expected: Record<string, 'left' | 'right'>
) => {
  const actual = Object.fromEntries(
    (value ?? '')
      .split('|')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [cardId, dir] = entry.split(':')
        return [cardId, dir as 'left' | 'right']
      })
  )
  return Object.entries(expected).every(([cardId, dir]) => actual[cardId] === dir)
}

const isGoodNutrientPlan = (value?: string) => {
  const allocation = parseNumberRecord(value)
  const n1 = allocation.n1
  const n2 = allocation.n2
  const n3 = allocation.n3
  const n4 = allocation.n4

  if ([n1, n2, n3, n4].some((x) => typeof x !== 'number')) return false
  const total = n1 + n2 + n3 + n4
  return total === 20 && n1 >= n2 && n2 >= n3 && n3 >= n4
}

/**
 * Hydroponic Factory Working Day — XState routing machine.
 *
 * State-name conventions:
 *   intro / text_*  → text-only pages (TextScene)
 *   task_*          → interactive task pages (ChallengeScene)
 *   ending_*        → final text pages (two possible endings)
 *
 * Cyclic edge: task_git → text_git_hint → task_git (retry loop)
 * Branching:   task_git → text_git_success (if first block === 'git')
 *              task_git → text_git_hint    (otherwise)
 * Two endings: ending_success, ending_partial
 */
export const hydroMachine = createMachine<
  {},
  { type: 'NEXT'; answer?: string } ,
  any,
  any,
  any,
  string,
  string,
  any,
  unknown,
  any,
  ChallengeSceneData
>({
  id: 'hydroFactory',
  initial: 'intro',
  types: {} as {
    events:
      | { type: 'NEXT'; answer?: string }
  },
  states: {
    // ── Intro text page ────────────────────────────────────
    intro: {
      meta: {
        id: 'intro',
        text:
          "Good morning! You're the head engineer at GreenCore Hydroponic Factory. " +
          "The morning shift has just begun and the plants are counting on you. " +
          "Let's make sure today runs smoothly.",
        task: {
          type: 'text_scene',
          choices: [{ label: 'Go', event: 'NEXT' }],
        },
      },
      on: { NEXT: 'task_ph' },
    },

    // ── Shared path (before the git branching) ─────────────
    task_ph: {
      meta: {
        id: 'task_ph',
        text: "Morning check: Greenhouse A pH sensor shows 7.8. What is the optimal pH range for leafy greens grown hydroponically?",
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'ph1', content: '5.5 – 6.5' },
            { id: 'ph2', content: '6.0 – 7.0' },
            { id: 'ph3', content: '7.0 – 8.0' },
            { id: 'ph4', content: '4.5 – 5.5' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) => splitCsv(event.answer).includes('ph1'),
            target: 'text_to_nutrients',
          },
          { target: 'text_ph_retry' },
        ],
      },
    },
    text_to_nutrients: {
      meta: {
        id: 'text_to_nutrients',
        text:
          "Good call on the pH! You walk down the corridor toward the nutrient mixing lab. " +
          "The smell of mineral solution fills the air. Time to plan the week's nutrient budget.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Review the mix', event: 'NEXT' },
            { label: 'Skip ahead to sensors', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_nutrients' },
    },
    text_ph_retry: {
      meta: {
        id: 'text_ph_retry',
        text:
          "The pH range wasn't quite right. Take a moment to correct the nutrient plan, " +
          "or move on and inspect the sensor stream instead.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Retry nutrients', event: 'NEXT' },
            { label: 'Go to sensors', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_nutrients' },
    },

    task_nutrients: {
      meta: {
        id: 'task_nutrients',
        text: "The weekly nutrient budget for the mixing lab is 20 litres of concentrate. Allocate it across the four greenhouse zones.",
        task: {
          type: 'resource_allocation',
          totalResource: 20,
          unit: 'L',
          items: [
            { id: 'n1', label: 'Greenhouse A — Leafy greens', min: 4, max: 10 },
            { id: 'n2', label: 'Greenhouse B — Tomatoes', min: 3, max: 8 },
            { id: 'n3', label: 'Greenhouse C — Herbs', min: 2, max: 6 },
            { id: 'n4', label: 'Greenhouse D — Seedlings', min: 1, max: 4 },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) => isGoodNutrientPlan(event.answer),
            target: 'text_to_sensor',
          },
          { target: 'text_nutrients_retry' },
        ],
      },
    },
    text_to_sensor: {
      meta: {
        id: 'text_to_sensor',
        text:
          "The nutrient plan looks solid. You head to Greenhouse B, where the automated sensors " +
          "are streaming live data. One of the logs looks suspicious — time to investigate.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Inspect the logs', event: 'NEXT' },
            { label: 'Head to plants anyway', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_sensor_log' },
    },
    text_nutrients_retry: {
      meta: {
        id: 'text_nutrients_retry',
        text:
          "The nutrient allocation still needs balancing. Recheck the budget, " +
          "or bypass the lab and keep the plant sorting on schedule.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Try again', event: 'NEXT' },
            { label: 'Skip to plant sort', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_sensor_log' },
    },

    task_sensor_log: {
      meta: {
        id: 'task_sensor_log',
        text: "The Greenhouse B sensor stream is live. Click the log line that shows the critical error causing the irrigation pump to halt.",
        task: {
          type: 'click_on_line',
          lines: [
            { id: 'sl1', content: '08:02:11 [INFO]  Pump B-1: flow rate 2.4 L/min — nominal' },
            { id: 'sl2', content: '08:02:14 [INFO]  Nutrient dosing: EC 1.8 mS/cm — OK' },
            { id: 'sl3', content: '[ERROR] Pump B-1: pressure drop below threshold — halting' },
            { id: 'sl4', content: '08:02:17 [INFO]  Reservoir level: 74% — OK' },
            { id: 'sl5', content: '08:02:19 [WARN]  Humidity sensor B-3: reading unstable' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) => normalize(event.answer) === 'sl3',
            target: 'text_to_plants',
          },
          { target: 'text_sensor_retry' },
        ],
      },
    },
    text_to_plants: {
      meta: {
        id: 'text_to_plants',
        text:
          "Sensor issue identified! Now swing by the sorting station — a fresh batch of seedlings " +
          "has arrived and the team needs them prioritised by health status before potting.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Sort the trays', event: 'NEXT' },
            { label: 'Move to git task early', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_plant_sort' },
    },
    text_sensor_retry: {
      meta: {
        id: 'text_plant_sort_retry',
        text:
          "A few trays still need better prioritisation. Try sorting again, " +
          "or head to the git issue and tackle the pipeline directly.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Sort again', event: 'NEXT' },
            { label: 'Skip to git', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_plant_sort' },
    },

    task_plant_sort: {
      meta: {
        id: 'task_plant_sort',
        text: "A new batch of seedlings has arrived at the sorting station. Sort each tray into the correct priority bucket.",
        task: {
          type: 'card_filter',
          cards: [
            { id: 'ps1', content: 'Tray A — yellowing leaves, wilted', meta: { status: 'critical' } },
            { id: 'ps2', content: 'Tray B — healthy, uniform growth', meta: { status: 'healthy' } },
            { id: 'ps3', content: 'Tray C — slight tip-burn, recovering', meta: { status: 'moderate' } },
            { id: 'ps4', content: 'Tray D — no germination, discard', meta: { status: 'critical' } },
          ],
          buckets: [
            { id: 'pb1', label: 'Treat now' },
            { id: 'pb2', label: 'Monitor' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) =>
              isExpectedMapping(event.answer, {
                ps1: 'pb1',
                ps2: 'pb2',
                ps3: 'pb2',
                ps4: 'pb1',
              }),
            target: 'text_to_git',
          },
          { target: 'text_plant_sort_retry' },
        ],
      },
    },
    text_to_git: {
      meta: {
        id: 'text_to_git',
        text:
          "Seedlings sorted. You grab a quick coffee in the break room. " +
          "A colleague mentions that the deployment pipeline for the factory's monitoring dashboard " +
          "broke overnight. They need you to run the right git command to inspect the history.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Run the git command', event: 'NEXT' },
            { label: 'Ask for a hint first', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_git' },
    },
    text_plant_sort_retry: {
      meta: {
        id: 'text_plant_sort_retry',
        text:
          "A few trays still need better prioritisation. Try sorting again, " +
          "or head to the git issue and tackle the pipeline directly.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Sort again', event: 'NEXT' },
            { label: 'Skip to git', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_git' },
    },

    // ── Git branching task ──────────────────────────────────
    task_git: {
      meta: {
        id: 'task_git',
        text: "Build the git command to view the last 5 commit messages in the pipeline repository.",
        task: {
          type: 'block_builder',
          slots: 4,
          availableBlocks: [
            { id: 'gb1', content: 'git' },
            { id: 'gb2', content: 'log' },
            { id: 'gb3', content: '--oneline' },
            { id: 'gb4', content: '-5' },
            { id: 'gb5', content: 'push' },
            { id: 'gb6', content: 'status' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) => normalize(event.answer) === 'git',
            target: 'text_git_success',
          },
          { target: 'text_git_hint' },
        ],
      },
    },

    // Hint page loops back to task_git  ← CYCLE in the graph
    text_git_hint: {
      meta: {
        id: 'text_git_hint',
        text:
          "Hmm — that command doesn't start with 'git'. " +
          "Remember: every git command begins with the word git. " +
          "Want to try building it again, or move on and tackle it differently?",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Try Again', event: 'NEXT' },
            { label: 'Continue Anyway', event: 'NEXT' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) => normalize(event.answer).includes('continue anyway'),
            target: 'text_git_partial',
          },
          { target: 'task_git' },
        ],
      },
    },

    // ── Branch A — git command was correct ─────────────────
    text_git_success: {
      meta: {
        id: 'text_git_success',
        text:
          "Perfect command! The git log shows exactly where the pipeline broke. " +
          "Your fix gets merged and the monitoring dashboard comes back online. " +
          "The afternoon rush is starting — the operations team is counting on you.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Continue to deployment', event: 'NEXT' },
            { label: 'Switch to backup work', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_deploy_order' },
    },
    task_deploy_order: {
      meta: {
        id: 'task_deploy_order',
        text: "The monitoring dashboard fix is ready. Put the deployment steps in the correct order.",
        task: {
          type: 'drag_and_drop',
          items: [
            { id: 'do1', content: 'Run automated test suite' },
            { id: 'do2', content: 'Build the Docker image' },
            { id: 'do3', content: 'Push image to container registry' },
            { id: 'do4', content: 'Roll out to production cluster' },
            { id: 'do5', content: 'Verify health checks pass' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) =>
              isExactOrder(event.answer, ['do1', 'do2', 'do3', 'do4', 'do5']),
            target: 'task_alert_triage',
          },
          { target: 'text_deploy_retry' },
        ],
      },
    },
    text_deploy_retry: {
      meta: {
        id: 'text_deploy_retry',
        text:
          "The deployment flow is out of order. Review the sequence again, " +
          "or pivot to afternoon systems monitoring if you want to move faster.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Retry deployment order', event: 'NEXT' },
            { label: 'Shift to backup operations', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_alert_triage' },
    },
    task_alert_triage: {
      meta: {
        id: 'task_alert_triage',
        text: "The factory monitoring dashboard is live again — alerts are flooding in. Swipe right to escalate, left to keep watching.",
        task: {
          type: 'swipe_cards',
          cards: [
            { id: 'at1', content: 'CO₂ level in Greenhouse A: 1800 ppm — above safe limit', meta: { zone: 'GH-A' } },
            { id: 'at2', content: 'Humidity: 62% — within normal range', meta: { zone: 'GH-B' } },
            { id: 'at3', content: 'Water temp: 28°C — too warm for lettuce', meta: { zone: 'GH-C' } },
            { id: 'at4', content: 'LED cycle: running on schedule', meta: { zone: 'GH-D' } },
          ],
          options: [
            { id: 'ao1', label: 'Escalate' },
            { id: 'ao2', label: 'Monitor' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) =>
              isExpectedSwipe(event.answer, {
                at1: 'left',
                at2: 'right',
                at3: 'left',
                at4: 'right',
              }),
            target: 'text_a_afternoon',
          },
          { target: 'text_alert_retry' },
        ],
      },
    },
    text_a_afternoon: {
      meta: {
        id: 'text_a_afternoon',
        text:
          "Great triage work on the alerts! The on-call team has been notified. " +
          "You pour another coffee and settle in for the second half of the shift — " +
          "network diagnostics and infrastructure decisions await.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Map the API codes', event: 'NEXT' },
            { label: 'Skip to harvest planning', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_http_mapping' },
    },
    text_alert_retry: {
      meta: {
        id: 'text_alert_retry',
        text:
          "The alert triage didn't land correctly. Recalibrate the escalation decisions, " +
          "or accept a more cautious approach and move on.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Triage again', event: 'NEXT' },
            { label: 'Move on to diagnostics', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_alert_triage' },
    },
    task_http_mapping: {
      meta: {
        id: 'task_http_mapping',
        text: "The dashboard API is returning some unusual status codes. Match each code to its meaning.",
        task: {
          type: 'mapping',
          left: [
            { id: 'hc1', content: '503' },
            { id: 'hc2', content: '429' },
            { id: 'hc3', content: '504' },
          ],
          right: [
            { id: 'hm1', content: 'Service Unavailable' },
            { id: 'hm2', content: 'Too Many Requests' },
            { id: 'hm3', content: 'Gateway Timeout' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) =>
              isExpectedMapping(event.answer, {
                hc1: 'hm1',
                hc2: 'hm2',
                hc3: 'hm3',
              }),
            target: 'task_dependency_map',
          },
          { target: 'text_http_retry' },
        ],
      },
    },
    text_http_retry: {
      meta: {
        id: 'text_http_retry',
        text:
          "Those API codes are a little tricky. Review the mappings again, " +
          "or push ahead to the dependency cleanup.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Try mapping again', event: 'NEXT' },
            { label: 'Skip to dependency review', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_http_mapping' },
    },
    task_dependency_map: {
      meta: {
        id: 'task_dependency_map',
        text: "The CI migration pipeline is stalled. Tap the task node that has no dependencies — the one that is safe to run first.",
        task: {
          type: 'decision_map',
          nodes: [
            { id: 'dm1', label: 'Deploy', x: 200, y: 28 },
            { id: 'dm2', label: 'Integration test', x: 95, y: 115 },
            { id: 'dm3', label: 'Lint & build', x: 305, y: 115 },
            { id: 'dm4', label: 'Unit tests', x: 95, y: 200 },
            { id: 'dm5', label: 'Type-check', x: 305, y: 200 },
          ],
          edges: [
            { from: 'dm4', to: 'dm2' },
            { from: 'dm3', to: 'dm2' },
            { from: 'dm2', to: 'dm1' },
            { from: 'dm5', to: 'dm3' },
          ],
          correctNodeIds: ['dm4', 'dm5'],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) => ['dm4', 'dm5'].includes(normalize(event.answer)),
            target: 'text_a_before_final',
          },
          { target: 'text_dep_retry' },
        ],
      },
    },
    text_dep_retry: {
      meta: {
        id: 'text_dep_retry',
        text:
          "The dependency chain still looks tangled. Pick the safe first task again, " +
          "or keep moving toward the final decision.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Retry the dependency map', event: 'NEXT' },
            { label: 'Continue to the final task', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_dependency_map' },
    },
    text_a_before_final: {
      meta: {
        id: 'text_a_before_final',
        text:
          "The dependency graph is clear and the migration is unblocked. " +
          "One last task before you can hand off to the evening crew: " +
          "choose the right LED spectrum settings for tonight's growth cycle.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Pick the LED setting', event: 'NEXT' },
            { label: 'Review the shift notes', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_led_choice' },
    },
    task_led_choice: {
      meta: {
        id: 'task_led_choice',
        text: "Tonight's growth cycle begins at 20:00. Which LED spectrum setting maximises leafy-green vegetative growth?",
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'lc1', content: 'Red-dominant (660 nm) — stimulates flowering' },
            { id: 'lc2', content: 'Blue-dominant (450 nm) — promotes compact vegetative growth' },
            { id: 'lc3', content: 'Far-red (730 nm) — extends shade-avoidance response' },
            { id: 'lc4', content: 'Green-only (520 nm) — minimal photosynthetic effect' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) => splitCsv(event.answer).includes('lc2'),
            target: 'ending_success',
          },
          { target: 'text_led_retry' },
        ],
      },
    },
    text_led_retry: {
      meta: {
        id: 'text_led_retry',
        text:
          "That LED setting feels off. Give it another try, " +
          "or accept the afternoon summary and wrap up.",
        task: {
          type: 'text_scene',
          choices: [
            { label: 'Retry LED choice', event: 'NEXT' },
            { label: 'Finish the shift', event: 'NEXT' },
          ],
        },
      },
      on: { NEXT: 'task_led_choice' },
    },

    ending_success: {
      meta: {
        id: 'ending_success',
        text:
          "🌿 Shift complete — GreenCore is thriving!\n\n" +
          "Every sensor checked, every alert handled, the pipeline fixed, " +
          "and the LED spectrum dialled in for peak growth. " +
          "The evening crew walks in to a factory running like clockwork. " +
          "Well done, engineer.",
        task: {
          type: 'text_scene',
        },
      },
      type: 'final',
    },

    // ── Branch B — git command was wrong (after hint / skip) ─
    text_git_partial: {
      meta: {
        id: 'text_git_partial',
        text:
          "Your colleague ends up sorting the git issue manually. " +
          "Not ideal, but the factory can't wait — you pivot to the afternoon " +
          "operations checklist and tackle a different set of challenges.",
        task: {
          type: 'text_scene',
        },
      },
      on: { NEXT: 'task_water_temp' },
    },
    task_water_temp: {
      meta: {
        id: 'task_water_temp',
        text: "The reservoir thermometer in Greenhouse C reads 27°C. What is the ideal water temperature range for hydroponic herbs?",
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'wt1', content: '10 – 15°C — too cold, slows nutrient uptake' },
            { id: 'wt2', content: '18 – 22°C — optimal for most herbs' },
            { id: 'wt3', content: '25 – 30°C — promotes root disease' },
            { id: 'wt4', content: '5 – 10°C — dormancy risk' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) => splitCsv(event.answer).includes('wt2'),
            target: 'task_harvest_order',
          },
          { target: 'text_water_retry' },
        ],
      },
    },
    text_water_retry: { meta: undefined, on: { NEXT: 'task_water_temp' } },
    task_harvest_order: {
      meta: {
        id: 'task_harvest_order',
        text: "The evening harvest cycle is starting. Put the harvest steps in the correct order.",
        task: {
          type: 'drag_and_drop',
          items: [
            { id: 'ho1', content: 'Turn off the irrigation pump' },
            { id: 'ho2', content: 'Lower the net-pot tray' },
            { id: 'ho3', content: 'Cut stems at base level' },
            { id: 'ho4', content: 'Weigh and record yield per tray' },
            { id: 'ho5', content: 'Transfer to cold storage' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) =>
              isExactOrder(event.answer, ['ho1', 'ho2', 'ho3', 'ho4', 'ho5']),
            target: 'text_b_afternoon',
          },
          { target: 'text_harvest_retry' },
        ],
      },
    },
    text_harvest_retry: { meta: undefined, on: { NEXT: 'task_harvest_order' } },
    text_b_afternoon: {
      meta: {
        id: 'text_b_afternoon',
        text: "The afternoon checklist is underway. The greenhouse needs a careful eye on CO₂ and plant health.",
        task: {
          type: 'text_scene',
          choices: [{ label: 'Continue', event: 'NEXT' }],
        },
      },
      on: { NEXT: 'task_co2_mapping' },
    },

    task_co2_mapping: {
      meta: {
        id: 'task_co2_mapping',
        text: "Greenhouse C has three CO₂ zones. Match each zone to its current status reading.",
        task: {
          type: 'mapping',
          left: [
            { id: 'cm1', content: 'Zone 1 — 400 ppm' },
            { id: 'cm2', content: 'Zone 2 — 1500 ppm' },
            { id: 'cm3', content: 'Zone 3 — 800 ppm' },
          ],
          right: [
            { id: 'cr1', content: 'Ambient — no enrichment' },
            { id: 'cr2', content: 'High — reduce injection' },
            { id: 'cr3', content: 'Optimal — maintain' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) =>
              isExpectedMapping(event.answer, {
                cm1: 'cr1',
                cm2: 'cr2',
                cm3: 'cr3',
              }),
            target: 'task_alert_swipe',
          },
          { target: 'text_co2_retry' },
        ],
      },
    },
    text_co2_retry: { meta: undefined, on: { NEXT: 'task_co2_mapping' } },
    task_alert_swipe: {
      meta: {
        id: 'task_alert_swipe',
        text: "Branch B alert queue: triage each plant-health alert — escalate or keep watching?",
        task: {
          type: 'swipe_cards',
          cards: [
            { id: 'as1', content: 'Root browning detected in tray G-07', meta: { severity: 'high' } },
            { id: 'as2', content: 'Leaf tip burn: minor, <5% of canopy', meta: { severity: 'low' } },
            { id: 'as3', content: 'Pythium suspected — zone C-3 quarantine now', meta: { severity: 'critical' } },
            { id: 'as4', content: 'Growth rate 3% below weekly average', meta: { severity: 'low' } },
          ],
          options: [
            { id: 'op1', label: 'Escalate' },
            { id: 'op2', label: 'Watch' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) =>
              isExpectedSwipe(event.answer, {
                as1: 'left',
                as2: 'right',
                as3: 'left',
                as4: 'right',
              }),
            target: 'text_b_before_final',
          },
          { target: 'text_alertswipe_retry' },
        ],
      },
    },
    text_alertswipe_retry: { meta: undefined, on: { NEXT: 'task_alert_swipe' } },
    text_b_before_final: {
      meta: {
        id: 'text_b_before_final',
        text: "The plant alerts are triaged. One last review of tonight's growth log will decide the handoff.",
        task: {
          type: 'text_scene',
          choices: [{ label: 'Review log', event: 'NEXT' }],
        },
      },
      on: { NEXT: 'task_growth_log' },
    },
    task_growth_log: {
      meta: {
        id: 'task_growth_log',
        text: "Review the overnight automation log. Click the line that indicates a problem that needs immediate attention tomorrow morning.",
        task: {
          type: 'click_on_line',
          lines: [
            { id: 'gl1', content: '02:00:00 [INFO]  LED cycle started — 18h photoperiod' },
            { id: 'gl2', content: '02:15:33 [INFO]  EC reading: 1.9 mS/cm — within range' },
            { id: 'gl3', content: '03:44:21 [WARN]  Pump C-2: intermittent flow — retrying' },
            { id: 'gl4', content: '03:44:25 [ERROR] Pump C-2: failed after 3 retries — offline' },
            { id: 'gl5', content: '04:00:00 [INFO]  Nightly summary saved to /var/log/growlog' },
          ],
        },
      },
      on: {
        NEXT: [
          {
            guard: ({ event }: { event: { answer?: string } }) => normalize(event.answer) === 'gl4',
            target: 'ending_partial',
          },
          { target: 'text_growth_retry' },
        ],
      },
    },
    text_growth_retry: { meta: undefined, on: { NEXT: 'task_growth_log' } },

    ending_partial: {
      meta: {
        id: 'ending_partial',
        text:
          "🌱 Shift complete — a good day's work, despite the hiccups.\n\n" +
          "The git pipeline is still on the todo list, but the plants are healthy, " +
          "the CO₂ is balanced, and the growth logs look clean. " +
          "Tomorrow you'll nail that command. For now — rest up.",
        task: {
          type: 'text_scene',
        },
      },
      type: 'final',
    },
  },
})
