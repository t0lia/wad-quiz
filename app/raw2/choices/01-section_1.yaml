id: section_1
kind: branch_choice
title: Console Build Decision
prompt: Choose which console build Alex starts on the terminal to reconnect Sector A control.
actions:
- id: choose_standard
  text: V9 Enterprise
  description: Boot the standard console profile with the full startup checklist and logging.
  conclusion: The PDA loads the enterprise console and opens a verified device map across the screen. Sector A shows locked while the recovery tools finish loading. Alex moved with the same enterprise confidence as the build itself, because after all, if the console boot was still progressing, there was no reason to outrun the loading.
  flag_modifications:
  - flag: boot_standard
    operation: set
    value: 1
  - flag: boot_unsigned
    operation: remove
  scores:
    technical_skills: 0.4
    dedication: 0.3
    social_capital: 0.0
- id: choose_unsigned
  text: V10.0037.custom.experimental.unsigned
  description: If this is a new build it probably has tons of new cool features.
  conclusion: The PDA loads an unsigned experimental build. Alex is welcomed with a nice new background and soft music. During the load sequence Alex spots useless lines like "validation checks disabled" and "security checks disabled", but he doens't pay much attention to those - who reads logs before incidents anyway. With the custom tools and soft music, Alex heads to Sector A Control to start the reconnect.
  flag_modifications:
  - flag: boot_unsigned
    operation: set
    value: 1
  - flag: boot_standard
    operation: remove
  - flag: debt_count
    operation: add
    value: 1
  scores:
    technical_skills: -0.3
    dedication: -0.2
    social_capital: 0.0
