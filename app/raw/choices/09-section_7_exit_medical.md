---
id: section_7_exit_medical
kind: branch_choice
---

# Stop Or Continue

## Prompt
Sector A is stable enough to hand off. Stop now, or continue outside?

## Actions
```yaml
- id: stop_after_7
  text: My shift is over, I've had enough for tonight!
  description: End the incident here and hand the rest to the next shift.
- id: continue_after_7
  text: Duty calls! Who will fix this mess if not me?! I carry on
  description: Keep the shift and move into the hull gap.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| stop_after_7 | 0 | -0.6 | 0.4 |
| continue_after_7 | 0 | 0.5 | -0.2 |
