---
id: java_shell_field_alignment
pool: drone_profile_payloads
language: java
bug_class: payload field mismatch
mechanic_type: debug_decision
slot_theme_fit: payload activation for EVA support systems
prompt_surface: four-option incident response
answer_shape: action_id
---

# Shell Field Alignment

## Prompt
The drone receives the EVA profile, but the field that should enable protected outside mode is written under the wrong name.

## Snippet
```java
Map<String, Object> buildShellProfile(String mode) {
    Map<String, Object> payload = new HashMap<>();
    payload.put("mode", mode);
    payload.put("sterileMode", false);
    payload.put("beaconFollow", false);
    if ("eva-med".equals(mode)) {
        payload.put("sterile_mode", true);
        payload.put("beaconFollow", true);
    }
    return payload;
}
```

## Actions
```yaml
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
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| blame_hardware | -0.6 | -0.2 | -0.1 |
| fake_safe_mode | -0.7 | -0.4 | -0.3 |
| align_profile_value | 1 | 0.4 | 0.2 |
| force_profile_override | -0.4 | -0.6 | -0.4 |
