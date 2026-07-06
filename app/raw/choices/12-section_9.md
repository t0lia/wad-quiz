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
  text: 'Hot Swap'
  description: 'Keep the line energized and move quickly.'
  conclusion: |-
    Alex keeps the line live and every movement around the connector suddenly matters more.
    
    One more checkpoint stands between this decision and the core repair.
- id: full_drain
  text: 'Drain Then Replace'
  description: 'Quiet the line first, then take the slower route.'
  conclusion: |-
    Alex drains the local line and buys a cleaner working surface at the price of more time and more complaints.
    
    The connector is ready, and the final repair can still be declined by someone with better instincts.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| hot_swap | -0.2 | 0.1 | -0.4 |
| full_drain | 0.4 | 0.3 | 0.3 |
