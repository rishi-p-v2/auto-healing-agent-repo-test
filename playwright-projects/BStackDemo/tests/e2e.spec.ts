import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('E2E Flows - BStackDemo', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('E2E_001: Complete end-to-end purchase journey', async ({ page }) => {
    await loginPage.login('fav_user', 'testingisfun99');

    await productPage.addProductToCart(1);
    await productPage.closeCart();
    await productPage.addProductToCart(2);
    await productPage.proceedToCheckout();

    await checkoutPage.fillShippingForm({
      firstName: 'first',
      lastName: 'last',
      address: 'address',
      province: 'province',
      postCode: 'pincode',
    });
    await checkoutPage.clickContinue();
    await page.click('text=Continue');
    await page.click('text=Orders');

    const orderGrid = page.locator('.a-fixed-left-grid-inner');
    await expect(orderGrid).toHaveCount(2);
  });

  test('E2E_002: Login → Filter Apple → Add to Cart → Checkout', async ({ page }) => {
    await loginPage.login('fav_user', 'testingisfun99');

    await productPage.applyAppleFilter();
    const count = await productPage.getProductCount();
    expect(count).toBe(9);

    await productPage.addProductToCart(1);
    await productPage.closeCart();
    await productPage.addProductToCart(2);
    await productPage.proceedToCheckout();

    await expect(checkoutPage.firstNameInput).toBeVisible();
    await checkoutPage.fillShippingForm({
      firstName: 'Test',
      lastName: 'User',
      address: '456 Test Ave',
      province: 'Texas',
      postCode: '75001',
    });
    await checkoutPage.clickContinue();
    const url = page.url();
    expect(url).toBeTruthy();
  });
});
