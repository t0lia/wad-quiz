import { createChoiceTaskState } from './_createChoiceTask'

export function javaAuditLockInversionTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The live repair path locks distributor state one way, but the audit path grabs the same locks in reverse order and jams the core under load.\n\n' +
      '```java\n' +
      'void applySwap(Lock main, Lock audit) {\n' +
      '    synchronized (main) {\n' +
      '        synchronized (audit) { commit(main, audit); }\n' +
      '    }\n' +
      '}\n' +
      'void auditSwap(Lock main, Lock audit) {\n' +
      '    synchronized (audit) {\n' +
      '        synchronized (main) { record(main, audit); }\n' +
      '    }\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'pin_emergency_execution',
        content: 'Pin the core to an emergency path and accept the narrower throughput',
        description: 'Recover quickly by accepting a slower, brittle execution mode.',
      },
      {
        id: 'blame_deploy',
        content: 'Treat the stall like packaging fallout and redeploy around it',
        description: 'Spend time on release symptoms instead of the lock rule.',
      },
      {
        id: 'normalize_concurrency_rule',
        content: 'Make the audit and live paths acquire shared locks in the same order',
        description: 'Restore one consistent lock rule so the core can run under load.',
      },
      {
        id: 'remove_safety_lock',
        content: 'Drop one lock and hope lighter traffic hides the deadlock',
        description: 'Escape the stall by removing protection instead of fixing order.',
      },
    ],
    correctAnswer: 'normalize_concurrency_rule',
    overrideAnswer: 'pin_emergency_execution',
    resultFlag: 'problem_5_result',
  })
}
