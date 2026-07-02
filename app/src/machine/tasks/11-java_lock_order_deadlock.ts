import { createChoiceTaskState } from './_createChoiceTask'

export function javaLockOrderDeadlockTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Distributor Lock Ordering\n\n' +
      'Two power routines grab the same locks in opposite order. Under load they freeze each other and stall the whole sector. The remaining fault is at least honest.\n\n' +
      '```java\n' +
      'void distributePower(Lock main, Lock backup) {\n' +
      '    synchronized (main) {\n' +
      '        synchronized (backup) { reroute(main, backup); }\n' +
      '    }\n' +
      '}\n' +
      'void restorePower(Lock main, Lock backup) {\n' +
      '    synchronized (backup) {\n' +
      '        synchronized (main) { reroute(backup, main); }\n' +
      '    }\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_deploy',
        content: 'Treat the stall like a bad deployment and redeploy around it',
        description: 'Treat the stall like a bad deployment and redeploy around it',
      },
      {
        id: 'remove_safety_lock',
        content: 'Drop one safety lock and trust light traffic',
        description: 'Drop one safety lock and trust light traffic',
      },
      {
        id: 'normalize_concurrency_rule',
        content: 'Make both paths acquire their shared locks in the same order',
        description: 'Make both paths acquire their shared locks in the same order',
      },
      {
        id: 'pin_emergency_execution',
        content: 'Force the core into a narrower fallback execution mode',
        description: 'Force the core into a narrower fallback execution mode',
      },
    ],
    correctAnswer: 'normalize_concurrency_rule',
    overrideAnswer: 'pin_emergency_execution',
    resultFlag: 'problem_10_result',
  })
}