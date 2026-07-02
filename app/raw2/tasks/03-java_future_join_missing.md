---
id: java_future_join_missing
pool: boot_terminal_concurrency
language: java
bug_class: unjoined startup futures
mechanic_type: debug_decision
slot_theme_fit: boot-time system initialization under pressure
prompt_surface: four-option runtime incident response
answer_shape: action_id
---

# Missing Future Join

## Prompt
The experimental build moved startup work into futures, but the terminal still tries to talk to sector-link before those futures finish.

## Snippet
```java
String bootSectorLink(List<Service> services) throws Exception {
    services.forEach(service -> CompletableFuture.runAsync(service::start));
    Link link = sectorLink.handshake().get();
    if (!link.ok()) throw new IllegalStateException("sector-link offline");
    return "ready";
}
```

## Actions
```yaml
- id: await_service_barrier
  text: Join the startup futures before sector-link handshakes
  description: Wait for all startup futures so the dependency chain is actually ready.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: solved_count
    operation: add
    value: 1
  outcome: solved
- id: blame_controller
  text: Reboot the controller rack and treat the symptom as a room failure
  description: Spend time on the wall panel instead of fixing the missing startup
    join.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: sleep_then_retry
  text: Add a retry delay before the handshake call
  description: Hope the futures finish by chance before the next attempt.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: force_sector_link
  text: Bypass readiness checks and bring sector-link up immediately
  description: Force the link to green even though the startup graph is still incomplete.
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
| await_service_barrier | 1 | 0.4 | 0.2 |
| blame_controller | -0.6 | -0.2 | -0.1 |
| sleep_then_retry | -0.7 | -0.4 | 0 |
| force_sector_link | -0.4 | -0.7 | -0.4 |
