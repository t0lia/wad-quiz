import { createChoiceTaskState } from './_createChoiceTask'

export function pyHullVlanPrefixOverlapTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The repair script assigns a VLAN address with a prefix so broad that traffic for neighboring hull segments starts following the emergency path.\n\n' +
      '```python\n' +
      'def recover_vlan(iface):\n' +
      '    address = "10.77.3.12/16"\n' +
      '    run(f"ip addr replace {address} dev {iface}")\n' +
      '    run(f"ip route replace 10.77.0.0/16 dev {iface}")\n' +
      '    run("connect_switch 10.77.3.1")\n' +
      '    return verify_link(iface)\n' +
      '```',
    options: [
      {
        id: 'force_recovery_tunnel',
        content: 'Force a direct rescue tunnel and accept another temporary secret',
        description: 'Restore traffic quickly through a brittle temporary path.',
      },
      {
        id: 'correct_network_boundary',
        content: 'Tighten the prefix so only the intended hull VLAN rides this route',
        description: 'Narrow the boundary to the segment the repair actually needs.',
      },
      {
        id: 'blame_switch',
        content: 'Treat the leak like stubborn hardware and bounce the switch path again',
        description: 'Spend time on the device instead of the broad boundary.',
      },
      {
        id: 'add_shortcut_route',
        content: 'Add a shortcut route without fixing the real network scope',
        description: 'Push traffic through temporarily while leaving the overlap in place.',
      },
    ],
    correctAnswer: 'correct_network_boundary',
    overrideAnswer: 'force_recovery_tunnel',
    resultFlag: 'problem_4_result',
  })
}
