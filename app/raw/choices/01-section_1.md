---
id: section_1
kind: branch_choice
---

# Console Build Decision

## Prompt
Choose which console build Alex starts on the terminal to reconnect Sector A control.

## Actions
```yaml
- id: choose_standard
  text: V9 Enterprise
  description: Boot the standard console profile with the full startup checklist and logging.
- id: choose_unsigned
  text: V10.0037.custom.experimental.unsigned
  description: If this is a new build it probably has tons of new cool features.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| choose_standard | 0.4 | 0.3 | 0 |
| choose_unsigned | -0.3 | -0.2 | 0 |
