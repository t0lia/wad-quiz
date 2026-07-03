id: java_emergency_lock_reversal
pool: distributor_lock_order
language: java
bug_class: emergency path lock reversal
mechanic_type: debug_decision
slot_theme_fit: lock-order recovery under final-stage load
prompt_surface: four-option incident response
answer_shape: action_id
title: Emergency Path Lock Reversal
prompt: The rescue path introduced during recovery grabs the same locks in reverse
  order, so nominal and emergency traffic deadlock each other.
snippet:
- void distributeEmergency(Lock main, Lock backup) {
- '    synchronized (backup) {'
- '        synchronized (main) { reroute(main, backup); }'
- '    }'
- '}'
- void restoreNominal(Lock main, Lock backup) {
- '    synchronized (main) {'
- '        synchronized (backup) { reroute(backup, main); }'
- '    }'
- '}'
actions:
- id: blame_deploy
  text: Treat the stall like a bad deployment and redeploy around it
  description: Spend time on packaging instead of the lock rule.
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
  text: Drop one safety lock and trust light traffic
  description: Escape the deadlock by removing protection rather than fixing order.
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
- id: normalize_concurrency_rule
  text: Make both paths acquire their shared locks in the same order
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
  text: Force the core into a narrower fallback execution mode
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
  scores:
    technical_skills: -0.2
    dedication: -0.4
    social_capital: -0.2
