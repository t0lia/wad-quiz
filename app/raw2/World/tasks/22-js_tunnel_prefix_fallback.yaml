id: js_tunnel_prefix_fallback
pool: network_route_boundaries
language: javascript
bug_class: fallback prefix expands tunnel scope
mechanic_type: debug_decision
slot_theme_fit: network boundary repair under incident pressure
prompt_surface: four-option incident response
answer_shape: action_id
title: Tunnel Prefix Fallback
prompt: The recovery helper picks a fallback prefix when none is passed, but that
  default is much wider than the one hull segment Alex is trying to restore.
snippet:
- function buildTunnel(prefix = "10.90.0.0/8") {
- '  return {'
- '    address: "10.90.4.12/24",'
- '    route: prefix,'
- '    gateway: "10.90.4.1"'
- '  };'
- '}'
actions:
- id: blame_switch
  text: Treat the bleed like switch instability and restart the device path
  description: Spend time on hardware symptoms instead of the route scope.
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
  text: Add another route on top without fixing the bad fallback scope
  description: Push traffic through temporarily while keeping the wrong boundary.
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
  text: Force a direct tunnel and accept one more brittle workaround
  description: Restore traffic quickly through a temporary rescue path.
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
  text: Use the specific tunnel prefix the hull repair actually needs
  description: Narrow the boundary so unrelated systems stop following the recovery
    route.
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
