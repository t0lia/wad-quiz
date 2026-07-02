import { createChoiceTaskState } from './_createChoiceTask'

export function pyReadinessGatherMissingTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Missing Gather Barrier\n\n' +
      'The same startup race shows up in a different language, but the fix is still about waiting for readiness instead of guessing.\n\n' +
      '```python\n' +
      'async def boot_sector_link(services):\n' +
      '    tasks = [asyncio.create_task(service.start()) for service in services]\n' +
      '    link = await sector_link.handshake()\n' +
      '    if not link.ok:\n' +
      '        raise RuntimeError("sector-link offline")\n' +
      '    return "ready"\n' +
      '```\n\n' +
      'How should Alex fix this?',
    options: [
      {
        id: 'blame_controller',
        content: 'Blame the controller rack and restart it from the wall panel',
        description: 'Blame the controller rack and restart it from the wall panel',
      },
      {
        id: 'sleep_then_retry',
        content: 'Add a fixed delay before the handshake',
        description: 'Add a fixed delay before the handshake',
      },
      {
        id: 'await_service_barrier',
        content: 'Await the startup tasks before the handshake begins',
        description: 'Await the startup tasks before the handshake begins',
      },
      {
        id: 'force_sector_link',
        content: 'Force sector-link up even if the startup tasks are still racing',
        description: 'Force sector-link up even if the startup tasks are still racing',
      },
    ],
    correctAnswer: 'await_service_barrier',
    overrideAnswer: 'force_sector_link',
    resultFlag: 'problem_2_result',
  })
}