import { test, expect } from "@playwright/test";
import { setupSupabaseMocks } from "./helpers/supabase-mock";

test.describe("Public profile page", () => {
  test("shows a user's profile without being logged in", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/friend1");

    await expect(page.getByText("Friend One")).toBeVisible();
    await expect(page.getByText("@friend1", { exact: true })).toBeVisible();
    await expect(page.getByText("Lisbon, Portugal")).toBeVisible();
  });

  test("shows profile details like birthday and zodiac", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/testuser");

    await expect(page.getByText("Madrid, España")).toBeVisible();
    await expect(page.getByText("Géminis")).toBeVisible();
  });

  test("shows favorite colors from preferences", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/testuser");

    await expect(page.getByText("Red")).toBeVisible();
    await expect(page.getByText("Blue")).toBeVisible();
    await expect(page.getByText("Favorites")).toBeVisible();
  });

  test("shows an error for an unknown username", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/nobody");

    await expect(page.getByText("This user doesn't exist")).toBeVisible();
  });

  test("back button on a direct visit goes to the app home", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/friend1");

    await page.getByRole("button").first().click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
