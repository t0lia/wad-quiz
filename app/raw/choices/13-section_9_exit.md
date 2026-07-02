---
id: section_9_exit
kind: branch_choice
---

# Continue Or Retreat

## Prompt
Stop before touching the distributor core, or continue into the final repair?

## Actions
```yaml
- id: stop_after_9
  text: Stop Before The Core
  description: Stabilize the situation and leave the core for another shift.
- id: continue_after_9
  text: Continue Into The Core
  description: Finish the job tonight.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| stop_after_9 | 0 | -0.3 | 0.4 |
| continue_after_9 | 0.1 | 0.4 | -0.1 |
