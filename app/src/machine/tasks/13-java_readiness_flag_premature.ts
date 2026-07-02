import { createChoiceTaskState } from './_createChoiceTask'

export function javaReadinessFlagPrematureTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The boot controller marks the startup phase ready before the async connector actually finishes registering with sector-link.\n\n' +
      '```java\n' +
      'CompletableFuture<String> bootSectorLink(Service service, Status status) {\n' +
      '    status.mark("sector-link", "ready");\n' +
      '    return CompletableFuture.runAsync(service::register)\n' +
      '        .thenApply(ignored -> sectorLink.handshake(status))\n' +
      '        .thenApply(link -> {\n' +
      '            if (!link.ok()) throw new IllegalStateException("sector-link offline");\n' +
      '            return "ready";\n' +
      '        });\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'sleep_then_retry',
        content: 'Wait a few seconds and retry after the dashboard looks calmer',
        description: 'Add timing luck instead of fixing the readiness lie.',
      },
      {
        id: 'force_sector_link',
        content: 'Force sector-link online and trust the green light anyway',
        description: 'Skip the safety checks and accept a dirty startup state.',
      },
      {
        id: 'blame_controller',
        content: 'Restart the controller room and assume the rack is slow again',
        description: 'Treat the symptom like hardware trouble outside the code path.',
      },
      {
        id: 'await_service_barrier',
        content: 'Mark readiness only after registration finishes and then handshake',
        description: 'Put the readiness signal behind the async registration barrier.',
      },
    ],
    correctAnswer: 'await_service_barrier',
    overrideAnswer: 'force_sector_link',
    resultFlag: 'problem_1_result',
  })
}
