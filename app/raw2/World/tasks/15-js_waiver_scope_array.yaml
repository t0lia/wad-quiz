id: js_waiver_scope_array
pool: access_gate_integrity
language: javascript
bug_class: array-vs-string scope check
mechanic_type: debug_decision
slot_theme_fit: emergency access checks under operational pressure
prompt_surface: four-option incident response
answer_shape: action_id
title: Waiver Scope Array
prompt: The gate receives a waiver with multiple approved areas, but the unlock check
  treats the whole list like one exact string and denies the corridor.
snippet:
- function canOpen(record) {
- '  const scopes = record.waiverScopes;'
- '  if (scopes === "quarantine-side") {'
- '    return true;'
- '  }'
- '  return record.hasEscort === true;'
- '}'
actions:
- id: align_access_check
  text: Check the waiver scopes in the structure the gate actually receives
  description: Read the approved scope list correctly so the valid waiver is recognized.
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
  text: Bypass the scope list and approve every waived record
  description: Open the path by weakening the policy instead of fixing the scope check.
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
- id: blame_reader
  text: Retry the scanner because the badge payload probably arrived corrupted
  description: Treat the symptom as hardware noise instead of a logic mismatch.
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
  text: Force the side gate open through the maintenance bridge
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
