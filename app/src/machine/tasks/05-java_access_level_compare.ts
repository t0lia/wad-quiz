import { createChoiceTaskState } from './_createChoiceTask'

export function javaAccessLevelCompareTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Freight Pass Comparison\n\n' +
      'Tony, being a very persistent man, tries to apply his pass to card reader from all the sides: backwads, sideways, even flips it at the reader. Still - all the same - ACCESS DENIED. Alex patiently examins the code of yet another service he has never seen before.\n\n' +
      '```java\n' +
      'boolean gateAllows(Credential credential) {\n' +
      '    String level = credential.getAccessLevel();\n' +
      '    if (level == "MAINT_RED") {\n' +
      '        return true;\n' +
      '    }\n' +
      '    return credential.hasSupervisorEscort();\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_reader',
        content: 'Treat the failure like a scanner problem and retry the hardware path',
        description: 'Treat the failure like a scanner problem and retry the hardware path',
        metrics: { tek: 0, ded: 0, soc: 0 },
      },
      {
        id: 'relax_gate_rule',
        content: 'Flatten the gate rule so every emergency badge gets through',
        description: 'Flatten the gate rule so every emergency badge gets through',
        metrics: { tek: 0, ded: 0, soc: 1 },
      },
      {
        id: 'align_access_check',
        content: 'Compare the access level by value instead of by reference',
        description: 'Compare the access level by value instead of by reference',
        metrics: { tek: 1, ded: 1, soc: 1 },
      },
      {
        id: 'force_gate_release',
        content: 'Force the gate open through a manual bridge',
        description: 'Force the gate open through a manual bridge',
        metrics: { tek: 0, ded: 1, soc: 0 },
      },
    ],
    correctAnswer: 'align_access_check',
    overrideAnswer: 'force_gate_release',
    resultFlag: 'problem_4_result',
  })
}