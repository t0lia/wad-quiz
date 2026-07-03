id: java_badge_case_normalization
pool: access_gate_integrity
language: java
bug_class: case-sensitive access value mismatch
mechanic_type: debug_decision
slot_theme_fit: emergency access checks under operational pressure
prompt_surface: four-option incident response
answer_shape: action_id
title: Badge Case Normalization
prompt: The gate reads the emergency badge correctly, but the unlock rule compares
  a mixed-case value against one exact spelling and rejects the pass.
snippet:
- boolean allows(Credential credential) {
- '    String level = credential.getAccessLevel();'
- '    if ("maint_red".equals(level)) {'
- '        return true;'
- '    }'
- '    return credential.hasSupervisorEscort();'
- '}'
actions:
- id: force_gate_release
  text: Bridge the lock manually and deal with the paperwork later
  description: Open the path quickly by overriding the gate instead of trusting the
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
- id: blame_reader
  text: Blame the scanner hardware and retry the badge readout
  description: Spend time at the reader instead of the access rule.
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
- id: relax_gate_rule
  text: Flatten the policy so every emergency badge gets through
  description: Open the path by weakening the rule instead of fixing the comparison.
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
- id: align_access_check
  text: Normalize or compare the badge value the way the gate actually receives it
  description: Fix the check so valid emergency clearance survives harmless case differences.
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
