import { createChoiceTaskState } from './_createChoiceTask'

export function javaGatewayHostRouteBoundaryTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Gateway Host Route Boundary\n\n' +
      'The repair should pin one gateway host through the hull link, but the route builder widens that path into a whole subnet and drags unrelated traffic with it.\n\n' +
      '```java\n' +
      'RoutePlan recoverGateway(String iface) {\n' +
      '    RoutePlan plan = new RoutePlan();\n' +
      '    plan.address("10.44.8.17/24");\n' +
      '    plan.route("10.44.8.0/24", iface);\n' +
      '    plan.connect("10.44.8.1", true);\n' +
      '    return plan;\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'add_shortcut_route',
        content: 'Stack another shortcut route on top and hope traffic sorts itself out',
        description: 'Push packets through temporarily while leaving the boundary wrong.',
      },
      {
        id: 'blame_switch',
        content: 'Bounce the switch again and assume the routing table is innocent',
        description: 'Spend time on the device instead of the route scope.',
      },
      {
        id: 'force_recovery_tunnel',
        content: 'Force a direct tunnel and accept one more brittle rescue path',
        description: 'Restore traffic quickly through technical debt.',
      },
      {
        id: 'correct_network_boundary',
        content: 'Constrain the repair to the host or segment it actually needs',
        description: 'Fix the route boundary so unrelated traffic stops leaking into it.',
      },
    ],
    correctAnswer: 'correct_network_boundary',
    overrideAnswer: 'force_recovery_tunnel',
    resultFlag: 'problem_4_result',
  })
}
