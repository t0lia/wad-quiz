id: java_waiver_field_alignment
pool: access_gate_integrity
language: java
bug_class: payload field mismatch
mechanic_type: debug_decision
slot_theme_fit: emergency access checks under operational pressure
prompt_surface: four-option incident response
answer_shape: action_id
title: Waiver Field Alignment
prompt: The gate builds a clearance payload, but the approval flag lands under a field
  name the unlock logic never reads.
snippet:
- Map<String, Object> buildClearance(Record record) {
- '    Map<String, Object> payload = new HashMap<>();'
- '    payload.put("level", record.level());'
- '    payload.put("waiverApproved", false);'
- '    if (record.doctorOk()) {'
- '        payload.put("waiver_approved", true);'
- '    }'
- '    return payload;'
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
- id: align_access_check
  text: Write the approval flag where the gate actually reads it
  description: Fix the payload so the valid waiver reaches the unlock logic.
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
