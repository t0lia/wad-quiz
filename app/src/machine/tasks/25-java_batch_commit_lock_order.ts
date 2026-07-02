import { createChoiceTaskState } from './_createChoiceTask'

export function javaBatchCommitLockOrderTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Batch Commit Lock Order\n\n' +
      'The power batch commit path takes the staging and live locks in one order, while rollback reaches for them in reverse and freezes both flows.\n\n' +
      '```java\n' +
      'void commitBatch(Lock live, Lock staging) {\n' +
      '    synchronized (live) {\n' +
      '        synchronized (staging) { applyBatch(); }\n' +
      '    }\n' +
      '}\n' +
      'void rollbackBatch(Lock live, Lock staging) {\n' +
      '    synchronized (staging) {\n' +
      '        synchronized (live) { cancelBatch(); }\n' +
      '    }\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_deploy',
        content: 'Assume the batch freeze came from a bad rollout and redeploy around it',
        description: 'Spend time on release symptoms instead of the lock rule.',
      },
      {
        id: 'remove_safety_lock',
        content: 'Drop one lock and pray the batch traffic stays polite',
        description: 'Escape the stall by removing protection rather than fixing order.',
      },
      {
        id: 'pin_emergency_execution',
        content: 'Pin the distributor to the emergency lane and accept the compromise',
        description: 'Recover quickly by relying on a narrower, brittle mode.',
      },
      {
        id: 'normalize_concurrency_rule',
        content: 'Make commit and rollback acquire their shared locks in the same order',
        description: 'Restore one consistent lock rule so batch recovery can complete under load.',
      },
    ],
    correctAnswer: 'normalize_concurrency_rule',
    overrideAnswer: 'pin_emergency_execution',
    resultFlag: 'problem_5_result',
  })
}
