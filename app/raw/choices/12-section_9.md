---
id: section_9
kind: branch_choice
---

# Swap Method

## Prompt
Choose how Alex prepares the cable replacement.

## Actions
```yaml
- id: hot_swap
  text: Hot Swap
  description: Keep the line energized and move quickly.
- id: full_drain
  text: Drain Then Replace
  description: Quiet the line first, then take the slower route.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| hot_swap | -0.2 | 0.1 | -0.4 |
| full_drain | 0.4 | 0.3 | 0.3 |
