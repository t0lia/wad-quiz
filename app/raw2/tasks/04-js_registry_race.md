---
id: js_registry_race
pool: boot_terminal_concurrency
language: javascript
bug_class: readiness registry race
mechanic_type: debug_decision
slot_theme_fit: boot-time system initialization under pressure
prompt_surface: four-option runtime incident response
answer_shape: action_id
---

# Registry Readiness Race

## Prompt
The unsigned build marks services as running before their async registration finishes, so sector-link reads a healthy dashboard and still fails its first handshake.

## Snippet
```javascript
async function startService(service, registry) {
  registry[service.name] = "running";
  await service.register(registry);
}
async function bootSectorLink(services, registry) {
  services.forEach((service) => startService(service, registry));
  return sectorLink.handshake(registry);
}
```

## Actions
```yaml
- id: blame_controller
  text: Treat the warning panel as a controller problem and restart the room
  description: Ignore the startup race and blame the hardware around it.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: sleep_then_retry
  text: Add a delay and retry once the panel looks calmer
  description: Mask the race with timing instead of waiting for real registration.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: await_service_barrier
  text: Wait for registration to finish before sector-link reads readiness
  description: Put a real barrier between async service registration and the handshake.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: solved_count
    operation: add
    value: 1
  outcome: solved
- id: force_sector_link
  text: Ignore the registry state and force sector-link through
  description: Bring the terminal up fast while accepting a dirty startup state.
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
| blame_controller | -0.6 | -0.2 | -0.1 |
| sleep_then_retry | -0.7 | -0.4 | 0 |
| await_service_barrier | 1 | 0.4 | 0.2 |
| force_sector_link | -0.4 | -0.7 | -0.4 |
