id: js_beacon_nested_field
pool: drone_profile_payloads
language: javascript
bug_class: nested payload field mismatch
mechanic_type: debug_decision
slot_theme_fit: payload activation for EVA support systems
prompt_surface: four-option incident response
answer_shape: action_id
title: Beacon Nested Field
prompt: The drone reads follow settings from a nested EVA block, but the profile writes
  the beacon flag at the top level where outside mode never looks.
snippet:
- function buildProfile(mode) {
- '  const profile = { mode, eva: { shellMode: false, beaconFollow: false } };'
- '  if (mode === "eva-med") {'
- '    profile.eva.shellMode = true;'
- '    profile.beaconFollow = true;'
- '  }'
- '  return profile;'
- '}'
actions:
- id: blame_hardware
  text: Assume the antenna is drifting and replace external parts first
  description: Spend time on hardware symptoms instead of the profile structure.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
  scores:
    technical_skills: -0.6
    dedication: -0.2
    social_capital: -0.1
- id: force_profile_override
  text: Force the drone into manual chase mode and accept the brittle fallback
  description: Skip the normal checks and rely on a more fragile override.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: override_count
    operation: add
    value: 1
  - flag: debt_count
    operation: add
    value: 1
  outcome: override
  scores:
    technical_skills: -0.4
    dedication: -0.6
    social_capital: -0.4
- id: fake_safe_mode
  text: Keep the wrong payload and add a rough backup behavior around it
  description: Work around the issue instead of fixing the field placement.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
  scores:
    technical_skills: -0.7
    dedication: -0.4
    social_capital: -0.3
- id: align_profile_value
  text: Write the follow flag in the nested EVA field the drone actually reads
  description: Fix the payload shape so outside mode gets both required signals.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: solved_count
    operation: add
    value: 1
  outcome: solved
  scores:
    technical_skills: 1.0
    dedication: 0.4
    social_capital: 0.2
