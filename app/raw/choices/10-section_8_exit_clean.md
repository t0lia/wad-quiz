---
id: section_8_exit_clean
kind: branch_choice
---

# Partial Recovery Decision

## Prompt
Sector A is running on recovered software paths. Stop with a partial win, or continue to the burned connector?

## Actions
```yaml
- id: stop_after_8
  text: Stop With Partial Recovery
  description: End the field operation and leave the physical fault for another shift.
- id: continue_after_8
  text: Continue To The Connector
  description: Keep moving toward the hardware fault.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| stop_after_8 | 0 | -0.4 | 0.3 |
| continue_after_8 | 0.1 | 0.4 | -0.1 |
