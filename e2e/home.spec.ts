import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("loads successfully and shows hero section", async ({ page }) => {
    await page.goto("/");
    
    // Check page title
    await expect(page).toHaveTitle(/Meghduth Design Studio/);
    
    // Check hero section is visible
    await expect(page.locator("h1")).toBeVisible();
    
    // Check navigation is present
    await expect(page.locator("nav")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    
    // Click on Services link
    await page.click('a[href="/services"]');
    await expect(page).toHaveURL(/.*services/);
    await expect(page.locator("h1")).toBeVisible();
    
    // Click on Projects link
    await page.click('a[href="/projects"]');
    await expect(page).toHaveURL(/.*projects/);
    
    // Click on Team link
    await page.click('a[href="/team"]');
    await expect(page).toHaveURL(/.*team/);
    
    // Click on Contact link
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL(/.*contact/);
  });
});

test.describe("Admin Login", () => {
  test("redirects to login when accessing admin without auth", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/.*admin\/login/);
  });

  test("shows login form", async ({ page }) => {
    await page.goto("/admin/login");
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});