import { test, expect } from "@playwright/test";
import { injectSession, setupSupabaseMocks, defaultDB } from "./helpers/supabase-mock";

test.describe("Authenticated navigation", () => {
  test("navbar renders with all five destinations", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
    // Icons: Home, Users, Plus, Heart, User
    await expect(nav.locator("a").filter({ has: page.locator("svg") })).toHaveCount(4);
    await expect(nav.locator("button").filter({ has: page.locator("svg") })).toHaveCount(1);
  });

  test("clicking each navbar link navigates to its route", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    // Home is default
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "My Voglios" })).toBeVisible();

    // Friends
    await page.locator('a[href="/friends"]').click();
    await expect(page).toHaveURL(/\/friends$/);

    // Saved
    await page.locator('a[href="/bookmarked"]').click();
    await expect(page).toHaveURL(/\/bookmarked$/);

    // Account
    await page.locator('a[href="/account"]').click();
    await expect(page).toHaveURL(/\/account$/);

    // Back home
    await page.locator('a[href="/"]').click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("create button opens the CreateDialog", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await page.locator("nav button").filter({ hasText: "" }).first().click();
    await expect(page.getByText("Create new")).toBeVisible();
    await expect(page.getByRole("button", { name: /New category/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /New voglio/ })).toBeVisible();
  });

  test("Collections page shows category grid and count", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "My Voglios" })).toBeVisible();
    await expect(page.getByText("Birthday", { exact: true })).toBeVisible();
    await expect(page.getByText("Christmas", { exact: true })).toBeVisible();
    // voglio count on Birthday card = 2
    await expect(page.getByText("2 voglios")).toBeVisible();
  });

  test("clicking a category navigates to its detail page", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await page.getByText("Birthday", { exact: true }).click();
    await expect(page).toHaveURL(/\/category\/1$/);
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("bottom navbar is fully visible on mobile", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
    const box = await nav.boundingBox();
    expect(box).not.toBeNull();
    // Must be within viewport width
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });

  test("create dialog opens as mobile sheet on small screens", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await page.locator("nav button").filter({ has: page.locator("svg") }).first().click();
    // MobileSheet uses vaul drawer - check content is visible
    await expect(page.getByText("Create new")).toBeVisible();
    await expect(page.getByText("Create a category for your wishes")).toBeVisible();
  });

  test("no horizontal overflow on collections page", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflowX).toBeLessThanOrEqual(0);
  });
});
