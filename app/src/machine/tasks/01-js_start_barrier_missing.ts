import { createChoiceTaskState } from './_createChoiceTask'

export function jsStartBarrierMissingTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Sector Link Race Condition\n\n' +
      'Even the standard build carries one rushed startup module from the latest station-wide update. The race is less flashy, but no less real.\n\n' +
      '```javascript\n' +
      'async function bootSectorLink(services) {\n' +
      '  services.map((service) => service.start());\n' +
      '  const link = await sectorLink.handshake();\n' +
      '  if (!link.ok) throw new Error("sector-link offline");\n' +
      '  return "ready";\n' +
      '}\n' +
      '```\n\n' +
      'How should Alex fix this?',
    options: [
      {
        id: 'blame_controller',
        content: 'Blame the controller rack and restart it from the wall panel',
        description: 'Blame the controller rack and restart it from the wall panel',
        metrics: { tek: 0, ded: 0, soc: 0 },
      },
      {
        id: 'sleep_then_retry',
        content: 'Add a fixed delay before the handshake',
        description: 'Add a fixed delay before the handshake',
        metrics: { tek: 0, ded: 1, soc: 0 },
      },
      {
        id: 'await_service_barrier',
        content: 'Wait for all service startups before sector-link handshakes',
        description: 'Wait for all service startups before sector-link handshakes',
        metrics: { tek: 1, ded: 1, soc: 1 },
      },
      {
        id: 'force_sector_link',
        content: 'Override startup checks and force sector-link online',
        description: 'Override startup checks and force sector-link online',
        metrics: { tek: 0, ded: 1, soc: 0 },
      },
    ],
    correctAnswer: 'await_service_barrier',
    overrideAnswer: 'force_sector_link',
    resultFlag: 'problem_2_result',
  })
}