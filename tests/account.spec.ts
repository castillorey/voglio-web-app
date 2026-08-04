import { test, expect } from "@playwright/test";
import { injectSession, setupSupabaseMocks, defaultDB, TEST_USERNAME } from "./helpers/supabase-mock";

test.describe("Account page", () => {
  test("shows profile display with data", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/account");

    await expect(page.getByText(`@${TEST_USERNAME}`)).toBeVisible();
    await expect(page.getByText("Test User")).toBeVisible();
    await expect(page.getByText("Gemini").first()).toBeVisible();
    await expect(page.getByText("1 Following")).toBeVisible();
    await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();
  });

  test("edits display name and saves", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/account");

    await page.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByText("Edit profile")).toBeVisible();

    const nameInput = page.getByLabel("Display name");
    await nameInput.fill("New Name");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Edit profile")).not.toBeVisible();
    await expect(page.getByText("New Name")).toBeVisible();
  });

  test("cancel edit returns to display without saving", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/account");

    await page.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Display name").fill("Should Not Persist");
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(page.getByText("Should Not Persist")).not.toBeVisible();
    await expect(page.getByText("Test User")).toBeVisible();
  });

  test("language switcher changes UI language", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/account");

    await page.getByRole("button", { name: "ES" }).click();
    await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();

    await page.getByRole("button", { name: "PT" }).click();
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
  });

  test("sign out redirects to login", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/account");

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("account page without profile shows onboarding", async ({ page }) => {
    const db = defaultDB();
    db.profiles = [];
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/account");

    await expect(page.getByText("Welcome to your profile")).toBeVisible();
    await page.getByLabel("Display name").fill("My Name");
    await page.getByRole("button", { name: "Create profile" }).click();

    await expect(page.getByText("@my_name")).toBeVisible();
  });
});

test.describe("Account page (mobile)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("no horizontal overflow", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/account");

    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflowX).toBeLessThanOrEqual(0);
  });
});
