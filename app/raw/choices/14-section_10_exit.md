---
id: section_10_exit
kind: branch_choice
---

# Final Decision

## Prompt
Sector A is alive again. Sign off now, or keep digging into the new anomaly?

## Actions
```yaml
- id: stop_after_10
  text: 'Sign Off Now'
  description: 'End the incident with the sector restored and leave the new logs untouched.'
  conclusion: |-
    Alex closes the incident while the strange navigation warnings keep blinking in the corner of the screen.
    
    The ship is powered, alive, and still hiding something.
- id: continue_after_10
  text: 'Keep Digging'
  description: 'Follow the fresh anomaly into whatever the ship has been hiding.'
  conclusion: |-
    Alex keeps the session open and pulls the new log thread until the whole room changes shape.
    
    The technical incident is over. The larger story is not.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| stop_after_10 | 0 | -0.2 | 0.2 |
| continue_after_10 | 0.3 | 0.3 | -0.1 |
