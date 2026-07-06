## Scoring

### Axes

- [DED] dedication: how much a player keeps doing the right thing despite pressure, fatigue, and tempting shortcuts.
- [SOC] social capital: how much a player considers teammates, handoffs, operational safety, and the people around the decision.
- [TEK] technical skills: how well a player solves the actual technical problem.

Each choice contributes a delta to any axis it meaningfully supports.

- Allowed delta range per axis: `-1.0` to `1.0`
- `0` means the choice is neutral on that axis
- Positive values mean the choice strengthens that axis
- Negative values mean the choice actively damages that axis
- Absolute value reflects strength of impact: `0.1` is a light signal, `0.8` is a strong signal

This model is intentionally not binary. A run should be able to show mixed signals, weak strengths, and repeated harmful patterns instead of collapsing everything into true/false buckets.

### Five-Color Success Ladder

Colors indicate the player's overall level of success in a way that reads cleanly inside a large-bank tone: measured, professional, and suitable for internal reporting.

| Color | Success Level | Intended Meaning |
|-------|---------------|------------------|
| Sapphire | Exceptional | Strong delivery, sound judgment, and low-regret tradeoffs |
| Teal | Strong | Dependable performance with one narrow blind spot |
| Green | Sound | Credible recovery under pressure with visible limits |
| Amber | Mixed | Useful instincts, but not yet consistently reliable |
| Slate | Limited | Early-stage performance that needs support and supervision |

### Axis Bands

These bands are deliberately fixed and human-readable. They should not move every time content changes.

| Band | Threshold | Meaning |
|------|-----------|---------|
| Signature strength | `2.5` and above | The player repeatedly demonstrates this trait across the run |
| Reliable positive | `0.75` to `2.49` | The trait is visible and generally helpful |
| Mixed / situational | `-0.74` to `0.74` | No strong pattern; behavior depends on context |
| Strained | `-2.49` to `-0.75` | The player repeatedly undercuts this trait |
| Eroding | `-2.5` and below | The player actively damages this trait across the run |

### Archetype Matrix

Use the first matching row from top to bottom.

| DED Rule | SOC Rule | TEK Rule | Archetype | Color | Reading |
|----------|----------|----------|-----------|-------|---------|
| `>= 2.5` | `>= 2.5` | `>= 2.5` | Trusted Stabilizer | Sapphire | Delivers the fix, protects the team, and keeps standards intact under pressure |
| `>= 0.75` | `>= 0.75` | `>= 2.5` | Controlled Expert | Teal | Technically decisive and still safe to operate around |
| `>= 2.5` | `>= 0.75` | `>= 0.75` | Steady Executor | Teal | Pushes work through responsibly, even if not always elegantly |
| `>= 0.75` | `>= 2.5` | `-0.74` to `2.49` | Team-First Operator | Teal | Protects trust and shared execution, even when the technical edge is moderate |
| `>= 0.75` | `>= 0.75` | `>= 0.75` | Balanced Contributor | Green | A dependable all-round performer without a single standout signature |
| `>= 2.5` | `-0.74` to `0.74` | `>= 0.75` | Relentless Fixer | Green | Keeps driving toward resolution, but does not consistently widen the circle of trust |
| `-0.74` to `0.74` | `>= 0.75` | `>= 2.5` | Technical Specialist | Green | Strong at solving the incident, with enough operational awareness to stay credible |
| `-0.74` to `0.74` | `-0.74` to `0.74` | `>= 0.75` | Narrow Optimizer | Amber | Can produce results, but too much of the success depends on one axis only |
| `>= 0.75` | `<= -0.75` | `>= 0.75` | Lone Rescuer | Amber | Gets important things done, but leaves avoidable trust damage behind |
| `<= -0.75` | `>= 0.75` | `-0.74` to `0.74` | Careful Deferrer | Amber | Protects people reasonably well, but struggles to carry technical momentum |
| `<= -2.5` | any | `<= -0.75` | Control Breach Risk | Slate | Repeatedly sacrifices discipline and compounds technical risk |
| any | `<= -2.5` | any | Trust Erosion Risk | Slate | Progress comes with visible damage to teammates, handoffs, or operational confidence |
| `<= -0.75` | `<= -0.75` | `<= -0.75` | Unsteady Operator | Slate | Harmful patterns show up across all three axes and need intervention |
| otherwise | otherwise | otherwise | Developing Contributor | Amber | Mixed signals dominate; the player shows potential but not yet a stable profile |

### Current Score Envelope

- Overall dedication range: `-3.0` to `5.0`
- Overall social capital range: `-3.7` to `2.3`
- Overall technical skills range: `-4.4` to `7.1`

### Ending Range Snapshot

| Ending | DED Min | DED Max | SOC Min | SOC Max | TECH Min | TECH Max |
|--------|---------|---------|---------|---------|----------|----------|
| ending_1 | -3.0 | 1.7 | -1.5 | 2.1 | -2.7 | 4.2 |
| ending_2 | -2.9 | 2.8 | -2.2 | 2.0 | -3.5 | 5.2 |
| ending_3 | -2.3 | 3.6 | -2.6 | 2.3 | -3.6 | 5.7 |
| ending_4 | -2.4 | 4.5 | -3.4 | 2.2 | -4.4 | 6.8 |
| ending_5 | -1.9 | 5.0 | -3.7 | 1.9 | -4.1 | 7.1 |

Regenerate the live range snapshot with:

```powershell
python .\scripts\hydroworld_score_report.py .\worlds\hydroworld\06-gn_structure.yaml
```

 