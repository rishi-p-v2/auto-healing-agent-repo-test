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
      await page.click('text=Orders');
      await page.waitForLoadState('networkidle');
      const orderItems = page.locator('.a-box-inner');
      await expect(orderItems).toHaveCount(scenario.expectedOrderCount!);
    });

    test('TC_AUTH_003: Login with image_not_loading_user — product images have empty src', async ({ page }) => {
      const scenario = authData.validScenarios[2];
      await loginPage.login(scenario.username!, scenario.password!);
      const img = page.locator("img[alt='iPhone 12']");
      await expect(img).toHaveAttribute('src', '');
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

    test('TC_AUTH_100: Login with locked user shows error', async ({ page }) => {
      const scenario = authData.invalidScenarios[0];
      await loginPage.login(scenario.username, scenario.password);
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const error = await loginPage.getErrorMessage();
      expect(error).toContain(scenario.expectedError);
    });

    test('TC_AUTH_101: Login with invalid username fails', async ({ page }) => {
      const scenario = authData.invalidScenarios[1];
      await loginPage.login(scenario.username, scenario.password);
      expect(await loginPage.isErrorDisplayed()).toBe(true);
    });

    test('TC_AUTH_102: Login with wrong password fails', async ({ page }) => {
      const scenario = authData.invalidScenarios[2];
      await loginPage.login(scenario.username, scenario.password);
      expect(await loginPage.isErrorDisplayed()).toBe(true);
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
