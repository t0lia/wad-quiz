---
id: java_mode_suffix_alignment
pool: drone_profile_payloads
language: java
bug_class: mode suffix mismatch
mechanic_type: debug_decision
slot_theme_fit: payload activation for EVA support systems
prompt_surface: four-option incident response
answer_shape: action_id
---

# Mode Suffix Alignment

## Prompt
The drone only enables protected outside behavior for one exact EVA mode name, but the profile builder sends a shortened value and never trips the activation field.

## Snippet
```java
Map<String, Object> buildProfile(String mode) {
    Map<String, Object> payload = new HashMap<>();
    payload.put("mode", mode);
    payload.put("shellMode", false);
    if ("eva".equals(mode)) {
        payload.put("shellMode", true);
    }
    return payload;
}
```

## Actions
```yaml
- id: force_profile_override
  text: Override the whole profile and rely on manual outside handling
  description: Skip the normal contract and accept a brittle fallback.
- id: fake_safe_mode
  text: Keep the short mode name and compensate with a rough backup routine
  description: Push forward without fixing the actual profile mismatch.
- id: blame_hardware
  text: Treat the failure like payload corruption on the drone itself
  description: Spend time on the physical layer instead of the wrong mode value.
- id: align_profile_value
  text: Send the exact EVA mode value the activation rule expects
  description: Align the mode name so the outside protection field turns on correctly.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| force_profile_override | -0.4 | -0.6 | -0.4 |
| fake_safe_mode | -0.7 | -0.4 | -0.3 |
| blame_hardware | -0.6 | -0.2 | -0.1 |
| align_profile_value | 1 | 0.4 | 0.2 |
