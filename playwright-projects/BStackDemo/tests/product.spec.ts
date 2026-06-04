import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import productData from '../data/productData.json';

test.describe('Product - BStackDemo', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
  });

  // ============================================================================
  // POSITIVE TEST CASES
  // ============================================================================
  test.describe('Positive Scenarios', () => {

    test('TC_PROD_001: View all products on home page', async ({ page }) => {
      await productPage.navigate();
      const count = await productPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_PROD_002: Apply Apple vendor filter shows 9 products', async ({ page }) => {
      const scenario = productData.validScenarios[1];
      await productPage.navigate();
      await productPage.applyAppleFilter();
      const count = await productPage.getProductCount();
      expect(count).toBe(scenario.expectedProductCount);
    });

    test('TC_PROD_003: Sort products by lowest price — ascending order', async ({ page }) => {
      await productPage.navigate();
      await productPage.sortByLowestPrice();
      const prices = await productPage.getPriceValues();
      expect(prices.length).toBeGreaterThan(1);
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      }
    });

    test('TC_PROD_004: Add product to cart updates cart', async ({ page }) => {
      await loginPage.login('fav_user', 'testingisfun99');
      await productPage.addProductToCart(1);
      await expect(productPage.cartCloseButton).toBeVisible();
    });

    test('TC_PROD_005: Add multiple products to cart', async ({ page }) => {
      await loginPage.login('fav_user', 'testingisfun99');
      await productPage.addProductToCart(1);
      await productPage.closeCart();
      await productPage.addProductToCart(2);
      await expect(productPage.checkoutButton).toBeVisible();
    });
  });

  // ============================================================================
  // BOUNDARY TEST CASES
  // ============================================================================
  test.describe('Boundary Tests', () => {

    test('TC_PROD_300: All product price values are valid numbers', async ({ page }) => {
      await productPage.navigate();
      const prices = await productPage.getPriceValues();
      expect(prices.length).toBeGreaterThan(0);
      for (const price of prices) {
        expect(isNaN(price)).toBe(false);
        expect(price).toBeGreaterThan(0);
      }
    });
  });
});
