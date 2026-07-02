---
id: java_escort_null_fallback
pool: access_gate_integrity
language: java
bug_class: null escort flag fallback
mechanic_type: debug_decision
slot_theme_fit: emergency access checks under operational pressure
prompt_surface: four-option incident response
answer_shape: action_id
---

# Escort Null Fallback

## Prompt
The gate falls back to supervisor escort when emergency clearance is absent, but the escort flag can be null and the rule trips over it instead of using the valid access data.

## Snippet
```java
boolean allows(Credential credential) {
    String level = credential.getAccessLevel();
    Boolean escort = credential.getSupervisorEscort();
    if ("MAINT_RED".equals(level)) return true;
    return escort.equals(true);
}
```

## Actions
```yaml
- id: blame_reader
  text: Treat the error like another scanner hiccup and rescan the badge
  description: Spend time on hardware symptoms instead of the access rule.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: force_gate_release
  text: Trigger the manual release and ignore the inconsistent record
  description: Open the path quickly by overriding the gate instead of fixing the
    check.
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
- id: align_access_check
  text: Handle the escort fallback safely and keep the intended access comparison
  description: Make the rule match the real record shape without flattening the policy.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: solved_count
    operation: add
    value: 1
  outcome: solved
- id: relax_gate_rule
  text: Remove the escort fallback so the gate never blocks emergency traffic
  description: Weaken the policy instead of handling the nullable field safely.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| blame_reader | -0.6 | -0.2 | -0.1 |
| force_gate_release | -0.4 | -0.6 | -0.3 |
| align_access_check | 1 | 0.4 | 0.2 |
| relax_gate_rule | -0.7 | -0.5 | -0.4 |
