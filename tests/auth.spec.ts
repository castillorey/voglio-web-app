import { test, expect } from "@playwright/test";
import { setupSupabaseMocks } from "./helpers/supabase-mock";

test.describe("Auth pages (desktop)", () => {
  test("renders login page with title, fields and links", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "voglio" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });

  test("requires email and password (browser validation blocks submit)", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/login");

    const email = page.getByLabel("Email");
    const password = page.getByLabel("Password");

    // Submit with empty form
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(email).toHaveAttribute("required", "");
    await expect(password).toHaveAttribute("required", "");

    // Submit with only email
    await email.fill("test@voglio.app");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(password).toHaveAttribute("required", "");
  });

  test("shows error message on invalid credentials", async ({ page }) => {
    await setupSupabaseMocks(page, undefined, { failLogin: true });
    await page.goto("/login");

    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid login credentials")).toBeVisible();
  });

  test("successful login redirects to home", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/login");

    await page.getByLabel("Email").fill("test@voglio.app");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "My Voglios" })).toBeVisible();
  });

  test("renders register page and links back to login", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/register");

    await expect(page.getByRole("button", { name: "Create your account" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create your account" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("register shows success message", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/register");

    await page.getByLabel("Email").fill("new@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create your account" }).click();

    await expect(page.getByText("Account created! Check your email.")).toBeVisible();
  });

  test("register shows error for existing user", async ({ page }) => {
    await setupSupabaseMocks(page, undefined, { failSignup: true });
    await page.goto("/register");

    await page.getByLabel("Email").fill("taken@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create your account" }).click();

    await expect(page.getByText(/A user with this email address/)).toBeVisible();
  });

  test("unauthenticated user visiting / is redirected to /login", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("unknown route shows 404 page", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/this/route/does/not/exist");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});

test.describe("Auth pages (mobile)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("login form fits mobile viewport without horizontal overflow", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/login");

    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflowX).toBeLessThanOrEqual(0);

    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("register form works on mobile", async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto("/register");

    await page.getByLabel("Email").fill("mobile@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create your account" }).click();

    await expect(page.getByText("Account created! Check your email.")).toBeVisible();
  });
});
