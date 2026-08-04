import { test, expect, Page } from "@playwright/test";
import { injectSession, setupSupabaseMocks, defaultDB } from "./helpers/supabase-mock";

async function openCreateDialog(page: Page) {
  await page.locator("nav button").filter({ has: page.locator("svg") }).first().click();
  await expect(page.getByText("Create new")).toBeVisible();
}

async function openCategoryForm(page: Page) {
  await openCreateDialog(page);
  await page.getByText("Create a category for your wishes").click();
  await expect(page.getByPlaceholder("Name")).toBeVisible();
}

test.describe("Category form", () => {
  test("create category with valid data", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    await openCategoryForm(page);

    await page.getByPlaceholder("Name").fill("Housewarming");
    await page.getByLabel("Description").fill("New apartment gifts");
    await page.getByRole("button", { name: "Create category" }).click();

    // New card appears on collections grid
    await expect(page.getByText("Housewarming", { exact: true })).toBeVisible();
    // Verify POST body
    const created = db.categories.find((c) => c.name === "Housewarming");
    expect(created).toBeTruthy();
    expect(created!.description).toBe("New apartment gifts");
    expect(created!.emoji_code).toBe("❔");
  });

  test("shows validation error when name is empty", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await openCategoryForm(page);
    await page.getByRole("button", { name: "Create category" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
  });

  test("clears name validation error while typing", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await openCategoryForm(page);
    await page.getByRole("button", { name: "Create category" }).click();
    await expect(page.getByText("Name is required")).toBeVisible();

    await page.getByPlaceholder("Name").fill("Birthday");
    await expect(page.getByText("Name is required")).toBeHidden();
  });

  test("selecting a preset fills name and emoji", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await openCategoryForm(page);
    await page.getByRole("button", { name: "🎄 Christmas" }).click();

    await expect(page.getByPlaceholder("Name")).toHaveValue("Christmas");
    await expect(page.getByRole("button", { name: "🎄" })).toBeVisible();
  });

  test("preset selection pre-fills then create persists the preset", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    await openCategoryForm(page);
    await page.getByRole("button", { name: "🎄 Christmas" }).click();
    await page.getByRole("button", { name: "Create category" }).click();

    const created = db.categories.find((c) => c.name === "Christmas");
    expect(created).toBeTruthy();
    expect(created!.emoji_code).toBe("🎄");
  });

  test("emoji picker opens from the emoji button", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await openCategoryForm(page);
    await page.getByRole("button", { name: "❔" }).click();

    // emoji-picker-react renders a search input
    await expect(page.getByPlaceholder("Search emojis…")).toBeVisible();
  });

  test("creating a category closes the dialog and updates the grid", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    await openCategoryForm(page);
    await page.getByPlaceholder("Name").fill("Wedding");
    await page.getByRole("button", { name: "Create category" }).click();

    await expect(page.getByText("Wedding", { exact: true })).toBeVisible();
    await expect(page.getByText("Create new")).toBeHidden();
  });

  test("privacy switch toggles isPrivate on create", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    await openCategoryForm(page);
    await page.getByPlaceholder("Name").fill("Secret List");
    await page.getByRole("switch").click();
    await page.getByRole("button", { name: "Create category" }).click();

    const created = db.categories.find((c) => c.name === "Secret List");
    expect(created).toBeTruthy();
    expect(created!.is_private).toBe(true);
  });

  test("edit category pre-fills form and updates", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    // Open the Birthday category's edit menu (desktop dropdown)
    const birthdayCard = page.getByText("Birthday", { exact: true }).locator("..").locator("..").locator("..");
    await birthdayCard.locator("button").first().click();
    await page.getByRole("menuitem", { name: "Edit" }).click();

    await expect(page.getByPlaceholder("Name")).toHaveValue("Birthday");
    await expect(page.getByLabel("Description")).toHaveValue("Gifts for my birthday");

    await page.getByPlaceholder("Name").fill("Birthday Gifts 2026");
    await page.getByRole("button", { name: "Update category" }).click();

    await expect(page.getByText("Birthday Gifts 2026", { exact: true })).toBeVisible();
    const updated = db.categories.find((c) => c.id === 1);
    expect(updated!.name).toBe("Birthday Gifts 2026");
  });

  test("delete category asks for confirmation and removes card", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    page.on("dialog", (dialog) => dialog.accept());

    const birthdayCard = page.getByText("Birthday", { exact: true }).locator("..").locator("..").locator("..");
    await birthdayCard.locator("button").first().click();
    await page.getByRole("menuitem", { name: "Delete" }).click();

    await expect(page.getByText("Birthday", { exact: true })).toBeHidden();
    expect(db.categories.find((c) => c.id === 1)).toBeUndefined();
  });
});
