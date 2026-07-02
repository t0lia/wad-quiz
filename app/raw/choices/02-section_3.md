---
id: section_3
kind: branch_choice
---

# Bandages or cargo containers?

## Prompt
Guide Alex towards Airlock #4

## Actions
```yaml
- id: take_cargo_route
  text: Alex will see his luck through the Cargo management compartment
  description: Pass through freight operations and lean on Tony for access.
- id: take_medical_route
  text: None has been sick lately so route through Medical looks like a safer bet
  description: Cut through the food block and let Clara solve the human paperwork.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| take_cargo_route | 0.1 | 0.2 | 0 |
| take_medical_route | 0 | 0.1 | 0.3 |
