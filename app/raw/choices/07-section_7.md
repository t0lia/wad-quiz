---
id: section_7
kind: branch_choice
---

# EVA Plan

## Prompt
Choose how Alex handles the outside segment.

## Actions
```yaml
- id: team_eva
  text: 'Shared Tether with Ray'
  description: 'Take Ray on support and split the outside work.'
  conclusion: |-
    Ray clips into the shared plan and starts mirroring Alex's checklist from the inner panel.
    
    The ship offers one polite chance to stop before the deeper outside repair begins.
- id: solo_eva
  text: 'Solo Tether'
  description: 'Go alone and keep every decision in one suit.'
  conclusion: |-
    Alex takes the single tether and leaves Ray at the hatch with a look that means I told you so in advance.
    
    The ship offers one polite chance to stop before Alex has to earn the rest of the night.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| team_eva | 0.1 | 0.2 | 0.7 |
| solo_eva | 0.2 | 0.1 | -0.5 |
