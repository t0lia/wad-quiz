id: py_hull_vlan_prefix_overlap
pool: network_route_boundaries
language: python
bug_class: vlan prefix overlaps unrelated segments
mechanic_type: debug_decision
slot_theme_fit: network boundary repair under incident pressure
prompt_surface: four-option incident response
answer_shape: action_id
title: Hull VLAN Prefix Overlap
prompt: The repair script assigns a VLAN address with a prefix so broad that traffic
  for neighboring hull segments starts following the emergency path.
snippet:
- 'def recover_vlan(iface):'
- '    address = "10.77.3.12/16"'
- '    run(f"ip addr replace {address} dev {iface}")'
- '    run(f"ip route replace 10.77.0.0/16 dev {iface}")'
- '    run("connect_switch 10.77.3.1")'
- '    return verify_link(iface)'
actions:
- id: force_recovery_tunnel
  text: Force a direct rescue tunnel and accept another temporary secret
  description: Restore traffic quickly through a brittle temporary path.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: override_count
    operation: add
    value: 1
  - flag: debt_count
    operation: add
    value: 1
  outcome: override
  scores:
    technical_skills: -0.4
    dedication: -0.6
    social_capital: -0.4
- id: correct_network_boundary
  text: Tighten the prefix so only the intended hull VLAN rides this route
  description: Narrow the boundary to the segment the repair actually needs.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: solved_count
    operation: add
    value: 1
  outcome: solved
  scores:
    technical_skills: 1.0
    dedication: 0.4
    social_capital: 0.2
- id: blame_switch
  text: Treat the leak like stubborn hardware and bounce the switch path again
  description: Spend time on the device instead of the broad boundary.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
  scores:
    technical_skills: -0.6
    dedication: -0.2
    social_capital: -0.1
- id: add_shortcut_route
  text: Add a shortcut route without fixing the real network scope
  description: Push traffic through temporarily while leaving the overlap in place.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
  scores:
    technical_skills: -0.8
    dedication: -0.5
    social_capital: -0.4
