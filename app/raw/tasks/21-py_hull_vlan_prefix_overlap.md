---
id: py_hull_vlan_prefix_overlap
pool: network_route_boundaries
language: python
bug_class: vlan prefix overlaps unrelated segments
mechanic_type: debug_decision
slot_theme_fit: network boundary repair under incident pressure
prompt_surface: four-option incident response
answer_shape: action_id
---

# Hull VLAN Prefix Overlap

## Prompt
The repair script assigns a VLAN address with a prefix so broad that traffic for neighboring hull segments starts following the emergency path.

## Snippet
```python
def recover_vlan(iface):
    address = "10.77.3.12/16"
    run(f"ip addr replace {address} dev {iface}")
    run(f"ip route replace 10.77.0.0/16 dev {iface}")
    run("connect_switch 10.77.3.1")
    return verify_link(iface)
```

## Actions
```yaml
- id: force_recovery_tunnel
  text: Force a direct rescue tunnel and accept another temporary secret
  description: Restore traffic quickly through a brittle temporary path.
- id: correct_network_boundary
  text: Tighten the prefix so only the intended hull VLAN rides this route
  description: Narrow the boundary to the segment the repair actually needs.
- id: blame_switch
  text: Treat the leak like stubborn hardware and bounce the switch path again
  description: Spend time on the device instead of the broad boundary.
- id: add_shortcut_route
  text: Add a shortcut route without fixing the real network scope
  description: Push traffic through temporarily while leaving the overlap in place.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| force_recovery_tunnel | -0.4 | -0.6 | -0.4 |
| correct_network_boundary | 1 | 0.4 | 0.2 |
| blame_switch | -0.6 | -0.2 | -0.1 |
| add_shortcut_route | -0.8 | -0.5 | -0.4 |
