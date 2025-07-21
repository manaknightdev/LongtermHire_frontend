# Testing Structure

This directory contains all tests for the application, organized by test type:

- `unit/`: Unit tests for individual components and functions
- `integration/`: Integration tests for testing interactions between components
- `e2e/`: End-to-end tests for testing complete user flows using Playwright

## Running Tests

To run tests, use the appropriate npm script:

- E2E tests: `npm run test:e2e`
- Unit tests: `npm run test:unit` (to be implemented)
- Integration tests: `npm run test:integration` (to be implemented)

## Test Structure

Each test file should follow the naming convention:

- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.spec.ts` or `*.spec.tsx`
- E2E tests: `*.e2e.ts` or `*.e2e.tsx`
