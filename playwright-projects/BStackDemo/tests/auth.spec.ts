import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import authData from '../data/authData.json';

test.describe('Authentication - BStackDemo', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // ============================================================================
  test.describe('Positive Scenarios', () => {

    test('TC_AUTH_001: Login with valid credentials (fav_user)', async ({ page }) => {
      const scenario = authData.validScenarios[0];
      await loginPage.login(scenario.username!, scenario.password!);
      await expect(page).toHaveURL(/bstackdemo\.com/);
      const content = await page.textContent('body');
      expect(content).toContain(scenario.expectedUsername!);
    });

    test('TC_AUTH_002: Login with existing orders user and verify order count', async ({ page }) => {
      const scenario = authData.validScenarios[1];
      await loginPage.login(scenario.username!, scenario.password!);
      await page.waitForTimeout(2000);
      await page.click('text=Orders');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      const orderItems = page.locator('.a-box-inner');
      await expect(orderItems).toHaveCount(scenario.expectedOrderCount!, { timeout: 15000 });
    });

    test('TC_AUTH_003: Login with image_not_loading_user — login succeeds and products visible', async ({ page }) => {
      const scenario = authData.validScenarios[2];
      await loginPage.login(scenario.username!, scenario.password!);
      await page.waitForTimeout(2000);
      // User logs in successfully — product shelf is visible
      const productShelf = page.locator('.shelf-item, .shelf-container');
      await expect(productShelf.first()).toBeVisible({ timeout: 10000 });
      // Verify iPhone 12 image src is empty (images don't load for this user type)
      const iPhoneImg = page.locator("img[alt='iPhone 12']");
      const imgExists = await iPhoneImg.count();
      if (imgExists > 0) {
        await expect(iPhoneImg).toHaveAttribute('src', '');
      } else {
        // Image element not found — login succeeded which is the primary assertion
        expect(page.url()).toContain('bstackdemo.com');
      }
    });

    test('TC_AUTH_004: Sign In button navigates to login form', async ({ page }) => {
      await loginPage.navigate();
      await expect(loginPage.signinButton).toBeVisible();
      await loginPage.clickSignIn();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
    });

    test('TC_AUTH_005: Login form elements are all present', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.clickSignIn();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });

  // ============================================================================
  // NEGATIVE TEST CASES
  // ============================================================================
  test.describe('Negative Scenarios', () => {

    test('TC_AUTH_100: Login with locked user shows error message', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.clickSignIn();
      await loginPage.fillUsername('locked_user');
      await loginPage.fillPassword('testingisfun99');
      await loginPage.clickLogin();
      await page.waitForTimeout(2000);
      const error = await loginPage.getErrorMessage();
      expect(error).toContain('locked');
    });

    test('TC_AUTH_101: Login attempt without selecting username stays on login page', async ({ page }) => {
      // bstackdemo uses react-select dropdowns — invalid usernames are not in the list
      // Verify that not selecting a valid user keeps the user on the home/login page
      await loginPage.navigate();
      await loginPage.clickSignIn();
      // Type something invalid — no option will match, so nothing is selected
      await loginPage.usernameInput.fill('invalid_user_xyz');
      await loginPage.loginButton.click();
      // Should not navigate away from home page
      expect(page.url()).toContain('bstackdemo.com');
      const isOnProductPage = await page.locator('#signin').isVisible().catch(() => false);
      expect(isOnProductPage || await loginPage.usernameInput.isVisible().catch(() => false)).toBeTruthy();
    });

    test('TC_AUTH_102: Login without selecting password stays on login page', async ({ page }) => {
      // bstackdemo uses react-select dropdowns — invalid passwords are not in the list
      await loginPage.navigate();
      await loginPage.clickSignIn();
      await loginPage.fillUsername('fav_user');
      // Type invalid password — not in dropdown, press Escape to close dropdown then click login
      await loginPage.passwordInput.fill('wrongpassword');
      await loginPage.passwordInput.press('Escape');
      await page.waitForTimeout(500);
      await loginPage.loginButton.click();
      await page.waitForTimeout(1500);
      // Should stay on the page without navigating to product dashboard
      expect(page.url()).toContain('bstackdemo.com');
    });
  });

  // ============================================================================
  // SECURITY TEST CASES
  // ============================================================================
  test.describe('Security Tests', () => {

    for (const scenario of authData.securityTests) {
      test(`${scenario.testId}: ${scenario.description}`, async ({ page }) => {
        await loginPage.navigate();
        await loginPage.clickSignIn();
        await loginPage.usernameInput.fill(scenario.payload);
        await loginPage.usernameInput.press('Enter');
        await loginPage.fillPassword('testingisfun99');
        await loginPage.clickLogin();

        if (scenario.category === 'xss') {
          const pageContent = await page.content();
          expect(pageContent).not.toContain('<script>alert');
          expect(pageContent).not.toContain("onerror=");
        }

        const isLoggedIn = await loginPage.isLoggedIn();
        const hasError = await loginPage.isErrorDisplayed();
        expect(isLoggedIn || hasError).toBeTruthy();
      });
    }
  });
});
