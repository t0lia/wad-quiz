---
id: section_5_medical
kind: branch_choice
---

# Drone Preparation

## Prompt
Choose how Alex prepares Shmiel for the outside medical-side segment.

## Actions
```yaml
- id: patch_drone
  text: Software Patch
  description: Update the drone properly before opening the hatch.
- id: override_drone
  text: Hard Override
  description: Force the drone into follow mode and deal with side effects later.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| patch_drone | 0.5 | 0.4 | 0.1 |
| override_drone | -0.4 | -0.5 | -0.2 |
