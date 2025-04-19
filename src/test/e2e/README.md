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

## Test Data

Test data and fixtures are stored in `src/test/utils/fixtures/`.

## Troubleshooting

If tests are failing due to authentication issues, you may need to update the authentication state:

1. Update the credentials in `src/test/utils/fixtures/user.fixture.ts`
2. Run the tests with `npm run test:e2e` which will regenerate the authentication state

## Using AI to Write E2E Tests

To streamline the development process, we encourage using AI to help write e2e tests. This guide provides strategies for effectively prompting AI to generate high-quality Playwright tests.

### When to Use AI for Test Creation

- When implementing a new feature
- When adding test coverage for existing features
- When refactoring or updating existing tests
- When you need to test complex user flows

### How to Prompt AI for E2E Tests

Effective prompting is key to getting high-quality test code from AI. Follow these guidelines:

#### 1. Provide Context

Start by giving the AI context about your application and the specific feature you want to test:

```
I'm working on a React application with [describe key features]. I need to write Playwright e2e tests for [specific feature/flow].
```

#### 2. Describe the User Flow

Clearly describe the user flow you want to test, including:

- Starting point (e.g., which page)
- User actions (clicks, form inputs, etc.)
- Expected outcomes
- Edge cases to consider

#### 3. Share Relevant Code

Provide relevant code snippets that will help the AI understand:

- Component structure
- Element selectors (IDs, data attributes, etc.)
- Existing test patterns in your project

#### 4. Specify Test Structure

Request tests that follow our project's structure and conventions:

```
Please structure the test following our project conventions:
- Use the test.describe() pattern
- Place tests in the appropriate directory (e.g., src/test/e2e/[feature])
- Follow the naming convention: [feature].e2e.ts
- Use our test constants from src/test/utils/setup.ts
- Use fixtures from src/test/utils/fixtures/ when appropriate
```

### Example Prompt Template

Here's a template you can use as a starting point:

```
I need to write Playwright e2e tests for [feature] in our React application.

Feature description:
[Describe what the feature does and its importance]

User flow to test:
1. [First step]
2. [Second step]
3. [Expected outcome]

Edge cases to consider:
- [Edge case 1]
- [Edge case 2]

Relevant component code:
[Paste relevant component code]

Please create a Playwright test that:
- Uses our test.describe() pattern
- Follows our project structure (src/test/e2e/[feature]/[feature].e2e.ts)
- Uses our test constants from TEST_CONSTANTS
- Handles authentication if needed
- Includes appropriate assertions
- Follows best practices for selector stability
```

### Reviewing and Refining AI-Generated Tests

After receiving the AI-generated test, review it carefully:

1. **Check selectors**: Ensure selectors are robust and won't break with minor UI changes
2. **Verify assertions**: Confirm all important outcomes are properly asserted
3. **Test for flakiness**: Run the test multiple times to ensure it's stable
4. **Optimize waiting**: Use appropriate waiting strategies to avoid flaky tests
5. **Add comments**: Add explanatory comments for complex sections

### Best Practices for E2E Tests

- **Keep tests independent**: Each test should be able to run on its own
- **Use data attributes for selectors**: Add `data-testid` attributes to make selectors more robust
- **Test from the user's perspective**: Focus on what the user sees and does
- **Don't test implementation details**: Test behavior, not how it's implemented
- **Use appropriate waiting strategies**: Avoid fixed timeouts when possible
- **Take screenshots on failure**: Enable screenshot capture for failed tests
- **Group related tests**: Use test.describe() to group related tests

### Example: Authentication Test

Here's an example of how to prompt AI for an authentication test:

```
I need a Playwright e2e test for the login flow in our React application.

The login page is at /admin/login and has:
- Email input field with placeholder "admin@mail.com"
- Password input field (type="password")
- "Sign in" button

After successful login, users should be redirected to /admin/build (dashboard).

Please create a test that:
1. Tests successful login with valid credentials
2. Tests failed login with invalid credentials
3. Verifies appropriate error messages
4. Follows our project structure and conventions

Use our test constants (TEST_CONSTANTS) and user fixtures (TEST_USERS) from the utils directory.
```

### Maintaining Tests

As your application evolves, maintain your tests by:

1. Regularly running the full test suite
2. Updating tests when UI or functionality changes
3. Refactoring tests to reduce duplication
4. Using AI to help update and refactor tests

By following these guidelines, you can effectively use AI to create and maintain high-quality e2e tests that ensure your application works correctly from the user's perspective.
