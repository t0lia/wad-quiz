---
id: java_waiver_field_alignment
pool: access_gate_integrity
language: java
bug_class: payload field mismatch
mechanic_type: debug_decision
slot_theme_fit: emergency access checks under operational pressure
prompt_surface: four-option incident response
answer_shape: action_id
---

# Waiver Field Alignment

## Prompt
The gate builds a clearance payload, but the approval flag lands under a field name the unlock logic never reads.

## Snippet
```java
Map<String, Object> buildClearance(Record record) {
    Map<String, Object> payload = new HashMap<>();
    payload.put("level", record.level());
    payload.put("waiverApproved", false);
    if (record.doctorOk()) {
        payload.put("waiver_approved", true);
    }
    return payload;
}
```

## Actions
```yaml
- id: blame_reader
  text: Treat the failure like a scanner problem and retry the hardware path
  description: Spend time on the gate hardware instead of the access check.
- id: relax_gate_rule
  text: Flatten the gate rule so every emergency badge gets through
  description: Open the path by weakening the policy instead of fixing the check.
- id: align_access_check
  text: Write the approval flag where the gate actually reads it
  description: Fix the payload so the valid waiver reaches the unlock logic.
- id: force_gate_release
  text: Force the gate open through a manual bridge
  description: Move forward quickly by overriding the lock instead of trusting the code.
```
