---
id: section_8_exit_debt
kind: branch_choice
---

# Contain Or Continue

## Prompt
The recovery path works, but only with visible debt. Stop now, or continue to the burned connector?

## Actions
```yaml
- id: stop_after_8
  text: 'Stop With Partial Recovery'
  description: 'Freeze the current state and leave the physical fault for another shift.'
  conclusion: |-
    Alex contains the system where it stands and refuses to stack fresh risk on top of the old kind.
    
    The sector remains alive, even if the route holding it together still feels borrowed.
- id: continue_after_8
  text: 'Continue To The Connector'
  description: 'Keep moving and try to replace the physical failure before the debt stack shifts again.'
  conclusion: |-
    Alex keeps moving while the forced recovery path holds behind with the unsettling steadiness of a lie.
    
    The burned connector is still ahead, and now the ship has even more reasons not to tolerate mistakes.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| stop_after_8 | 0 | -0.4 | 0.3 |
| continue_after_8 | 0.1 | 0.4 | -0.1 |
