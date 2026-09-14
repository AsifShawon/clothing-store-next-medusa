import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["json", { outputFile: "test-results.json" }]],
  use: {
    baseURL: "http://localhost:8000",
    trace: "on-first-retry",
    bypassCSP: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"], viewport: { width: 375, height: 667 } },
    },
  ],
  webServer: [
    {
      command: "node e2e/test-fixture-server.ts",
      port: 9000,
      reuseExistingServer: true,
      timeout: 15000,
    },
    {
      command: "next dev -p 8000",
      port: 8000,
      reuseExistingServer: true,
      timeout: 60000,
      env: {
        NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: "pk_test_ci_e2e_key",
        NEXT_PUBLIC_MEDUSA_BACKEND_URL: "http://localhost:9000",
        MEDUSA_BACKEND_URL: "http://localhost:9000",
        NEXT_PUBLIC_BASE_URL: "http://localhost:8000",
      },
    },
  ],
})
