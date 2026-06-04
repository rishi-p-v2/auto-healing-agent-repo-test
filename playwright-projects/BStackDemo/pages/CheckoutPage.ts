import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly provinceInput: Locator;
  readonly postCodeInput: Locator;
  readonly continueButton: Locator;
  readonly continueTextLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('#firstNameInput, [data-testid="first-name"], input[name="firstName"]');
    this.lastNameInput = page.locator('#lastNameInput, [data-testid="last-name"], input[name="lastName"]');
    this.addressInput = page.locator('#addressLine1Input, [data-testid="address"], input[name="address"]');
    this.provinceInput = page.locator('#provinceInput, [data-testid="province"], input[name="province"]');
    this.postCodeInput = page.locator('#postCodeInput, [data-testid="postcode"], input[name="postCode"]');
    this.continueButton = page.locator('#checkout-shipping-continue, [data-testid="continue"], button:has-text("Continue")');
    this.continueTextLink = page.locator('text=Continue');
    this.errorMessage = page.locator('.error, [data-testid="checkout-error"], .validation-error, [role="alert"]');
  }

  async fillShippingForm(data: {
    firstName: string;
    lastName: string;
    address: string;
    province: string;
    postCode: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.addressInput.fill(data.address);
    await this.provinceInput.fill(data.province);
    await this.postCodeInput.fill(data.postCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickContinueLink(): Promise<void> {
    await this.continueTextLink.click();
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async isOnCheckoutPage(): Promise<boolean> {
    return this.page.url().includes('checkout') || await this.firstNameInput.isVisible().catch(() => false);
  }
}
