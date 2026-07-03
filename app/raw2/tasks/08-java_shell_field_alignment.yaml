id: java_shell_field_alignment
pool: drone_profile_payloads
language: java
bug_class: payload field mismatch
mechanic_type: debug_decision
slot_theme_fit: payload activation for EVA support systems
prompt_surface: four-option incident response
answer_shape: action_id
title: Shell Field Alignment
prompt: The drone receives the EVA profile, but the field that should enable protected
  outside mode is written under the wrong name.
snippet:
- Map<String, Object> buildShellProfile(String mode) {
- '    Map<String, Object> payload = new HashMap<>();'
- '    payload.put("mode", mode);'
- '    payload.put("sterileMode", false);'
- '    payload.put("beaconFollow", false);'
- '    if ("eva-med".equals(mode)) {'
- '        payload.put("sterile_mode", true);'
- '        payload.put("beaconFollow", true);'
- '    }'
- '    return payload;'
- '}'
actions:
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
- id: align_profile_value
  text: Write the activation field the way the drone actually reads it
  description: Fix the payload so the protected mode can turn on correctly.
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
