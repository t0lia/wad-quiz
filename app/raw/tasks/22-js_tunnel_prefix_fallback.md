---
id: js_tunnel_prefix_fallback
pool: network_route_boundaries
language: javascript
bug_class: fallback prefix expands tunnel scope
mechanic_type: debug_decision
slot_theme_fit: network boundary repair under incident pressure
prompt_surface: four-option incident response
answer_shape: action_id
---

# Tunnel Prefix Fallback

## Prompt
The recovery helper picks a fallback prefix when none is passed, but that default is much wider than the one hull segment Alex is trying to restore.

## Snippet
```javascript
function buildTunnel(prefix = "10.90.0.0/8") {
  return {
    address: "10.90.4.12/24",
    route: prefix,
    gateway: "10.90.4.1"
  };
}
```

## Actions
```yaml
- id: blame_switch
  text: Treat the bleed like switch instability and restart the device path
  description: Spend time on hardware symptoms instead of the route scope.
- id: correct_network_boundary
  text: Use the specific tunnel prefix the hull repair actually needs
  description: Narrow the boundary so unrelated systems stop following the recovery route.
- id: add_shortcut_route
  text: Add another route on top without fixing the bad fallback scope
  description: Push traffic through temporarily while keeping the wrong boundary.
- id: force_recovery_tunnel
  text: Force a direct tunnel and accept one more brittle workaround
  description: Restore traffic quickly through a temporary rescue path.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| blame_switch | -0.6 | -0.2 | -0.1 |
| correct_network_boundary | 1 | 0.4 | 0.2 |
| add_shortcut_route | -0.8 | -0.5 | -0.4 |
| force_recovery_tunnel | -0.4 | -0.6 | -0.4 |
