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
  text: 'V9 Enterprise'
  description: 'Boot the standard console profile with the full startup checklist and logging.'
  conclusion: 'The PDA loads the enterprise console and opens a verified device map across the screen. Sector A shows locked while the recovery tools finish loading. Alex moved with the same enterprise confidence as the build itself, because after all, if the console boot was still progressing, there was no reason to outrun the loading.'
- id: choose_unsigned
  text: 'V10.0037.custom.experimental.unsigned'
  description: 'If this is a new build it probably has tons of new cool features.'
  conclusion: 'The PDA loads an unsigned experimental build. Alex is welcomed with a nice new background and soft music. During the load sequence Alex spots useless lines like "validation checks disabled" and "security checks disabled", but he doens''t pay much attention to those - who reads logs before incidents anyway. With the custom tools and soft music, Alex heads to Sector A Control to start the reconnect.'
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| choose_standard | 0.4 | 0.3 | 0 |
| choose_unsigned | -0.3 | -0.2 | 0 |
