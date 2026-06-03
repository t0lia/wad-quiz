import type { ChallengeSceneData } from './types/story'

// ─── Text-page data ───────────────────────────────────────────────────────────

export type TextSceneData = {
  id: string
  text: string
  /** If omitted, a single "Continue →" button that sends NEXT is shown. */
  choices?: { label: string; event: 'NEXT' | 'SKIP' }[]
}

export const textScenes: Record<string, TextSceneData> = {
  intro: {
    id: 'intro',
    text:
      "Good morning! You're the head engineer at GreenCore Hydroponic Factory. " +
      "The morning shift has just begun and the plants are counting on you. " +
      "Let's make sure today runs smoothly.",
  },
  text_to_nutrients: {
    id: 'text_to_nutrients',
    text:
      "Good call on the pH! You walk down the corridor toward the nutrient mixing lab. " +
      "The smell of mineral solution fills the air. Time to plan the week's nutrient budget.",
  },
  text_to_sensor: {
    id: 'text_to_sensor',
    text:
      "The nutrient plan looks solid. You head to Greenhouse B, where the automated sensors " +
      "are streaming live data. One of the logs looks suspicious — time to investigate.",
  },
  text_to_plants: {
    id: 'text_to_plants',
    text:
      "Sensor issue identified! Now swing by the sorting station — a fresh batch of seedlings " +
      "has arrived and the team needs them prioritised by health status before potting.",
  },
  text_to_git: {
    id: 'text_to_git',
    text:
      "Seedlings sorted. You grab a quick coffee in the break room. " +
      "A colleague mentions that the deployment pipeline for the factory's monitoring dashboard " +
      "broke overnight. They need you to run the right git command to inspect the history.",
  },

  // ── Git hint (cycle node) ──────────────────────────────────────────────────
  text_git_hint: {
    id: 'text_git_hint',
    text:
      "Hmm — that command doesn't start with 'git'. " +
      "Remember: every git command begins with the word git. " +
      "Want to try building it again, or move on and tackle it differently?",
    choices: [
      { label: 'Try Again', event: 'NEXT' },
      { label: 'Continue Anyway', event: 'SKIP' },
    ],
  },

  // ── Branch A text pages ────────────────────────────────────────────────────
  text_git_success: {
    id: 'text_git_success',
    text:
      "Perfect command! The git log shows exactly where the pipeline broke. " +
      "Your fix gets merged and the monitoring dashboard comes back online. " +
      "The afternoon rush is starting — the operations team is counting on you.",
  },
  text_a_afternoon: {
    id: 'text_a_afternoon',
    text:
      "Great triage work on the alerts! The on-call team has been notified. " +
      "You pour another coffee and settle in for the second half of the shift — " +
      "network diagnostics and infrastructure decisions await.",
  },
  text_a_before_final: {
    id: 'text_a_before_final',
    text:
      "The dependency graph is clear and the migration is unblocked. " +
      "One last task before you can hand off to the evening crew: " +
      "choose the right LED spectrum settings for tonight's growth cycle.",
  },

  // ── Branch B text pages ────────────────────────────────────────────────────
  text_git_partial: {
    id: 'text_git_partial',
    text:
      "Your colleague ends up sorting the git issue manually. " +
      "Not ideal, but the factory can't wait — you pivot to the afternoon " +
      "operations checklist and tackle a different set of challenges.",
  },
  text_b_afternoon: {
    id: 'text_b_afternoon',
    text:
      "Good work on the harvest sequence! The harvested crops are on their way to " +
      "the packaging station. Now head to Greenhouse C to calibrate the CO₂ zones.",
  },
  text_b_before_final: {
    id: 'text_b_before_final',
    text:
      "The alert queue is clear. One last item on the checklist: " +
      "review the overnight growth log to make sure nothing went wrong " +
      "while the automation was running unsupervised.",
  },

  // ── Endings ────────────────────────────────────────────────────────────────
  ending_success: {
    id: 'ending_success',
    text:
      "🌿 Shift complete — GreenCore is thriving!\n\n" +
      "Every sensor checked, every alert handled, the pipeline fixed, " +
      "and the LED spectrum dialled in for peak growth. " +
      "The evening crew walks in to a factory running like clockwork. " +
      "Well done, engineer.",
  },
  ending_partial: {
    id: 'ending_partial',
    text:
      "🌱 Shift complete — a good day's work, despite the hiccups.\n\n" +
      "The git pipeline is still on the todo list, but the plants are healthy, " +
      "the CO₂ is balanced, and the growth logs look clean. " +
      "Tomorrow you'll nail that command. For now — rest up.",
  },
}

// ─── Task data ────────────────────────────────────────────────────────────────

export const taskScenes: Record<string, ChallengeSceneData> = {

  // ── Shared path tasks (1 – 4) ─────────────────────────────────────────────

  task_ph: {
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

  task_nutrients: {
    id: 'task_nutrients',
    text: "The weekly nutrient budget for the mixing lab is 20 litres of concentrate. Allocate it across the four greenhouse zones.",
    task: {
      type: 'resource_allocation',
      totalResource: 20,
      unit: 'L',
      items: [
        { id: 'n1', label: 'Greenhouse A — Leafy greens', min: 4, max: 10 },
        { id: 'n2', label: 'Greenhouse B — Tomatoes',     min: 3, max: 8  },
        { id: 'n3', label: 'Greenhouse C — Herbs',        min: 2, max: 6  },
        { id: 'n4', label: 'Greenhouse D — Seedlings',    min: 1, max: 4  },
      ],
    },
  },

  task_sensor_log: {
    id: 'task_sensor_log',
    text: "The Greenhouse B sensor stream is live. Click the log line that shows the critical error causing the irrigation pump to halt.",
    task: {
      type: 'click_on_line',
      lines: [
        { id: 'sl1', content: '08:02:11 [INFO]  Pump B-1: flow rate 2.4 L/min — nominal' },
        { id: 'sl2', content: '08:02:14 [INFO]  Nutrient dosing: EC 1.8 mS/cm — OK' },
        { id: 'sl3', content: '08:02:17 [ERROR] Pump B-1: pressure drop below threshold — halting' },
        { id: 'sl4', content: '08:02:17 [INFO]  Reservoir level: 74% — OK' },
        { id: 'sl5', content: '08:02:19 [WARN]  Humidity sensor B-3: reading unstable' },
      ],
    },
  },

  task_plant_sort: {
    id: 'task_plant_sort',
    text: "A new batch of seedlings has arrived at the sorting station. Sort each tray into the correct priority bucket.",
    task: {
      type: 'card_filter',
      cards: [
        { id: 'ps1', content: 'Tray A — yellowing leaves, wilted',   meta: { status: 'critical' } },
        { id: 'ps2', content: 'Tray B — healthy, uniform growth',     meta: { status: 'healthy' } },
        { id: 'ps3', content: 'Tray C — slight tip-burn, recovering', meta: { status: 'moderate' } },
        { id: 'ps4', content: 'Tray D — no germination, discard',     meta: { status: 'critical' } },
      ],
      buckets: [
        { id: 'pb1', label: 'Treat now' },
        { id: 'pb2', label: 'Monitor' },
      ],
    },
  },

  // ── Git branching task (5) ────────────────────────────────────────────────

  task_git: {
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

  // ── Branch A tasks (6a – 10a) ─────────────────────────────────────────────

  task_deploy_order: {
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

  task_alert_triage: {
    id: 'task_alert_triage',
    text: "The factory monitoring dashboard is live again — alerts are flooding in. Swipe right to escalate, left to keep watching.",
    task: {
      type: 'swipe_cards',
      cards: [
        { id: 'at1', content: 'CO₂ level in Greenhouse A: 1800 ppm — above safe limit', meta: { zone: 'GH-A' } },
        { id: 'at2', content: 'Humidity: 62% — within normal range',                    meta: { zone: 'GH-B' } },
        { id: 'at3', content: 'Water temp: 28°C — too warm for lettuce',               meta: { zone: 'GH-C' } },
        { id: 'at4', content: 'LED cycle: running on schedule',                         meta: { zone: 'GH-D' } },
      ],
      options: [
        { id: 'ao1', label: 'Escalate' },
        { id: 'ao2', label: 'Monitor' },
      ],
    },
  },

  task_http_mapping: {
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

  task_dependency_map: {
    id: 'task_dependency_map',
    text: "The CI migration pipeline is stalled. Tap the task node that has no dependencies — the one that is safe to run first.",
    task: {
      type: 'decision_map',
      nodes: [
        { id: 'dm1', label: 'Deploy',         x: 200, y: 28  },
        { id: 'dm2', label: 'Integration test',x: 95,  y: 115 },
        { id: 'dm3', label: 'Lint & build',   x: 305, y: 115 },
        { id: 'dm4', label: 'Unit tests',     x: 95,  y: 200 },
        { id: 'dm5', label: 'Type-check',     x: 305, y: 200 },
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

  task_led_choice: {
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

  // ── Branch B tasks (6b – 10b) ─────────────────────────────────────────────

  task_water_temp: {
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

  task_harvest_order: {
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

  task_co2_mapping: {
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

  task_alert_swipe: {
    id: 'task_alert_swipe',
    text: "Branch B alert queue: triage each plant-health alert — escalate or keep watching?",
    task: {
      type: 'swipe_cards',
      cards: [
        { id: 'as1', content: 'Root browning detected in tray G-07',        meta: { severity: 'high' } },
        { id: 'as2', content: 'Leaf tip burn: minor, <5% of canopy',         meta: { severity: 'low' } },
        { id: 'as3', content: 'Pythium suspected — zone C-3 quarantine now', meta: { severity: 'critical' } },
        { id: 'as4', content: 'Growth rate 3% below weekly average',          meta: { severity: 'low' } },
      ],
      options: [
        { id: 'op1', label: 'Escalate' },
        { id: 'op2', label: 'Watch' },
      ],
    },
  },

  task_growth_log: {
    id: 'task_growth_log',
    text: "Review the overnight automation log. Click the line that indicates a problem that needs immediate attention tomorrow morning.",
    task: {
      type: 'click_on_line',
      lines: [
        { id: 'gl1', content: '02:00:00 [INFO]  LED cycle started — 18h photoperiod' },
        { id: 'gl2', content: '02:15:33 [INFO]  EC reading: 1.9 mS/cm — within range' },
        { id: 'gl3', content: '03:44:21 [WARN]  Pump C-2: intermittent flow — retrying' },
        { id: 'gl4', content: '03:44:25 [ERROR] Pump C-2: failed after 3 retries — offline', },
        { id: 'gl5', content: '04:00:00 [INFO]  Nightly summary saved to /var/log/growlog' },
      ],
    },
  },
}
