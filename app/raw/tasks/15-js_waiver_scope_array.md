---
id: js_waiver_scope_array
pool: access_gate_integrity
language: javascript
bug_class: array-vs-string scope check
mechanic_type: debug_decision
slot_theme_fit: emergency access checks under operational pressure
prompt_surface: four-option incident response
answer_shape: action_id
---

# Waiver Scope Array

## Prompt
The gate receives a waiver with multiple approved areas, but the unlock check treats the whole list like one exact string and denies the corridor.

## Snippet
```javascript
function canOpen(record) {
  const scopes = record.waiverScopes;
  if (scopes === "quarantine-side") {
    return true;
  }
  return record.hasEscort === true;
}
```

## Actions
```yaml
- id: align_access_check
  text: Check the waiver scopes in the structure the gate actually receives
  description: Read the approved scope list correctly so the valid waiver is recognized.
- id: relax_gate_rule
  text: Bypass the scope list and approve every waived record
  description: Open the path by weakening the policy instead of fixing the scope check.
- id: blame_reader
  text: Retry the scanner because the badge payload probably arrived corrupted
  description: Treat the symptom as hardware noise instead of a logic mismatch.
- id: force_gate_release
  text: Force the side gate open through the maintenance bridge
  description: Move forward quickly by overriding the lock instead of trusting the code.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| align_access_check | 1 | 0.4 | 0.2 |
| relax_gate_rule | -0.7 | -0.5 | -0.4 |
| blame_reader | -0.6 | -0.2 | -0.1 |
| force_gate_release | -0.4 | -0.6 | -0.3 |
