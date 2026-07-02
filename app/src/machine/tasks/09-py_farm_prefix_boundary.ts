import { createChoiceTaskState } from './_createChoiceTask'

export function pyFarmPrefixBoundaryTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The recovery interface uses a boundary that is too broad, so traffic spills into segments that should never be part of this repair.\n\n' +
      '```python\n' +
      'def configure_interface(iface):\n' +
      '    address = "10.20.5.14/8"\n' +
      '    run(f"ip addr replace {address} dev {iface}")\n' +
      '    run(f"ip route replace 10.20.0.0/16 dev {iface}")\n' +
      '    run("connect_switch 10.20.0.1")\n' +
      '    return verify_link(iface)\n' +
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