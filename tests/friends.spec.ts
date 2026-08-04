import { test, expect } from "@playwright/test";
import { injectSession, setupSupabaseMocks, defaultDB } from "./helpers/supabase-mock";

test.describe("Friends page", () => {
  test("shows tabs and following list by default", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/friends");

    await expect(page.getByRole("button", { name: "Following" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Followers" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Find" })).toBeVisible();

    // Default tab is Following - friend1 is followed by default
    await expect(page.getByText("@friend1")).toBeVisible();
  });

  test("switching to followers tab shows follower list", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/friends");

    await page.getByRole("button", { name: "Followers" }).click();
    // In default DB the current user has no followers
    await expect(page.getByText("No friends found")).toBeVisible();
  });

  test("find tab searches and shows results", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/friends");

    await page.getByPlaceholder("Search friends...").fill("friend");
    await page.getByPlaceholder("Search friends...").press("Enter");

    await expect(page.getByText("@friend1")).toBeVisible();
  });

  test("search with no matches shows empty state", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/friends");

    await page.getByPlaceholder("Search friends...").fill("zzzznobody");
    await page.getByPlaceholder("Search friends...").press("Enter");

    await expect(page.getByText("No friends found")).toBeVisible();
    await expect(page.getByText("Try a different search or explore other tabs.")).toBeVisible();
  });

  test("follow button toggles to unfollow and shows toast", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/friends");

    // friend1 is followed by default in the Following tab
    await expect(page.getByRole("button", { name: "Following" }).first()).toBeVisible();
    // Second match is the "Following" button on friend1's profile card
    await page.getByRole("button", { name: "Following" }).nth(1).click();

    await expect(page.getByText("You unfollowed @friend1")).toBeVisible();
    // Follows row removed from DB
    expect(db.follows.find((f) => f.following_id === "00000000-0000-0000-0000-000000000002")).toBeUndefined();
  });

  test("clicking a profile card navigates to the user collections page", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/friends");

    await page.getByText("@friend1").click();
    await expect(page).toHaveURL(/\/friends\/u\/friend1$/);
  });
});

test.describe("Friends page (mobile)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("tabs row scrolls horizontally without breaking layout", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/friends");

    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflowX).toBeLessThanOrEqual(0);

    await expect(page.getByRole("button", { name: "Find" })).toBeVisible();
  });
});
