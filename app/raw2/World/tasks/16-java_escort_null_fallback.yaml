id: java_escort_null_fallback
pool: access_gate_integrity
language: java
bug_class: null escort flag fallback
mechanic_type: debug_decision
slot_theme_fit: emergency access checks under operational pressure
prompt_surface: four-option incident response
answer_shape: action_id
title: Escort Null Fallback
prompt: The gate falls back to supervisor escort when emergency clearance is absent,
  but the escort flag can be null and the rule trips over it instead of using the
  valid access data.
snippet:
- boolean allows(Credential credential) {
- '    String level = credential.getAccessLevel();'
- '    Boolean escort = credential.getSupervisorEscort();'
- '    if ("MAINT_RED".equals(level)) return true;'
- '    return escort.equals(true);'
- '}'
actions:
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
  scores:
    technical_skills: -0.6
    dedication: -0.2
    social_capital: -0.1
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
  scores:
    technical_skills: -0.4
    dedication: -0.6
    social_capital: -0.3
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
  scores:
    technical_skills: 1.0
    dedication: 0.4
    social_capital: 0.2
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
  scores:
    technical_skills: -0.7
    dedication: -0.5
    social_capital: -0.4
