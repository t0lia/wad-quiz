---
id: java_profile_merge_reset
pool: drone_profile_payloads
language: java
bug_class: default merge overwrites activation field
mechanic_type: debug_decision
slot_theme_fit: payload activation for EVA support systems
prompt_surface: four-option incident response
answer_shape: action_id
---

# Profile Merge Reset

## Prompt
The drone profile sets the EVA flag correctly, then merges defaults afterward and quietly turns the activation field off again.

## Snippet
```java
Map<String, Object> buildProfile(String mode) {
    Map<String, Object> profile = new HashMap<>();
    profile.put("sealedMode", false);
    if ("eva-cargo".equals(mode)) profile.put("sealedMode", true);
    profile.putAll(Map.of("tetherFollow", true, "sealedMode", false));
    return profile;
}
```

## Actions
```yaml
- id: fake_safe_mode
  text: Keep the bad payload and ask the drone to improvise a fallback routine
  description: Push the mission forward without fixing the real activation field.
- id: align_profile_value
  text: Merge defaults without overwriting the EVA activation field
  description: Preserve the value the outside mode actually needs.
- id: force_profile_override
  text: Force a manual backup profile and trust the operator to compensate
  description: Skip the normal profile contract and rely on a brittle override.
- id: blame_hardware
  text: Swap external components first and assume the drone ignored the payload
  description: Spend time on the physical layer instead of the bad profile merge.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| fake_safe_mode | -0.7 | -0.4 | -0.3 |
| align_profile_value | 1 | 0.4 | 0.2 |
| force_profile_override | -0.4 | -0.6 | -0.4 |
| blame_hardware | -0.6 | -0.2 | -0.1 |
