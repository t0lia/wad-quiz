id: java_profile_merge_reset
pool: drone_profile_payloads
language: java
bug_class: default merge overwrites activation field
mechanic_type: debug_decision
slot_theme_fit: payload activation for EVA support systems
prompt_surface: four-option incident response
answer_shape: action_id
title: Profile Merge Reset
prompt: The drone profile sets the EVA flag correctly, then merges defaults afterward
  and quietly turns the activation field off again.
snippet:
- Map<String, Object> buildProfile(String mode) {
- '    Map<String, Object> profile = new HashMap<>();'
- '    profile.put("sealedMode", false);'
- '    if ("eva-cargo".equals(mode)) profile.put("sealedMode", true);'
- '    profile.putAll(Map.of("tetherFollow", true, "sealedMode", false));'
- '    return profile;'
- '}'
actions:
- id: fake_safe_mode
  text: Keep the bad payload and ask the drone to improvise a fallback routine
  description: Push the mission forward without fixing the real activation field.
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
  text: Merge defaults without overwriting the EVA activation field
  description: Preserve the value the outside mode actually needs.
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
  text: Force a manual backup profile and trust the operator to compensate
  description: Skip the normal profile contract and rely on a brittle override.
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
- id: blame_hardware
  text: Swap external components first and assume the drone ignored the payload
  description: Spend time on the physical layer instead of the bad profile merge.
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
