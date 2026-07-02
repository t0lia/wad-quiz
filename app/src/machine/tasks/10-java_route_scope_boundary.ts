import { createChoiceTaskState } from './_createChoiceTask'

export function javaRouteScopeBoundaryTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The recovery path builds a tunnel route with a boundary so wide that unrelated systems start following it.\n\n' +
      '```java\n' +
      'RoutePlan recoverTunnel(String iface) {\n' +
      '    RoutePlan plan = new RoutePlan();\n' +
      '    plan.address("10.20.5.14/16");\n' +
      '    plan.route("10.0.0.0/8", iface);\n' +
      '    plan.connect("10.20.0.1", true);\n' +
      '    return plan;\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_switch',
        content: 'Treat the failure like stubborn hardware and bounce the switch path',
        description: 'Treat the failure like stubborn hardware and bounce the switch path',
      },
      {
        id: 'add_shortcut_route',
        content: 'Add a shortcut route without fixing the real network scope',
        description: 'Add a shortcut route without fixing the real network scope',
      },
      {
        id: 'correct_network_boundary',
        content: 'Narrow the boundary to the segment the repair actually needs',
        description: 'Narrow the boundary to the segment the repair actually needs',
      },
      {
        id: 'force_recovery_tunnel',
        content: 'Force a direct recovery path and accept the debt',
        description: 'Force a direct recovery path and accept the debt',
      },
    ],
    correctAnswer: 'correct_network_boundary',
    overrideAnswer: 'force_recovery_tunnel',
    resultFlag: 'problem_8_result',
  })
}