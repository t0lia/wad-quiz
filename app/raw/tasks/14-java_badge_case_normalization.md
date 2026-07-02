---
id: java_badge_case_normalization
pool: access_gate_integrity
language: java
bug_class: case-sensitive access value mismatch
mechanic_type: debug_decision
slot_theme_fit: emergency access checks under operational pressure
prompt_surface: four-option incident response
answer_shape: action_id
---

# Badge Case Normalization

## Prompt
The gate reads the emergency badge correctly, but the unlock rule compares a mixed-case value against one exact spelling and rejects the pass.

## Snippet
```java
boolean allows(Credential credential) {
    String level = credential.getAccessLevel();
    if ("maint_red".equals(level)) {
        return true;
    }
    return credential.hasSupervisorEscort();
}
```

## Actions
```yaml
- id: force_gate_release
  text: Bridge the lock manually and deal with the paperwork later
  description: Open the path quickly by overriding the gate instead of trusting the code.
- id: align_access_check
  text: Normalize or compare the badge value the way the gate actually receives it
  description: Fix the check so valid emergency clearance survives harmless case differences.
- id: blame_reader
  text: Blame the scanner hardware and retry the badge readout
  description: Spend time at the reader instead of the access rule.
- id: relax_gate_rule
  text: Flatten the policy so every emergency badge gets through
  description: Open the path by weakening the rule instead of fixing the comparison.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| force_gate_release | -0.4 | -0.6 | -0.3 |
| align_access_check | 1 | 0.4 | 0.2 |
| blame_reader | -0.6 | -0.2 | -0.1 |
| relax_gate_rule | -0.7 | -0.5 | -0.4 |
