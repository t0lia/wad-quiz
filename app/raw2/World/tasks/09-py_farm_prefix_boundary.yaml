id: py_farm_prefix_boundary
pool: network_route_boundaries
language: python
bug_class: overly broad network boundary
mechanic_type: debug_decision
slot_theme_fit: network boundary repair under incident pressure
prompt_surface: four-option incident response
answer_shape: action_id
title: Farm Prefix Boundary
prompt: The recovery interface uses a boundary that is too broad, so traffic spills
  into segments that should never be part of this repair.
snippet:
- 'def configure_interface(iface):'
- '    address = "10.20.5.14/8"'
- '    run(f"ip addr replace {address} dev {iface}")'
- '    run(f"ip route replace 10.20.0.0/16 dev {iface}")'
- '    run("connect_switch 10.20.0.1")'
- '    return verify_link(iface)'
actions:
- id: blame_switch
  text: Treat the failure like stubborn hardware and bounce the switch path
  description: Spend time on the device instead of the bad boundary.
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
- id: correct_network_boundary
  text: Narrow the boundary to the segment the repair actually needs
  description: Fix the prefix so the route converges cleanly.
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
- id: add_shortcut_route
  text: Add a shortcut route without fixing the real network scope
  description: Push traffic through temporarily while leaving the boundary wrong.
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
- id: force_recovery_tunnel
  text: Force a direct recovery path and accept the debt
  description: Restore traffic quickly through a brittle temporary route.
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
