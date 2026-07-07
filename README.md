# WAD - quiz

## Deployment and monitoring

- Pushes to non-`main` branches continue to publish preview builds to GitHub Pages.
- Pushes to `main` now build the frontend, bundle it into `backend/public`, and deploy a single Cloud Run service on Google Cloud.
- The frontend sends `{ uuid, step }` to `POST /api/progress` every time the active quiz step changes.
- The backend stores the latest step for each UUID in Firestore collection `quiz-progress` (override with `PROGRESS_COLLECTION`).

### Required GitHub secrets

- `GCP_PROJECT_ID`
- `GCP_REGION`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

### Manual deploy with gcloud

Use this when you want to deploy a local checkout to Cloud Run without going through the GitHub Actions workflow (for example, to verify a change before pushing to `main`).

Prerequisites: `gcloud` CLI installed and authenticated (`gcloud auth login`), the GCP project you want to deploy to set as default (`gcloud config set project <PROJECT_ID>`), and the `roles/run.admin` + `roles/iam.serviceAccountUser` roles on the deployer account.

From the repository root:

```bash
# 1. Install deps and build the SPA
(cd app      && npm ci && npm run build)
rm -rf backend/public
mkdir -p backend/public
cp -R app/dist/. backend/public/

# 3. Deploy to Cloud Run, letting gcloud build the image from ./backend
gcloud run deploy wad-quiz \
  --source=backend \
  --region="europe-west10" \
  --project="studentsworkshop2026" \
  --allow-unauthenticated
```

https://wad-quiz-615341894974.europe-west10.run.app
https://wad-quiz-615341894974.europe-west10.run.app


```
# 1. Create a Serverless Network Endpoint Group (NEG) for your service
gcloud compute network-endpoint-groups create wad-quiz-neg \
  --region="europe-west10" \
  --project="studentsworkshop2026" \
  --network-endpoint-type=serverless \
  --cloud-run-service="wad-quiz"

# 2. Create a Global Backend Service with Cloud CDN activated
gcloud compute backend-services create wad-quiz-cdn-backend \
  --global \
  --project="studentsworkshop2026" \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --enable-cdn \
  --cache-mode=CACHE_ALL_STATIC \
  --default-ttl=3600

# 3. Connect your Cloud Run NEG to the CDN Backend Service
gcloud compute backend-services add-backend wad-quiz-cdn-backend \
  --global \
  --project="studentsworkshop2026" \
  --network-endpoint-group=wad-quiz-neg \
  --network-endpoint-group-region="europe-west10"

# 4. Create a URL Map to route load balancer requests to your backend
gcloud compute url-maps create wad-quiz-url-map \
  --project="studentsworkshop2026" \
  --default-service=wad-quiz-cdn-backend

# 5. Create an HTTP target proxy to handle traffic routing
gcloud compute target-http-proxies create wad-quiz-http-proxy \
  --project="studentsworkshop2026" \
  --url-map=wad-quiz-url-map

# 6. Create a Global Forwarding Rule to get your new CDN public IP address
gcloud compute forwarding-rules create wad-quiz-cdn-frontend \
  --project="studentsworkshop2026" \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --network-tier=PREMIUM \
  --target-http-proxy=wad-quiz-http-proxy \
  --ports=80 \
  --global
```  


Notes:

- `--source=backend` makes gcloud run a Cloud Build on `./backend`, produce a container image, and roll it out to Cloud Run in one step. No `Dockerfile` is required because gcloud auto-detects the Node.js entrypoint (`backend/server.js`).
- Set `--region` to the same region the workflow uses (the value of the `GCP_REGION` secret).
- Pass `--set-env-vars=KEY=VALUE` if you need to override runtime config (e.g. `--set-env-vars=PROGRESS_COLLECTION=quiz-progress`).
- To target a different project, set `CLOUDSDK_CORE_PROJECT` or pass `--project` explicitly.
- After deploy, gcloud prints the service URL — open it to confirm the SPA loads and `GET /api/health` returns `ok`.


## UI components

### Drag & Drop Priority Sorting

A list of tasks or steps — drag them into the correct order.

**Sort the deployment steps:**

- [ ] Write the code
- [ ] Code review
- [ ] Run tests
- [ ] Merge to main
- [ ] Rollback if failed

---

### Resource Allocation — Sliders or Cards

You have a limited resource — time, memory, bandwidth. Distribute it across tasks by clicking or dragging.

**Available: 8 hours**

| Task        | Allocated |
|-------------|-----------|
| Documents   | 3h ████░░ |
| Photos      | 1h ██░░░░ |
| Audio       | 3h ████░░ |
| Indexing    | 1h █░░░░░ |

---

### Mapping — Connect Matching Pairs

Two columns — tap to connect the correct pairs.

**Error → Cause**

| Error     |     | Cause           |
|-----------|-----|-----------------|
| ERR 404 ● | ——— | ● File not found |
| ERR 403 ● |     | ● No access      |
| ERR 500 ● |     | ● Server crashed  |
| ERR 000 ● |     | ● File is empty  |

When an item is selected, the second column reorders so matching items align on the same row.

Works well for: error types, design patterns, technologies and their use cases.

---

### Card Triage — Sort into Buckets

A stack of incoming requests — each is a card with parameters.
Tap to sort it into one of two or three buckets.

**Request #047**
- Type: Photo
- Size: 120 GB
- Deadline: 6h

→ [ URGENT ] [ CAN WAIT ] [ REJECT ]

Each decision has consequences. Fast and intuitive by design.

---

### Find the Bug — Tap a Line

A pseudocode snippet or log is shown — tap the line where the problem is.
Each line is clickable; your choice branches the story differently.
No typing, just selection.

```
1  start_migration(archive)
2  for record in archive:
3    if record.size > 0:
4      save(record)
5  log("saved: " + record.id)  ← tap here
6  end
```

**Line 5** should be inside the `if` block — as written, it logs even empty records.

---

### Yes / No / Later — Rapid-Fire Decisions

Cards fly in one after another — swipe or tap one of three options. The pace picks up.

**Request from Marco R.**
> "Carnival photos, 1987"
- Size: 45 GB

[ YES ] [ NO ] [ LATER ]

"Later" is a valid choice — but it stacks up, and at some point time runs out.

---

### Build a Query from Blocks

Assemble a query by tapping ready-made blocks — like a constructor.
No typing, just composition.

**Available blocks:**

`SELECT *` `FROM records` `WHERE` `AND`
`year > 1940` `type = 'photo'` `ORDER BY date` `LIMIT 10`

**Your query:**

`[ ___ ]` `[ ___ ]` `[ ___ ]` `[ ___ ]`

More engaging than a quiz — and still no keyboard input.

---

### Decision Map — Clickable Graph

A dependency graph is shown — tap the node that is safe to start from without breaking anything.

```
      [Indexing]
          ↑
[Migration] ← [Validation check]
          ↑
      [Backup] ← [Data validation]
```

---

### One Tap Forward

No choices, no branching — just tap to advance to the next step.