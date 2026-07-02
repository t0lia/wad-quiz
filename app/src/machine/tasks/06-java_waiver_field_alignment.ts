import { createChoiceTaskState } from './_createChoiceTask'

export function javaWaiverFieldAlignmentTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The gate builds a clearance payload, but the approval flag lands under a field name the unlock logic never reads.\n\n' +
      '```java\n' +
      'Map<String, Object> buildClearance(Record record) {\n' +
      '    Map<String, Object> payload = new HashMap<>();\n' +
      '    payload.put("level", record.level());\n' +
      '    payload.put("waiverApproved", false);\n' +
      '    if (record.doctorOk()) {\n' +
      '        payload.put("waiver_approved", true);\n' +
      '    }\n' +
      '    return payload;\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_reader',
        content: 'Treat the failure like a scanner problem and retry the hardware path',
        description: 'Treat the failure like a scanner problem and retry the hardware path',
      },
      {
        id: 'relax_gate_rule',
        content: 'Flatten the gate rule so every emergency badge gets through',
        description: 'Flatten the gate rule so every emergency badge gets through',
      },
      {
        id: 'align_access_check',
        content: 'Write the approval flag where the gate actually reads it',
        description: 'Write the approval flag where the gate actually reads it',
      },
      {
        id: 'force_gate_release',
        content: 'Force the gate open through a manual bridge',
        description: 'Force the gate open through a manual bridge',
      },
    ],
    correctAnswer: 'align_access_check',
    overrideAnswer: 'force_gate_release',
    resultFlag: 'problem_4_result',
  })
}