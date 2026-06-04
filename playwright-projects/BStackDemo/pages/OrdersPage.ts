import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrdersPage extends BasePage {
  readonly orderItems: Locator;
  readonly orderGrid: Locator;
  readonly ordersLink: Locator;

  constructor(page: Page) {
    super(page);

    this.orderItems = page.locator('.a-box-inner, [data-testid="order-item"]');
    this.orderGrid = page.locator('.a-fixed-left-grid-inner, [data-testid="order-grid"]');
    this.ordersLink = page.locator('text=Orders, [data-testid="orders-link"]');
  }

  async navigateViaLink(): Promise<void> {
    await this.ordersLink.click();
    await this.waitForPageLoad();
  }

  async getOrderCount(): Promise<number> {
    return await this.orderItems.count();
  }

  async getOrderGridCount(): Promise<number> {
    return await this.orderGrid.count();
  }

  async isOnOrdersPage(): Promise<boolean> {
    return this.page.url().includes('orders') || await this.orderItems.isVisible().catch(() => false);
  }
}
