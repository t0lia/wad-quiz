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
  text: 'My shift is over, I''ve had enough for tonight!'
  description: 'End the incident here and hand the rest to the next shift.'
  conclusion: |-
    Alex takes the respectable retreat and lets a future shift inherit the part that still involves vacuum and regret.
    
    The ship survives the night, and Clara gets a cleaner report than she expected.
- id: continue_after_7
  text: 'Duty calls! Who will fix this mess if not me?! I carry on'
  description: 'Keep the shift and move into the hull gap.'
  conclusion: |-
    Alex closes the waiver and keeps moving deeper into the outside repair.
    
    The next section depends on whether the night is still mostly clean or already running on shortcuts.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| stop_after_7 | 0 | -0.6 | 0.4 |
| continue_after_7 | 0 | 0.5 | -0.2 |
