id: js_registry_race
pool: boot_terminal_concurrency
language: javascript
bug_class: readiness registry race
mechanic_type: debug_decision
slot_theme_fit: boot-time system initialization under pressure
prompt_surface: four-option runtime incident response
answer_shape: action_id
title: Registry Readiness Race
prompt: The unsigned build marks services as running before their async registration
  finishes, so sector-link reads a healthy dashboard and still fails its first handshake.
snippet:
- async function startService(service, registry) {
- '  registry[service.name] = "running";'
- '  await service.register(registry);'
- '}'
- async function bootSectorLink(services, registry) {
- '  services.forEach((service) => startService(service, registry));'
- '  return sectorLink.handshake(registry);'
- '}'
actions:
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
  scores:
    technical_skills: -0.6
    dedication: -0.2
    social_capital: -0.1
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
  scores:
    technical_skills: -0.7
    dedication: -0.4
    social_capital: 0.0
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
  scores:
    technical_skills: 1.0
    dedication: 0.4
    social_capital: 0.2
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
  scores:
    technical_skills: -0.4
    dedication: -0.7
    social_capital: -0.4
