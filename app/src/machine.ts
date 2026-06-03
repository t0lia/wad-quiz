import { createMachine } from 'xstate'

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
export const hydroMachine = createMachine({
  id: 'hydroFactory',
  initial: 'intro',
  types: {} as {
    events:
      | { type: 'NEXT'; answer?: string }
      | { type: 'SKIP' }
  },
  states: {
    // ── Intro text page ────────────────────────────────────
    intro: { on: { NEXT: 'task_ph' } },

    // ── Shared path (before the git branching) ─────────────
    task_ph:         { on: { NEXT: 'text_to_nutrients' } },
    text_to_nutrients: { on: { NEXT: 'task_nutrients' } },

    task_nutrients:  { on: { NEXT: 'text_to_sensor' } },
    text_to_sensor:  { on: { NEXT: 'task_sensor_log' } },

    task_sensor_log: { on: { NEXT: 'text_to_plants' } },
    text_to_plants:  { on: { NEXT: 'task_plant_sort' } },

    task_plant_sort: { on: { NEXT: 'text_to_git' } },
    text_to_git:     { on: { NEXT: 'task_git' } },

    // ── Git branching task ──────────────────────────────────
    // Condition: first block of the built command must be the word 'git'
    task_git: {
      on: {
        NEXT: [
          {
            guard: ({ event }) =>
              event.answer?.toLowerCase().trim() === 'git',
            target: 'text_git_success',
          },
          { target: 'text_git_hint' },
        ],
      },
    },

    // Hint page loops back to task_git  ← CYCLE in the graph
    text_git_hint: {
      on: {
        NEXT: 'task_git',         // "Try Again" button
        SKIP: 'text_git_partial', // "Continue Anyway" button → Branch B
      },
    },

    // ── Branch A — git command was correct ─────────────────
    text_git_success:   { on: { NEXT: 'task_deploy_order' } },
    task_deploy_order:  { on: { NEXT: 'task_alert_triage' } },
    task_alert_triage:  { on: { NEXT: 'text_a_afternoon' } },
    text_a_afternoon:   { on: { NEXT: 'task_http_mapping' } },
    task_http_mapping:  { on: { NEXT: 'task_dependency_map' } },
    task_dependency_map:{ on: { NEXT: 'text_a_before_final' } },
    text_a_before_final:{ on: { NEXT: 'task_led_choice' } },
    task_led_choice:    { on: { NEXT: 'ending_success' } },

    ending_success: { type: 'final' },

    // ── Branch B — git command was wrong (after hint / skip) ─
    text_git_partial:   { on: { NEXT: 'task_water_temp' } },
    task_water_temp:    { on: { NEXT: 'task_harvest_order' } },
    task_harvest_order: { on: { NEXT: 'text_b_afternoon' } },
    text_b_afternoon:   { on: { NEXT: 'task_co2_mapping' } },
    task_co2_mapping:   { on: { NEXT: 'task_alert_swipe' } },
    task_alert_swipe:   { on: { NEXT: 'text_b_before_final' } },
    text_b_before_final:{ on: { NEXT: 'task_growth_log' } },
    task_growth_log:    { on: { NEXT: 'ending_partial' } },

    ending_partial: { type: 'final' },
  },
})

/** All state IDs that are text-only pages (including endings). */
export const TEXT_STATES = new Set([
  'intro',
  'text_to_nutrients',
  'text_to_sensor',
  'text_to_plants',
  'text_to_git',
  'text_git_hint',
  'text_git_success',
  'text_a_afternoon',
  'text_a_before_final',
  'text_git_partial',
  'text_b_afternoon',
  'text_b_before_final',
  'ending_success',
  'ending_partial',
])
