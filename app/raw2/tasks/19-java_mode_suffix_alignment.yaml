id: java_mode_suffix_alignment
pool: drone_profile_payloads
language: java
bug_class: mode suffix mismatch
mechanic_type: debug_decision
slot_theme_fit: payload activation for EVA support systems
prompt_surface: four-option incident response
answer_shape: action_id
title: Mode Suffix Alignment
prompt: The drone only enables protected outside behavior for one exact EVA mode name,
  but the profile builder sends a shortened value and never trips the activation field.
snippet:
- Map<String, Object> buildProfile(String mode) {
- '    Map<String, Object> payload = new HashMap<>();'
- '    payload.put("mode", mode);'
- '    payload.put("shellMode", false);'
- '    if ("eva".equals(mode)) {'
- '        payload.put("shellMode", true);'
- '    }'
- '    return payload;'
- '}'
actions:
- id: align_profile_value
  text: Send the exact EVA mode value the activation rule expects
  description: Align the mode name so the outside protection field turns on correctly.
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
  text: Override the whole profile and rely on manual outside handling
  description: Skip the normal contract and accept a brittle fallback.
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
  text: Keep the short mode name and compensate with a rough backup routine
  description: Push forward without fixing the actual profile mismatch.
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
- id: blame_hardware
  text: Treat the failure like payload corruption on the drone itself
  description: Spend time on the physical layer instead of the wrong mode value.
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
