---
id: java_lock_order_deadlock
pool: distributor_lock_order
language: java
bug_class: inconsistent lock acquisition order
mechanic_type: debug_decision
slot_theme_fit: lock-order recovery under final-stage load
prompt_surface: four-option incident response
answer_shape: action_id
---

# Lock Order Deadlock

## Prompt
Two recovery paths take the same resources in opposite order, so the core stalls as soon as they overlap under load.

## Snippet
```java
void distributePower(Lock main, Lock backup) {
    synchronized (main) {
        synchronized (backup) { reroute(main, backup); }
    }
}
void restorePower(Lock main, Lock backup) {
    synchronized (backup) {
        synchronized (main) { reroute(backup, main); }
    }
}
```

## Actions
```yaml
- id: blame_deploy
  text: Treat the stall like a bad deployment and redeploy around it
  description: Spend time on packaging instead of the lock rule.
- id: remove_safety_lock
  text: Drop one safety lock and trust light traffic
  description: Escape the deadlock by removing protection rather than fixing order.
- id: normalize_concurrency_rule
  text: Make both paths acquire their shared locks in the same order
  description: Restore one consistent lock rule so the core can run under load.
- id: pin_emergency_execution
  text: Force the core into a narrower fallback execution mode
  description: Recover power quickly by accepting a slower, brittle path.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| blame_deploy | -0.6 | -0.2 | -0.1 |
| remove_safety_lock | -0.9 | -0.6 | -0.5 |
| normalize_concurrency_rule | 1 | 0.4 | 0.2 |
| pin_emergency_execution | -0.2 | -0.4 | -0.2 |
