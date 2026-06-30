---
id: js_clamp_boolean_payload
pool: drone_profile_payloads
language: javascript
bug_class: string-vs-boolean payload value
mechanic_type: debug_decision
slot_theme_fit: payload activation for EVA support systems
prompt_surface: four-option incident response
answer_shape: action_id
---

# Clamp Boolean Payload

## Prompt
The drone accepts the profile message, but one activation field is sent in the wrong data type so the outside mode never really turns on.

## Snippet
```javascript
function buildClampProfile(mode) {
  const profile = { mode, magClamp: false, tetherFollow: false };
  if (mode === "hull") {
    profile.magClamp = "true";
    profile.tetherFollow = true;
  }
  return deployProfile(profile);
}
```

## Actions
```yaml
- id: blame_hardware
  text: Treat the failure like hardware drift and swap components first
  description: Spend time on the physical layer instead of the bad payload.
- id: fake_safe_mode
  text: Work around the setting with a rough fallback behavior
  description: Push the drone forward without fixing the real activation field.
- id: align_profile_value
  text: Send the activation value in the format the drone actually expects
  description: Fix the payload so the outside mode can turn on properly.
- id: force_profile_override
  text: Override the profile and force a manual backup mode
  description: Skip the normal checks and rely on a more brittle fallback.
```
