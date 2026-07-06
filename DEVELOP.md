# How to develop scenarios

- `app/src/machine1` is generated output and should not be committed
- `cd app && npm run test` and `cd app && npm run build` regenerate `machine1` automatically before validation
- You can still regenerate manually with `cd app && npm run generate-machine1`

- Checkout from main

- Edit the raw2 source content and parser/generator inputs

- Run validation locally; `machine1` is regenerated on demand and stays ignored by git

- Push to your branch <branch name>

- Wait few minutes for job to build and publish the site

- Open `https://t0lia.github.io/wad-quiz/<branch name>`

- Open `https://t0lia.github.io/wad-quiz/<branch name>/graph.html`

