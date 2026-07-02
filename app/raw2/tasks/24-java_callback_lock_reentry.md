---
id: java_callback_lock_reentry
pool: distributor_lock_order
language: java
bug_class: callback path lock reversal
mechanic_type: debug_decision
slot_theme_fit: lock-order recovery under final-stage load
prompt_surface: four-option incident response
answer_shape: action_id
---

# Callback Lock Reentry

## Prompt
The distributor stabilizer locks the main path first, but its recovery callback reenters through the backup lock and deadlocks whenever both flows overlap.

## Snippet
```java
void stabilize(Lock main, Lock backup) {
    synchronized (main) {
        synchronized (backup) { syncState(); }
    }
}
void onRecovery(Lock main, Lock backup) {
    synchronized (backup) {
        synchronized (main) { syncState(); }
    }
}
```

## Actions
```yaml
- id: remove_safety_lock
  text: Strip one lock and trust the overlap never gets ugly
  description: Escape the deadlock by removing protection rather than fixing order.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: pin_emergency_execution
  text: Force the distributor into an emergency single-lane mode
  description: Recover power quickly by accepting a slower, brittle path.
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
- id: normalize_concurrency_rule
  text: Keep the callback and primary path on one shared lock order
  description: Restore one consistent acquisition rule so the core can survive overlap.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: solved_count
    operation: add
    value: 1
  outcome: solved
- id: blame_deploy
  text: Call it a deployment issue and redeploy around the stall
  description: Spend time on packaging symptoms instead of the lock inversion.
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
| remove_safety_lock | -0.9 | -0.6 | -0.5 |
| pin_emergency_execution | -0.2 | -0.4 | -0.2 |
| normalize_concurrency_rule | 1 | 0.4 | 0.2 |
| blame_deploy | -0.6 | -0.2 | -0.1 |
