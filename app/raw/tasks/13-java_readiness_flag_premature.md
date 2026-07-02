---
id: java_readiness_flag_premature
pool: boot_terminal_concurrency
language: java
bug_class: premature readiness flag
mechanic_type: debug_decision
slot_theme_fit: boot-time system initialization under pressure
prompt_surface: four-option runtime incident response
answer_shape: action_id
---

# Premature Readiness Flag

## Prompt
The boot controller marks the startup phase ready before the async connector actually finishes registering with sector-link.

## Snippet
```java
CompletableFuture<String> bootSectorLink(Service service, Status status) {
    status.mark("sector-link", "ready");
    return CompletableFuture.runAsync(service::register)
        .thenApply(ignored -> sectorLink.handshake(status))
        .thenApply(link -> {
            if (!link.ok()) throw new IllegalStateException("sector-link offline");
            return "ready";
        });
}
```

## Actions
```yaml
- id: sleep_then_retry
  text: Wait a few seconds and retry after the dashboard looks calmer
  description: Add timing luck instead of fixing the readiness lie.
- id: force_sector_link
  text: Force sector-link online and trust the green light anyway
  description: Skip the safety checks and accept a dirty startup state.
- id: blame_controller
  text: Restart the controller room and assume the rack is slow again
  description: Treat the symptom like hardware trouble outside the code path.
- id: await_service_barrier
  text: Mark readiness only after registration finishes and then handshake
  description: Put the readiness signal behind the async registration barrier.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| sleep_then_retry | -0.7 | -0.4 | 0 |
| force_sector_link | -0.4 | -0.7 | -0.4 |
| blame_controller | -0.6 | -0.2 | -0.1 |
| await_service_barrier | 1 | 0.4 | 0.2 |
