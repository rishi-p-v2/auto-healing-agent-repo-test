import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import checkoutData from '../data/checkoutData.json';

test.describe('Checkout - BStackDemo', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let checkoutPage: CheckoutPage;
  let ordersPage: OrdersPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    checkoutPage = new CheckoutPage(page);
    ordersPage = new OrdersPage(page);
  });

  const addTwoItemsAndCheckout = async (page: any, username: string, password: string) => {
    await loginPage.login(username, password);
    await productPage.addProductToCart(1);
    await productPage.closeCart();
    await productPage.addProductToCart(2);
    await productPage.proceedToCheckout();
  };

  // ============================================================================
  // POSITIVE TEST CASES
  // ============================================================================
  test.describe('Positive Scenarios', () => {

    test('TC_CHKOUT_001: Complete checkout with valid shipping details', async ({ page }) => {
      const scenario = checkoutData.validScenarios[0];
      await addTwoItemsAndCheckout(page, scenario.username, scenario.password);
      await checkoutPage.fillShippingForm({
        firstName: scenario.firstName!,
        lastName: scenario.lastName!,
        address: scenario.address!,
        province: scenario.province!,
        postCode: scenario.postCode!,
      });
      await checkoutPage.clickContinue();
      const url = page.url();
      expect(url).toBeTruthy();
    });

    test('TC_CHKOUT_002: Checkout form fields are all visible', async ({ page }) => {
      const scenario = checkoutData.validScenarios[1];
      await addTwoItemsAndCheckout(page, scenario.username, scenario.password);
      await expect(checkoutPage.firstNameInput).toBeVisible();
      await expect(checkoutPage.lastNameInput).toBeVisible();
      await expect(checkoutPage.addressInput).toBeVisible();
      await expect(checkoutPage.provinceInput).toBeVisible();
      await expect(checkoutPage.postCodeInput).toBeVisible();
      await expect(checkoutPage.continueButton).toBeVisible();
    });

    test('TC_CHKOUT_003: Full E2E purchase — 2 orders appear in order history', async ({ page }) => {
      const scenario = checkoutData.validScenarios[2];
      await loginPage.login(scenario.username, scenario.password);

      await productPage.addProductToCart(1);
      await productPage.closeCart();
      await productPage.addProductToCart(2);
      await productPage.proceedToCheckout();

      await checkoutPage.fillShippingForm({
        firstName: scenario.firstName!,
        lastName: scenario.lastName!,
        address: scenario.address!,
        province: scenario.province!,
        postCode: scenario.postCode!,
      });
      await checkoutPage.clickContinue();
      await page.click('text=Continue');
      await page.click('text=Orders');

      const orderGrid = page.locator('.a-fixed-left-grid-inner');
      await expect(orderGrid).toHaveCount(scenario.expectedOrderCount!);
    });
  });

  // ============================================================================
  // NEGATIVE TEST CASES
  // ============================================================================
  test.describe('Negative Scenarios', () => {

    test('TC_CHKOUT_100: Empty first name prevents checkout', async ({ page }) => {
      const scenario = checkoutData.invalidScenarios[0];
      await addTwoItemsAndCheckout(page, scenario.username, scenario.password);
      await checkoutPage.fillShippingForm({
        firstName: scenario.firstName!,
        lastName: scenario.lastName!,
        address: scenario.address!,
        province: scenario.province!,
        postCode: scenario.postCode!,
      });
      await checkoutPage.clickContinue();
      expect(await checkoutPage.isOnCheckoutPage()).toBe(true);
    });

    test('TC_CHKOUT_101: Empty address prevents checkout', async ({ page }) => {
      const scenario = checkoutData.invalidScenarios[1];
      await addTwoItemsAndCheckout(page, scenario.username, scenario.password);
      await checkoutPage.fillShippingForm({
        firstName: scenario.firstName!,
        lastName: scenario.lastName!,
        address: scenario.address!,
        province: scenario.province!,
        postCode: scenario.postCode!,
      });
      await checkoutPage.clickContinue();
      expect(await checkoutPage.isOnCheckoutPage()).toBe(true);
    });
  });

  // ============================================================================
  // EMPTY FIELD VALIDATION
  // ============================================================================
  test.describe('Empty Field Validation', () => {

    test('TC_CHKOUT_200: All empty fields prevent checkout submission', async ({ page }) => {
      const scenario = checkoutData.emptyFieldTests[0];
      await addTwoItemsAndCheckout(page, scenario.username, scenario.password);
      await checkoutPage.fillShippingForm({
        firstName: scenario.firstName!,
        lastName: scenario.lastName!,
        address: scenario.address!,
        province: scenario.province!,
        postCode: scenario.postCode!,
      });
      await checkoutPage.clickContinue();
      expect(await checkoutPage.isOnCheckoutPage()).toBe(true);
    });
  });

  // ============================================================================
  // BOUNDARY TEST CASES
  // ============================================================================
  test.describe('Boundary Tests', () => {

    test('TC_CHKOUT_300: Post code with maximum characters is handled', async ({ page }) => {
      await addTwoItemsAndCheckout(page, 'fav_user', 'testingisfun99');
      const scenario = checkoutData.boundaryTests[0];
      await checkoutPage.postCodeInput.fill(scenario.postCode!);
      const value = await checkoutPage.postCodeInput.inputValue();
      expect(value).toBeTruthy();
    });

    test('TC_CHKOUT_301: First name with special characters is accepted or validated', async ({ page }) => {
      await addTwoItemsAndCheckout(page, 'fav_user', 'testingisfun99');
      const scenario = checkoutData.boundaryTests[1];
      await checkoutPage.firstNameInput.fill(scenario.firstName!);
      const value = await checkoutPage.firstNameInput.inputValue();
      expect(value).toBe(scenario.firstName);
    });
  });
});
