import { defineConfig, devices } from '@playwright/test'

/**
 * E2E test config — runs the full graph (every stage × every choice × every
 * task variant) against `npm run dev` (vite dev server on :5173).
 *
 * Single-worker by design: the test fans out via isolated browser contexts,
 * and per-workspace parallel runs would multiply the dev-server load without
 * buying us faster wall time (each branch of the graph needs its own clean
 * state-machine snapshot).
 *
 * `webServer` brings up `npm run dev` automatically. In CI it always starts
 * fresh; locally it reuses an already-running dev server if any.
 */
export default defineConfig({
  testDir: './tests/e2e',
  // graph tests fan out via isolated contexts inside one test, not via many
  // parallel tests — single worker keeps logs readable and screenshots stable.
  fullyParallel: false,
  workers: 1,
  // generous per-test budget: some branches click through ~20 tasks
  // Greedy walk can be slow: ~30 stages × 5–8s of dialogue typewriter per
  // stage. 10 minutes gives it headroom while still failing fast on real hangs.
  timeout: 600_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: './tests/e2e/.cache/test-results',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})