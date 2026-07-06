id: java_batch_commit_lock_order
pool: distributor_lock_order
language: java
bug_class: batch commit lock order mismatch
mechanic_type: debug_decision
slot_theme_fit: lock-order recovery under final-stage load
prompt_surface: four-option incident response
answer_shape: action_id
title: Batch Commit Lock Order
prompt: The power batch commit path takes the staging and live locks in one order,
  while rollback reaches for them in reverse and freezes both flows.
snippet:
- void commitBatch(Lock live, Lock staging) {
- '    synchronized (live) {'
- '        synchronized (staging) { applyBatch(); }'
- '    }'
- '}'
- void rollbackBatch(Lock live, Lock staging) {
- '    synchronized (staging) {'
- '        synchronized (live) { cancelBatch(); }'
- '    }'
- '}'
actions:
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
  scores:
    technical_skills: -0.6
    dedication: -0.2
    social_capital: -0.1
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
  scores:
    technical_skills: 1.0
    dedication: 0.4
    social_capital: 0.2
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
  scores:
    technical_skills: -0.9
    dedication: -0.6
    social_capital: -0.5
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
  scores:
    technical_skills: -0.2
    dedication: -0.4
    social_capital: -0.2
