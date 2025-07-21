import { test, expect } from "@playwright/test";
import { TEST_USERS } from "../../utils/fixtures/user.fixture";
import { TEST_CONSTANTS } from "../../utils/setup";

test.describe("Authentication", () => {
  test("should display login form", async ({ page }) => {
    // Navigate to the login page
    await page.goto(TEST_CONSTANTS.ROUTES.LOGIN);

    // Check if the login form is displayed
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page.getByPlaceholder(/admin@mail.com/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign in", exact: true })
    ).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    // Navigate to the login page
    await page.goto(TEST_CONSTANTS.ROUTES.LOGIN);

    // Fill in the login form with invalid credentials
    await page
      .getByPlaceholder(/admin@mail.com/i)
      .fill(TEST_USERS.INVALID.email);

    // Find password field - it's inside a div with a password label
    const passwordField = page.locator('input[type="password"]');
    await passwordField.fill(TEST_USERS.INVALID.password);

    // Submit the form - be more specific with the selector
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    // Check if error message is displayed - adjust based on actual error message
    // Use a more specific selector to avoid matching multiple elements
    await expect(
      page
        .locator("p.text-field-error")
        .filter({ hasText: /invalid credentials/i })
        .first()
    ).toBeVisible({ timeout: TEST_CONSTANTS.TIMEOUT.MEDIUM });
  });

  test("should redirect to dashboard after successful login", async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto(TEST_CONSTANTS.ROUTES.LOGIN);

    // Fill in the login form with valid credentials
    await page.getByPlaceholder(/admin@mail.com/i).fill(TEST_USERS.ADMIN.email);

    // Find password field - it's inside a div with a password label
    const passwordField = page.locator('input[type="password"]');
    await passwordField.fill(TEST_USERS.ADMIN.password);

    // Submit the form - be more specific with the selector
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    // Check if redirected to dashboard
    await expect(page).toHaveURL(new RegExp(TEST_CONSTANTS.ROUTES.DASHBOARD), {
      timeout: TEST_CONSTANTS.TIMEOUT.MEDIUM,
    });
  });
});
