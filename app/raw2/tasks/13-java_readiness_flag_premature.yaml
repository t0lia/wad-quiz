id: java_readiness_flag_premature
pool: boot_terminal_concurrency
language: java
bug_class: premature readiness flag
mechanic_type: debug_decision
slot_theme_fit: boot-time system initialization under pressure
prompt_surface: four-option runtime incident response
answer_shape: action_id
title: Premature Readiness Flag
prompt: The boot controller marks the startup phase ready before the async connector
  actually finishes registering with sector-link.
snippet:
- CompletableFuture<String> bootSectorLink(Service service, Status status) {
- '    status.mark("sector-link", "ready");'
- '    return CompletableFuture.runAsync(service::register)'
- '        .thenApply(ignored -> sectorLink.handshake(status))'
- '        .thenApply(link -> {'
- '            if (!link.ok()) throw new IllegalStateException("sector-link offline");'
- '            return "ready";'
- '        });'
- '}'
actions:
- id: sleep_then_retry
  text: Wait a few seconds and retry after the dashboard looks calmer
  description: Add timing luck instead of fixing the readiness lie.
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
  text: Mark readiness only after registration finishes and then handshake
  description: Put the readiness signal behind the async registration barrier.
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
  text: Force sector-link online and trust the green light anyway
  description: Skip the safety checks and accept a dirty startup state.
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
- id: blame_controller
  text: Restart the controller room and assume the rack is slow again
  description: Treat the symptom like hardware trouble outside the code path.
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
