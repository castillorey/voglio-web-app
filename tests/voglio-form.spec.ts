import { test, expect, Page } from "@playwright/test";
import { injectSession, setupSupabaseMocks, defaultDB } from "./helpers/supabase-mock";

const SEARCH_RESULTS = [
  {
    title: "Ergonomic Office Chair",
    price: "$299.99",
    link: "https://example.com/chair",
    thumbnail: "https://example.com/chair.jpg",
    source: "Google Shopping",
    description: "Adjustable ergonomic chair",
  },
];

async function openCreateDialog(page: Page) {
  await page.locator("nav button").filter({ has: page.locator("svg") }).first().click();
  await expect(page.getByText("Create new")).toBeVisible();
}

async function openVoglioForm(page: Page) {
  await openCreateDialog(page);
  await page.getByText("Add a wishlist item to a category").click();
  await expect(page.getByPlaceholder("Search Google Shopping...")).toBeVisible();
}

test.describe("Voglio form wizard", () => {
  test("wizard shows three steps and starts on step 1", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await openVoglioForm(page);
    await expect(page.getByText("Search for a product to get started, or skip and fill in details manually")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
    // No previous button on step 1
    await expect(page.getByRole("button", { name: "Previous" })).toBeHidden();
  });

  test("search is disabled with empty query", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await openVoglioForm(page);
    const searchButton = page.locator("form button[type='button']").filter({ has: page.locator("svg") }).first();
    await expect(searchButton).toBeDisabled();
  });

  test("search returns results and shows empty state when none", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db, { searchResults: SEARCH_RESULTS });
    await page.goto("/");

    await openVoglioForm(page);
    await page.getByPlaceholder("Search Google Shopping...").fill("office chair");
    await page.getByPlaceholder("Search Google Shopping...").press("Enter");

    await expect(page.getByText("Ergonomic Office Chair")).toBeVisible();
    await expect(page.getByText("$299.99")).toBeVisible();
  });

  test("search with no results shows empty message", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page, undefined, { searchResults: [] });
    await page.goto("/");

    await openVoglioForm(page);
    await page.getByPlaceholder("Search Google Shopping...").fill("zzzznothing");
    await page.getByPlaceholder("Search Google Shopping...").press("Enter");

    await expect(page.getByText("No products found. Try a different search.")).toBeVisible();
  });

  test("selecting a product result advances to step 2 and pre-fills fields", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db, { searchResults: SEARCH_RESULTS });
    await page.goto("/");

    await openVoglioForm(page);
    await page.getByPlaceholder("Search Google Shopping...").fill("office chair");
    await page.getByPlaceholder("Search Google Shopping...").press("Enter");
    await page.getByText("Ergonomic Office Chair").click();

    // Step 2: title pre-filled from product
    await expect(page.getByLabel("Title")).toHaveValue("Ergonomic Office Chair");
    await expect(page.getByLabel("Description")).toHaveValue("Adjustable ergonomic chair");
    await expect(page.getByLabel("Reference link")).toHaveValue("https://example.com/chair");
  });

  test("step 2 title validation blocks Next", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await openVoglioForm(page);
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Title is required")).toBeVisible();
  });

  test("manual entry: fill title, description, link then create voglio", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    await openVoglioForm(page);
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByLabel("Title").fill("Lego Set 10300");
    await page.getByLabel("Reference link").fill("https://lego.com/10300");
    await page.getByRole("button", { name: "Add description" }).click();
    await page.getByLabel("Description").fill("Back to the Future DeLorean");
    await page.getByRole("button", { name: "Next" }).click();

    // Step 3: select category
    await expect(page.getByLabel("Category")).toBeVisible();
    await page.getByLabel("Category").click();
    await page.getByRole("option", { name: "Birthday" }).click();

    await page.getByRole("button", { name: "Create voglio" }).click();

    // Dialog closes, navigates to category detail
    await expect(page).toHaveURL(/\/category\/1$/);
    const created = db.voglios.find((v) => v.name === "Lego Set 10300");
    expect(created).toBeTruthy();
    expect(created!.category_id).toBe(1);
    expect(created!.reference_link).toBe("https://lego.com/10300");
    expect(created!.notes).toBe("Back to the Future DeLorean");
  });

  test("step 3 requires a category before creating", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    await openVoglioForm(page);
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByLabel("Title").fill("A Wish Without Category");
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByRole("button", { name: "Create voglio" }).click();
    await expect(page.getByText("Category is required")).toBeVisible();
    expect(db.voglios.find((v) => v.name === "A Wish Without Category")).toBeUndefined();
  });

  test("back button navigates to previous step", async ({ page }) => {
    await injectSession(page);
    await setupSupabaseMocks(page);
    await page.goto("/");

    await openVoglioForm(page);
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByLabel("Title")).toBeVisible();

    await page.getByRole("button", { name: "Previous" }).click();
    await expect(page.getByPlaceholder("Search Google Shopping...")).toBeVisible();
  });

  test("private switch and price/quantity options work on step 3", async ({ page }) => {
    const db = defaultDB();
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    await openVoglioForm(page);
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByLabel("Title").fill("Private Gift");
    await page.getByRole("button", { name: "Next" }).click();

    // More options reveal price + quantity
    await page.getByRole("button", { name: "More options" }).click();
    await page.getByLabel("Price").fill("59.99");
    await page.getByRole("switch").click(); // private

    // Quantity stepper: start at 1, press plus twice
    await page.getByRole("button", { name: "Next" }).isVisible(); // wait rendered
    await page.locator("form").getByRole("button").filter({ has: page.locator("svg") }).last().click();
    await page.locator("form").getByRole("button").filter({ has: page.locator("svg") }).last().click();

    await page.getByLabel("Category").click();
    await page.getByRole("option", { name: "Birthday" }).click();
    await page.getByRole("button", { name: "Create voglio" }).click();

    const created = db.voglios.find((v) => v.name === "Private Gift");
    expect(created).toBeTruthy();
    expect(created!.is_private).toBe(true);
    expect(created!.price).toBe(59.99);
    expect(created!.quantity).toBe(3);
  });

  test("quick-create category inside voglio form", async ({ page }) => {
    const db = defaultDB();
    db.categories = []; // no categories yet
    await injectSession(page);
    await setupSupabaseMocks(page, db);
    await page.goto("/");

    await openVoglioForm(page);
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByLabel("Title").fill("New Year Wish");
    await page.getByRole("button", { name: "Next" }).click();

    // No categories -> "Create a category" button appears
    await expect(page.getByText("You don't have any categories yet")).toBeVisible();
    await page.getByRole("button", { name: "Create a category" }).click();

    await page.getByPlaceholder("Category name").fill("New Year");
    await page.getByRole("button", { name: "Create", exact: true }).click();

    // Category now selected and visible in select
    await page.getByLabel("Category").click();
    await page.getByRole("option", { name: "New Year" }).click();

    await page.getByRole("button", { name: "Create voglio" }).click();

    const createdCat = db.categories.find((c) => c.name === "New Year");
    expect(createdCat).toBeTruthy();
    const created = db.voglios.find((v) => v.name === "New Year Wish");
    expect(created).toBeTruthy();
    expect(created!.category_id).toBe(createdCat!.id);
  });
});
