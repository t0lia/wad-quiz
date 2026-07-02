---
id: py_farm_prefix_boundary
pool: network_route_boundaries
language: python
bug_class: overly broad network boundary
mechanic_type: debug_decision
slot_theme_fit: network boundary repair under incident pressure
prompt_surface: four-option incident response
answer_shape: action_id
---

# Farm Prefix Boundary

## Prompt
The recovery interface uses a boundary that is too broad, so traffic spills into segments that should never be part of this repair.

## Snippet
```python
def configure_interface(iface):
    address = "10.20.5.14/8"
    run(f"ip addr replace {address} dev {iface}")
    run(f"ip route replace 10.20.0.0/16 dev {iface}")
    run("connect_switch 10.20.0.1")
    return verify_link(iface)
```

## Actions
```yaml
- id: blame_switch
  text: Treat the failure like stubborn hardware and bounce the switch path
  description: Spend time on the device instead of the bad boundary.
- id: add_shortcut_route
  text: Add a shortcut route without fixing the real network scope
  description: Push traffic through temporarily while leaving the boundary wrong.
- id: correct_network_boundary
  text: Narrow the boundary to the segment the repair actually needs
  description: Fix the prefix so the route converges cleanly.
- id: force_recovery_tunnel
  text: Force a direct recovery path and accept the debt
  description: Restore traffic quickly through a brittle temporary route.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| blame_switch | -0.6 | -0.2 | -0.1 |
| add_shortcut_route | -0.8 | -0.5 | -0.4 |
| correct_network_boundary | 1 | 0.4 | 0.2 |
| force_recovery_tunnel | -0.4 | -0.6 | -0.4 |
