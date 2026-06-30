## Scoring

### Metrics

- [DED] dedication
- [SOC] social capital - how you behave with you teammates
- [TEK] tech skills

### How to get a value

For each metric, you can get a binary value of 0 or 1 (you can consider them "false" and "true" accordingly to simpify
the mechanics):
if the score is below the middle value of the possible points, you get 0, and if it's above the middle value, you get 1.

Example: if the possible points for dedication are from 0 to 10, and you get a score of 7, you would get a value of 1
for dedication.
If you get a score of 4, you would get a value of 0 for dedication. Round values up if they are exactly in the middle (
e.g. if the possible points are from 0 to 10, and you get a score of 5, you would get a value of 1 for dedication).

### Distribution for metrics

Description of archetypes:

- DED True + TECH True + SOC True: "True leader"
- DED True + TECH True + SOC False: "Cyborg"
- DED True + TECH False + SOC True: "Loyalist"
- DED True + TECH False + SOC False: "Workaholic"
- DED False + TECH True + SOC True: "9-5er"
- DED False + TECH True + SOC False: "Theorist"
- DED False + TECH False + SOC True: "Water cooler dweller"
- DED False + TECH False + SOC False: "Slacker"

Colors for archetypes:

| Archetype            | Grade | Color  |
|----------------------|-------|--------|
| True leader          | A     | Blue   |
| Cyborg               | A     | Blue   |
| Loyalist             | B     | Green  |
| Workaholic           | B     | Green  |
| 9-5er                | B     | Green  |
| Theorist             | B     | Green  |
| Water cooler dweller | C     | Yellow |
| Slacker              | C     | Yellow |

 