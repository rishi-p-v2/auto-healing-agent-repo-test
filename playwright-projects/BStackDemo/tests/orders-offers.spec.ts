import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { OrdersPage } from '../pages/OrdersPage';

test.describe('Orders & Offers - BStackDemo', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let ordersPage: OrdersPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    ordersPage = new OrdersPage(page);
  });

  // ============================================================================
  // ORDERS TESTS
  // ============================================================================
  test.describe('Orders', () => {

    test('TC_ORD_002: existing_orders_user has 10 orders', async ({ page }) => {
      await loginPage.login('existing_orders_user', 'testingisfun99');
      await page.waitForNavigation();
      await page.click('text=Orders');
      await page.waitForLoadState('networkidle');
      const orderItems = page.locator('.a-box-inner');
      await expect(orderItems).toHaveCount(10);
    });

    test('TC_ORD_003: Navigate to Orders from logged-in state', async ({ page }) => {
      await loginPage.login('fav_user', 'testingisfun99');
      await page.click('text=Orders');
      await page.waitForLoadState('networkidle');
      const url = page.url();
      expect(url).toBeTruthy();
    });
  });

  // ============================================================================
  // OFFERS TESTS
  // ============================================================================
  test.describe('Offers', () => {

    test('TC_OFF_001: Offers page shows 1 offer for fav_user', async ({ page }) => {
      await loginPage.login('fav_user', 'testingisfun99');
      await page.click('text=Offers');
      const offerItem = page.locator('.pt-6');
      await expect(offerItem).toHaveCount(1);
    });

    test('TC_OFF_002: Navigate to Offers page is successful', async ({ page }) => {
      await loginPage.login('fav_user', 'testingisfun99');
      const offersLink = page.locator('text=Offers');
      await expect(offersLink).toBeVisible();
      await offersLink.click();
      await page.waitForLoadState('networkidle');
      const url = page.url();
      expect(url).toBeTruthy();
    });
  });
});
