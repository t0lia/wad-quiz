id: java_audit_lock_inversion
pool: distributor_lock_order
language: java
bug_class: audit path lock inversion
mechanic_type: debug_decision
slot_theme_fit: lock-order recovery under final-stage load
prompt_surface: four-option incident response
answer_shape: action_id
title: Audit Lock Inversion
prompt: The live repair path locks distributor state one way, but the audit path grabs
  the same locks in reverse order and jams the core under load.
snippet:
- void applySwap(Lock main, Lock audit) {
- '    synchronized (main) {'
- '        synchronized (audit) { commit(main, audit); }'
- '    }'
- '}'
- void auditSwap(Lock main, Lock audit) {
- '    synchronized (audit) {'
- '        synchronized (main) { record(main, audit); }'
- '    }'
- '}'
actions:
- id: normalize_concurrency_rule
  text: Make the audit and live paths acquire shared locks in the same order
  description: Restore one consistent lock rule so the core can run under load.
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
- id: pin_emergency_execution
  text: Pin the core to an emergency path and accept the narrower throughput
  description: Recover quickly by accepting a slower, brittle execution mode.
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
- id: blame_deploy
  text: Treat the stall like packaging fallout and redeploy around it
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
- id: remove_safety_lock
  text: Drop one lock and hope lighter traffic hides the deadlock
  description: Escape the stall by removing protection instead of fixing order.
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
