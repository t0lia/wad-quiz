---
id: js_start_barrier_missing
pool: boot_terminal_concurrency
language: javascript
bug_class: missing startup barrier
mechanic_type: debug_decision
slot_theme_fit: boot-time system initialization under pressure
prompt_surface: four-option runtime incident response
answer_shape: action_id
---

# Missing Startup Barrier

## Prompt
The experimental build is lightning fast because it starts services in parallel. One dependency reaches for sector-link before the rest of startup is actually ready.

## Snippet
```javascript
async function bootSectorLink(services) {
  services.map((service) => service.start());
  const link = await sectorLink.handshake();
  if (!link.ok) throw new Error("sector-link offline");
  return "ready";
}
```

## Actions
```yaml
- id: blame_controller
  text: Blame the controller rack and restart it from the wall panel
  description: Treat the issue as external hardware trouble and reset the room.
- id: sleep_then_retry
  text: Add a fixed delay before the handshake
  description: Wait a few seconds and hope the service chain happens to finish in time.
- id: await_service_barrier
  text: Wait for all service startups before sector-link handshakes
  description: Hold the handshake until the dependency chain reports ready.
- id: force_sector_link
  text: Override startup checks and force sector-link online
  description: Skip the safety barrier and bring the link up dirty but fast.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| blame_controller | -0.6 | -0.2 | -0.1 |
| sleep_then_retry | -0.7 | -0.4 | 0 |
| await_service_barrier | 1 | 0.4 | 0.2 |
| force_sector_link | -0.4 | -0.7 | -0.4 |
