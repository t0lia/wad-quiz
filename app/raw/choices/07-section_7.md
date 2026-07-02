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
  text: Shared Tether with Ray
  description: Take Ray on support and split the outside work.
- id: solo_eva
  text: Solo Tether
  description: Go alone and keep every decision in one suit.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| team_eva | 0.1 | 0.2 | 0.7 |
| solo_eva | 0.2 | 0.1 | -0.5 |
