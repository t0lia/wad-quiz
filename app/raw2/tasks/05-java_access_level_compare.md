id: java_access_level_compare
pool: access_gate_integrity
language: java
bug_class: reference-vs-value access check
mechanic_type: debug_decision
slot_theme_fit: emergency access checks under operational pressure
prompt_surface: four-option incident response
answer_shape: action_id
title: Access Level Comparison
prompt: The gate reads a temporary access level, but the unlock path checks it the
  wrong way and rejects a valid emergency pass.
snippet:
- boolean gateAllows(Credential credential) {
- '    String level = credential.getAccessLevel();'
- '    if (level == "MAINT_RED") {'
- '        return true;'
- '    }'
- '    return credential.hasSupervisorEscort();'
- '}'
actions:
- id: blame_reader
  text: Treat the failure like a scanner problem and retry the hardware path
  description: Spend time on the gate hardware instead of the access check.
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
- id: align_access_check
  text: Compare the access value the way the gate actually needs
  description: Fix the comparison so valid temporary clearance is recognized.
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
  text: Flatten the gate rule so every emergency badge gets through
  description: Open the path by weakening the policy instead of fixing the check.
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
- id: force_gate_release
  text: Force the gate open through a manual bridge
  description: Move forward quickly by overriding the lock instead of trusting the
    code.
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
