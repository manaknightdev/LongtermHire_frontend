# End-to-End Tests with Playwright

This directory contains end-to-end tests for testing complete user flows using Playwright.

E2E tests simulate real user interactions with the application, testing the application as a whole. Playwright provides a powerful framework for browser automation and testing.

## Running Tests

To run all E2E tests:

```bash
npm run test:e2e
```

To run tests with UI mode (for debugging):

```bash
npm run test:ui
```

To run a specific test file:

```bash
npx playwright test src/test/e2e/auth/login.e2e.ts
```

## Structure

Tests are organized by feature or user flow:

```
e2e/
  auth/
    login.e2e.ts
    signup.e2e.ts
    authenticated.e2e.ts
  navigation/
    navigation.e2e.ts
  wireframe/
    wireframe.e2e.ts
  home/
    landing.e2e.ts
```

## Authentication

Some tests require authentication. The `global-setup.ts` file handles creating an authenticated state that can be used by tests.

To use the authenticated state in a test, add:

```typescript
test.use({ storageState: "./src/test/utils/adminStorageState.json" });
```

Or run tests using the authenticated project:

```bash
npx playwright test --project=authenticated
```

## Test Data

Test data and fixtures are stored in `src/test/utils/fixtures/`.

## Troubleshooting

If tests are failing due to authentication issues, you may need to update the authentication state:

1. Update the credentials in `src/test/utils/fixtures/user.fixture.ts`
2. Run the tests with `npm run test:e2e` which will regenerate the authentication state
