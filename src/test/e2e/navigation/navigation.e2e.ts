import { test, expect } from "@playwright/test";
import { TEST_CONSTANTS } from "../../utils/setup";
import { TEST_USERS } from "../../utils/fixtures/user.fixture";

test.describe("Navigation", () => {
  test("should navigate to login page", async ({ page }) => {
    // Navigate to the login page
    await page.goto(TEST_CONSTANTS.ROUTES.LOGIN);

    // Check if redirected to login page
    await expect(page).toHaveURL(new RegExp(TEST_CONSTANTS.ROUTES.LOGIN));
  });

  test("should navigate between pages in authenticated area", async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto(TEST_CONSTANTS.ROUTES.LOGIN);

    // Login first
    await page.getByPlaceholder(/admin@mail.com/i).fill(TEST_USERS.ADMIN.email);

    // Find password field - it's inside a div with a password label
    const passwordField = page.locator('input[type="password"]');
    await passwordField.fill(TEST_USERS.ADMIN.password);

    // Submit the form - be more specific with the selector
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    // Wait for dashboard to load
    await expect(page).toHaveURL(new RegExp(TEST_CONSTANTS.ROUTES.DASHBOARD), {
      timeout: TEST_CONSTANTS.TIMEOUT.MEDIUM,
    });

    // Click the profile menu button using the aria-label
    await page.locator('button[id="menu-toggle-btn"]').click();
    console.log("Menu Button Clicked >>");

    // Click the Account button within Menu.Items
    await page.locator('button[name="profile-btn"]').click();
    console.log("Profile Button Clicked >>");
    await expect(page).toHaveURL(new RegExp(TEST_CONSTANTS.ROUTES.PROFILE));

    // Navigate back to dashboard using NavLink
    await page.getByLabel("/admin/build").click();
    console.log("Dashboard Link Clicked >>");

    // Wait for dashboard to load
    await expect(page).toHaveURL(new RegExp(TEST_CONSTANTS.ROUTES.DASHBOARD));
  });

  test("should logout successfully", async ({ page }) => {
    // Navigate to the login page
    await page.goto(TEST_CONSTANTS.ROUTES.LOGIN);
    // "http://127.0.0.1:3002" +

    // Login first
    await page.getByPlaceholder(/admin@mail.com/i).fill(TEST_USERS.ADMIN.email);

    // Find password field - it's inside a div with a password label
    const passwordField = page.locator('input[type="password"]');
    await passwordField.fill(TEST_USERS.ADMIN.password);

    // Submit the form - be more specific with the selector
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    // Wait for dashboard to load
    await expect(page).toHaveURL(new RegExp(TEST_CONSTANTS.ROUTES.DASHBOARD), {
      timeout: TEST_CONSTANTS.TIMEOUT.MEDIUM,
    });

    // Click the profile menu button using the aria-label
    await page.locator('button[id="menu-toggle-btn"]').click();
    console.log("Menu Button Clicked >>");

    // Find and click the logout button
    await page.locator('button[name="logout-btn"]').click();
    console.log("Logout Button Clicked >>");

    // Check if redirected to login page
    await expect(page).toHaveURL(new RegExp(TEST_CONSTANTS.ROUTES.LOGIN));
  });
});
