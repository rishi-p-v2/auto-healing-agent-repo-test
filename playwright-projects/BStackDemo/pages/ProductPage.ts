import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly appleFilterCheckbox: Locator;
  readonly sortDropdown: Locator;
  readonly cartCloseButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);

    this.productTitles = page.locator('.shelf-item__title, [data-testid="product-title"]');
    this.productPrices = page.locator('.shelf-item__price > div.val > b, [data-testid="product-price"]');
    this.appleFilterCheckbox = page.locator('.filters-available-size:nth-child(2) .checkmark, [data-testid="filter-apple"]');
    this.sortDropdown = page.locator('select, [data-testid="sort-dropdown"]');
    this.cartCloseButton = page.locator('div.float-cart__close-btn, [data-testid="cart-close"], .cart-close');
    this.checkoutButton = page.locator('.buy-btn, [data-testid="checkout-btn"], button:has-text("Checkout")');
    this.cartBadge = page.locator('.float-cart__header span, [data-testid="cart-count"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://bstackdemo.com');
    await this.waitForPageLoad();
  }

  getBuyButton(productIndex: number): Locator {
    return this.page.locator(`#\\3${productIndex} > .shelf-item__buy-btn, .shelf-item:nth-child(${productIndex}) .shelf-item__buy-btn`);
  }

  async addProductToCart(productIndex: number): Promise<void> {
    await this.getBuyButton(productIndex).click();
  }

  async closeCart(): Promise<void> {
    await this.cartCloseButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async applyAppleFilter(): Promise<void> {
    await this.appleFilterCheckbox.click();
    await this.page.waitForTimeout(1000);
  }

  async sortByLowestPrice(): Promise<void> {
    await this.sortDropdown.selectOption('lowestprice');
    await this.page.waitForTimeout(5000);
  }

  async getProductCount(): Promise<number> {
    return await this.productTitles.count();
  }

  async getPriceValues(): Promise<number[]> {
    const prices = await this.productPrices.allTextContents();
    return prices.map(p => parseInt(p.replace(/[^0-9]/g, ''), 10));
  }

  async navigateToOrders(): Promise<void> {
    await this.page.click('text=Orders');
  }

  async navigateToOffers(): Promise<void> {
    await this.page.click('text=Offers');
  }
}
