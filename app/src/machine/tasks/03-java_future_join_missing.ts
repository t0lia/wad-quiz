import { createChoiceTaskState } from './_createChoiceTask'

export function javaFutureJoinMissingTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Future Join Missing\n\n' +
      'The experimental build moved startup work into futures, but the terminal still tries to talk to sector-link before those futures finish.\n\n' +
      '```java\n' +
      'String bootSectorLink(List<Service> services) throws Exception {\n' +
      '    services.forEach(service -> CompletableFuture.runAsync(service::start));\n' +
      '    Link link = sectorLink.handshake().get();\n' +
      '    if (!link.ok()) throw new IllegalStateException("sector-link offline");\n' +
      '    return "ready";\n' +
      '}\n' +
      '```\n\n' +
      'How should Alex fix this?',
    options: [
      {
        id: 'blame_controller',
        content: 'Reboot the controller rack and treat the symptom as a room failure',
        description: 'Reboot the controller rack and treat the symptom as a room failure',
      },
      {
        id: 'sleep_then_retry',
        content: 'Add a retry delay before the handshake call',
        description: 'Add a retry delay before the handshake call',
      },
      {
        id: 'await_service_barrier',
        content: 'Join the startup futures before sector-link handshakes',
        description: 'Join the startup futures before sector-link handshakes',
      },
      {
        id: 'force_sector_link',
        content: 'Bypass readiness checks and bring sector-link up immediately',
        description: 'Bypass readiness checks and bring sector-link up immediately',
      },
    ],
    correctAnswer: 'await_service_barrier',
    overrideAnswer: 'force_sector_link',
    resultFlag: 'problem_2_result',
  })
}