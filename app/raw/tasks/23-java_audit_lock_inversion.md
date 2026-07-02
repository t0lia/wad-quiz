---
id: java_audit_lock_inversion
pool: distributor_lock_order
language: java
bug_class: audit path lock inversion
mechanic_type: debug_decision
slot_theme_fit: lock-order recovery under final-stage load
prompt_surface: four-option incident response
answer_shape: action_id
---

# Audit Lock Inversion

## Prompt
The live repair path locks distributor state one way, but the audit path grabs the same locks in reverse order and jams the core under load.

## Snippet
```java
void applySwap(Lock main, Lock audit) {
    synchronized (main) {
        synchronized (audit) { commit(main, audit); }
    }
}
void auditSwap(Lock main, Lock audit) {
    synchronized (audit) {
        synchronized (main) { record(main, audit); }
    }
}
```

## Actions
```yaml
- id: normalize_concurrency_rule
  text: Make the audit and live paths acquire shared locks in the same order
  description: Restore one consistent lock rule so the core can run under load.
- id: pin_emergency_execution
  text: Pin the core to an emergency path and accept the narrower throughput
  description: Recover quickly by accepting a slower, brittle execution mode.
- id: blame_deploy
  text: Treat the stall like packaging fallout and redeploy around it
  description: Spend time on release symptoms instead of the lock rule.
- id: remove_safety_lock
  text: Drop one lock and hope lighter traffic hides the deadlock
  description: Escape the stall by removing protection instead of fixing order.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| normalize_concurrency_rule | 1 | 0.4 | 0.2 |
| pin_emergency_execution | -0.2 | -0.4 | -0.2 |
| blame_deploy | -0.6 | -0.2 | -0.1 |
| remove_safety_lock | -0.9 | -0.6 | -0.5 |
