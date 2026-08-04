import { test, expect } from "@playwright/test";
import { injectSession, setupSupabaseMocks, defaultDB, TEST_FRIEND_ID, TEST_USER_ID } from "./helpers/supabase-mock";

function bookmarkedDB() {
  const db = defaultDB();
  db.categories.push({
    id: 20,
    name: "Gifts",
    description: "",
    emoji_code: "🎁",
    is_private: false,
    user_id: TEST_FRIEND_ID,
  });
  db.voglios.push({
    id: 50,
    name: "Wireless Headphones",
    notes: "",
    price: 200,
    category_id: 20,
    reference_link: "",
    size_id: null,
    image_url: null,
    quantity: 1,
    is_private: false,
    is_taken: false,
    user_id: TEST_FRIEND_ID,
  });
  db.taken.push({ voglio_id: 50, user_id: TEST_USER_ID, created_at: "2026-01-01T00:00:00.000Z" });
  return db;
}

test.describe("Bookmarked page", () => {
  test("shows empty state when nothing is bookmarked", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/bookmarked");

    await expect(page.getByText("Saved items").first()).toBeVisible();
    await expect(page.getByText("No saved items yet")).toBeVisible();
    await expect(page.getByRole("button", { name: "Find friends" })).toBeVisible();
  });

  test("shows bookmarked items with owner and category link", async ({ page }) => {
    const db = bookmarkedDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/bookmarked");

    await expect(page.getByText("Wireless Headphones")).toBeVisible();
    await expect(page.getByText("@friend1", { exact: true })).toBeVisible();
    await expect(page.getByText("Gifts")).toBeVisible();
  });

  test("unmarking a saved item removes it from the list", async ({ page }) => {
    const db = bookmarkedDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/bookmarked");

    await expect(page.getByText("Wireless Headphones")).toBeVisible();

    // Open the detail dialog and unmark it
    await page.getByText("Wireless Headphones").click();
    await page.getByRole("button", { name: "Taken" }).click();

    await expect(page.getByText("No saved items yet")).toBeVisible();
    expect(db.taken.filter((t) => t.voglio_id === 50).length).toBe(0);
  });

  test("navigating to find friends goes to friends page", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/bookmarked");

    await page.getByRole("button", { name: "Find friends" }).click();
    await expect(page).toHaveURL(/\/friends$/);
  });
});

test.describe("Bookmarked page (mobile)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("no horizontal overflow", async ({ page }) => {
    const db = bookmarkedDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/bookmarked");

    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflowX).toBeLessThanOrEqual(0);
  });
});
