id: js_clamp_boolean_payload
pool: drone_profile_payloads
language: javascript
bug_class: string-vs-boolean payload value
mechanic_type: debug_decision
slot_theme_fit: payload activation for EVA support systems
prompt_surface: four-option incident response
answer_shape: action_id
title: Clamp Boolean Payload
prompt: The drone accepts the profile message, but one activation field is sent in
  the wrong data type so the outside mode never really turns on.
snippet:
- function buildClampProfile(mode) {
- '  const profile = { mode, magClamp: false, tetherFollow: false };'
- '  if (mode === "hull") {'
- '    profile.magClamp = "true";'
- '    profile.tetherFollow = true;'
- '  }'
- '  return deployProfile(profile);'
- '}'
actions:
- id: align_profile_value
  text: Send the activation value in the format the drone actually expects
  description: Fix the payload so the outside mode can turn on properly.
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
- id: blame_hardware
  text: Treat the failure like hardware drift and swap components first
  description: Spend time on the physical layer instead of the bad payload.
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
- id: fake_safe_mode
  text: Work around the setting with a rough fallback behavior
  description: Push the drone forward without fixing the real activation field.
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
- id: force_profile_override
  text: Override the profile and force a manual backup mode
  description: Skip the normal checks and rely on a more brittle fallback.
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
