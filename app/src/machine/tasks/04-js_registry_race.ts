import { createChoiceTaskState } from './_createChoiceTask'

export function jsRegistryRaceTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Registry Readiness Race\n\n' +
      'The unsigned build marks services as running before their async registration finishes, so sector-link sees a healthy dashboard and still fails its first handshake.\n\n' +
      '```javascript\n' +
      'async function startService(service, registry) {\n' +
      '  registry[service.name] = "running";\n' +
      '  await service.register(registry);\n' +
      '}\n' +
      'async function bootSectorLink(services, registry) {\n' +
      '  services.forEach((service) => startService(service, registry));\n' +
      '  return sectorLink.handshake(registry);\n' +
      '}\n' +
      '```\n\n' +
      'How should Alex fix this?',
    options: [
      {
        id: 'blame_controller',
        content: 'Treat the warning panel as a controller problem and restart the room',
        description: 'Treat the warning panel as a controller problem and restart the room',
        metrics: { tek: 0, ded: 0, soc: 0 },
      },
      {
        id: 'sleep_then_retry',
        content: 'Add a delay and retry once the panel looks calmer',
        description: 'Add a delay and retry once the panel looks calmer',
        metrics: { tek: 0, ded: 1, soc: 0 },
      },
      {
        id: 'await_service_barrier',
        content: 'Wait for registration to finish before sector-link reads readiness',
        description: 'Wait for registration to finish before sector-link reads readiness',
        metrics: { tek: 1, ded: 1, soc: 1 },
      },
      {
        id: 'force_sector_link',
        content: 'Ignore the registry state and force sector-link through',
        description: 'Ignore the registry state and force sector-link through',
        metrics: { tek: 0, ded: 1, soc: 0 },
      },
    ],
    correctAnswer: 'await_service_barrier',
    overrideAnswer: 'force_sector_link',
    resultFlag: 'problem_2_result',
  })
}