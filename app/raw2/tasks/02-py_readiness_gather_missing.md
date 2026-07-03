id: py_readiness_gather_missing
pool: boot_terminal_concurrency
language: python
bug_class: fire-and-forget startup tasks
mechanic_type: debug_decision
slot_theme_fit: boot-time system initialization under pressure
prompt_surface: four-option runtime incident response
answer_shape: action_id
title: Missing Gather Barrier
prompt: The new boot path fans out startup coroutines and then asks sector-link for
  a handshake before the dependency warmup finishes.
snippet:
- 'async def boot_sector_link(services):'
- '    tasks = [asyncio.create_task(service.start()) for service in services]'
- '    link = await sector_link.handshake()'
- '    if not link.ok:'
- '        raise RuntimeError("sector-link offline")'
- '    return "ready"'
actions:
- id: blame_controller
  text: Reset the controller room and assume the rack is stuck again
  description: Treat the failure as hardware noise instead of a startup ordering bug.
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
  text: Sleep for a few seconds and try the handshake again
  description: Add timing luck instead of a real readiness condition.
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
  text: Force sector-link up even if the startup tasks are still racing
  description: Push the link online and accept that the boot sequence is now lying.
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
- id: await_service_barrier
  text: Await the startup tasks before the handshake begins
  description: Gather the service tasks and let sector-link start only after they
    report ready.
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
