/**
 * Common setup for tests
 */

// Global setup for tests
export const setupTests = async () => {
  // Add any global setup here
};

// Global teardown for tests
export const teardownTests = async () => {
  // Add any global teardown here
};

// Test constants
export const TEST_CONSTANTS = {
  TIMEOUT: {
    SHORT: 5000,
    MEDIUM: 15000,
    LONG: 30000,
  },
  ROUTES: {
    HOME: "/",
    LOGIN: "/admin/login",
    SIGNUP: "/admin/sign-up",
    DASHBOARD: "/admin/build",
    PROFILE: "/admin/profile",
  },
};
