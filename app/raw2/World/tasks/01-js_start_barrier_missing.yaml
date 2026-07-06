id: js_start_barrier_missing
pool: boot_terminal_concurrency
language: javascript
bug_class: missing startup barrier
mechanic_type: debug_decision
slot_theme_fit: boot-time system initialization under pressure
prompt_surface: four-option runtime incident response
answer_shape: action_id
title: Missing Startup Barrier
prompt: The experimental build is lightning fast because it starts services in parallel.
  One dependency reaches for sector-link before the rest of startup is actually ready.
snippet:
- async function bootSectorLink(services) {
- '  services.map((service) => service.start());'
- '  const link = await sectorLink.handshake();'
- '  if (!link.ok) throw new Error("sector-link offline");'
- '  return "ready";'
- '}'
actions:
- id: blame_controller
  text: Blame the controller rack and restart it from the wall panel
  description: Treat the issue as external hardware trouble and reset the room.
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
- id: await_service_barrier
  text: Wait for all service startups before sector-link handshakes
  description: Hold the handshake until the dependency chain reports ready.
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
- id: sleep_then_retry
  text: Add a fixed delay before the handshake
  description: Wait a few seconds and hope the service chain happens to finish in
    time.
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
- id: force_sector_link
  text: Override startup checks and force sector-link online
  description: Skip the safety barrier and bring the link up dirty but fast.
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
