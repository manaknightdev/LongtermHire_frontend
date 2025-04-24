import { defineConfig, devices } from "@playwright/test";
import path from "path";

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "src/test/e2e",
  testMatch: "**/*.e2e.ts",
  /* Maximum time one test can run for */
  timeout: 360 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met
     */
    timeout: 300000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], ["list"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: "http://localhost:3002",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Capture screenshot on failure */
    screenshot: "only-on-failure",
  },

  /* Global setup to run before all tests */
  globalSetup: path.join(__dirname, "src/test/e2e/global-setup.ts"),

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    // {
    //   name: "authenticated",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     storageState: "./src/test/utils/adminStorageState.json",
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev:test",
    url: "http://localhost:3002",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 300000, // Increase timeout to 2 minutes
  },
});
