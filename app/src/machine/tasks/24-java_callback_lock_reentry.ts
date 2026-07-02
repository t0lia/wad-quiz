import { createChoiceTaskState } from './_createChoiceTask'

export function javaCallbackLockReentryTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The distributor stabilizer locks the main path first, but its recovery callback reenters through the backup lock and deadlocks whenever both flows overlap.\n\n' +
      '```java\n' +
      'void stabilize(Lock main, Lock backup) {\n' +
      '    synchronized (main) {\n' +
      '        synchronized (backup) { syncState(); }\n' +
      '    }\n' +
      '}\n' +
      'void onRecovery(Lock main, Lock backup) {\n' +
      '    synchronized (backup) {\n' +
      '        synchronized (main) { syncState(); }\n' +
      '    }\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'remove_safety_lock',
        content: 'Strip one lock and trust the overlap never gets ugly',
        description: 'Escape the deadlock by removing protection rather than fixing order.',
      },
      {
        id: 'normalize_concurrency_rule',
        content: 'Keep the callback and primary path on one shared lock order',
        description: 'Restore one consistent acquisition rule so the core can survive overlap.',
      },
      {
        id: 'pin_emergency_execution',
        content: 'Force the distributor into an emergency single-lane mode',
        description: 'Recover power quickly by accepting a slower, brittle path.',
      },
      {
        id: 'blame_deploy',
        content: 'Call it a deployment issue and redeploy around the stall',
        description: 'Spend time on packaging symptoms instead of the lock inversion.',
      },
    ],
    correctAnswer: 'normalize_concurrency_rule',
    overrideAnswer: 'pin_emergency_execution',
    resultFlag: 'problem_5_result',
  })
}
