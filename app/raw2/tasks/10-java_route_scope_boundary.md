---
id: java_route_scope_boundary
pool: network_route_boundaries
language: java
bug_class: overly broad route scope
mechanic_type: debug_decision
slot_theme_fit: network boundary repair under incident pressure
prompt_surface: four-option incident response
answer_shape: action_id
---

# Route Scope Boundary

## Prompt
The recovery path builds a tunnel route with a boundary so wide that unrelated systems start following it.

## Snippet
```java
RoutePlan recoverTunnel(String iface) {
    RoutePlan plan = new RoutePlan();
    plan.address("10.20.5.14/16");
    plan.route("10.0.0.0/8", iface);
    plan.connect("10.20.0.1", true);
    return plan;
}
```

## Actions
```yaml
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
- id: correct_network_boundary
  text: Narrow the boundary to the segment the repair actually needs
  description: Fix the route scope so unrelated systems stop leaking into it.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: solved_count
    operation: add
    value: 1
  outcome: solved
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| blame_switch | -0.6 | -0.2 | -0.1 |
| add_shortcut_route | -0.8 | -0.5 | -0.4 |
| force_recovery_tunnel | -0.4 | -0.6 | -0.4 |
| correct_network_boundary | 1 | 0.4 | 0.2 |
