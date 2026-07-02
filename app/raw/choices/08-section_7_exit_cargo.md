---
id: section_7_exit_cargo
kind: branch_choice
---

# Stop Or Continue

## Prompt
The cargo lane is stable enough to hand off. Stop now, or continue outside?

## Actions
```yaml
- id: stop_after_7
  text: 'My shift is over, I''ve had enough for tonight!'
  description: 'End the incident here and hand the rest to the next shift.'
  conclusion: |-
    Alex closes the emergency session while freight keeps breathing and the audit trail keeps waiting.
    
    The ship survives the night, though not cleanly and not entirely because of Alex.
- id: continue_after_7
  text: 'Duty calls! Who will fix this mess if not me?! I carry on'
  description: 'Keep the shift and move deeper into the hull gap.'
  conclusion: |-
    Alex dismisses the handoff notice and moves farther out along the ship's exterior.
    
    The software path is alive, but the next scene depends on how much bad certainty Alex has already borrowed.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| stop_after_7 | 0 | -0.6 | 0.4 |
| continue_after_7 | 0 | 0.5 | -0.2 |
