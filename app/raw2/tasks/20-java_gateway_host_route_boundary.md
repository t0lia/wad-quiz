---
id: java_gateway_host_route_boundary
pool: network_route_boundaries
language: java
bug_class: host route widened into subnet leak
mechanic_type: debug_decision
slot_theme_fit: network boundary repair under incident pressure
prompt_surface: four-option incident response
answer_shape: action_id
---

# Gateway Host Route Boundary

## Prompt
The repair should pin one gateway host through the hull link, but the route builder widens that path into a whole subnet and drags unrelated traffic with it.

## Snippet
```java
RoutePlan recoverGateway(String iface) {
    RoutePlan plan = new RoutePlan();
    plan.address("10.44.8.17/24");
    plan.route("10.44.8.0/24", iface);
    plan.connect("10.44.8.1", true);
    return plan;
}
```

## Actions
```yaml
- id: add_shortcut_route
  text: Stack another shortcut route on top and hope traffic sorts itself out
  description: Push packets through temporarily while leaving the boundary wrong.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: blame_switch
  text: Bounce the switch again and assume the routing table is innocent
  description: Spend time on the device instead of the route scope.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: incorrect_count
    operation: add
    value: 1
  outcome: incorrect
- id: correct_network_boundary
  text: Constrain the repair to the host or segment it actually needs
  description: Fix the route boundary so unrelated traffic stops leaking into it.
  flag_modifications:
  - flag: completed_tasks
    operation: add
    value: 1
  - flag: solved_count
    operation: add
    value: 1
  outcome: solved
- id: force_recovery_tunnel
  text: Force a direct tunnel and accept one more brittle rescue path
  description: Restore traffic quickly through technical debt.
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
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| add_shortcut_route | -0.8 | -0.5 | -0.4 |
| blame_switch | -0.6 | -0.2 | -0.1 |
| correct_network_boundary | 1 | 0.4 | 0.2 |
| force_recovery_tunnel | -0.4 | -0.6 | -0.4 |
