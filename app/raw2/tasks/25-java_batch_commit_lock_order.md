---
id: java_batch_commit_lock_order
pool: distributor_lock_order
language: java
bug_class: batch commit lock order mismatch
mechanic_type: debug_decision
slot_theme_fit: lock-order recovery under final-stage load
prompt_surface: four-option incident response
answer_shape: action_id
---

# Batch Commit Lock Order

## Prompt
The power batch commit path takes the staging and live locks in one order, while rollback reaches for them in reverse and freezes both flows.

## Snippet
```java
void commitBatch(Lock live, Lock staging) {
    synchronized (live) {
        synchronized (staging) { applyBatch(); }
    }
}
void rollbackBatch(Lock live, Lock staging) {
    synchronized (staging) {
        synchronized (live) { cancelBatch(); }
    }
}
```

## Actions
```yaml
- id: blame_deploy
  text: Assume the batch freeze came from a bad rollout and redeploy around it
  description: Spend time on release symptoms instead of the lock rule.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: normalize_concurrency_rule
  text: Make commit and rollback acquire their shared locks in the same order
  description: Restore one consistent lock rule so batch recovery can complete under
    load.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: solved_count
    operation: add
    value: 1
  outcome: solved
- id: remove_safety_lock
  text: Drop one lock and pray the batch traffic stays polite
  description: Escape the stall by removing protection rather than fixing order.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: pin_emergency_execution
  text: Pin the distributor to the emergency lane and accept the compromise
  description: Recover quickly by relying on a narrower, brittle mode.
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
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| blame_deploy | -0.6 | -0.2 | -0.1 |
| normalize_concurrency_rule | 1 | 0.4 | 0.2 |
| remove_safety_lock | -0.9 | -0.6 | -0.5 |
| pin_emergency_execution | -0.2 | -0.4 | -0.2 |
