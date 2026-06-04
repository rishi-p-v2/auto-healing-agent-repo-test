import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly signinButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly lockedUserError: Locator;

  constructor(page: Page) {
    super(page);

    this.signinButton = page.locator('#sign-in, [data-testid="sign-in"], button:has-text("Sign In")');
    this.usernameInput = page.locator('#react-select-2-input, [data-testid="username"], input[aria-label*="username" i]');
    this.passwordInput = page.locator('#react-select-3-input, [data-testid="password"], input[aria-label*="password" i]');
    this.loginButton = page.locator('#login-btn, [data-testid="login-btn"], button:has-text("Log In")');
    this.errorMessage = page.locator('.api-error, [data-testid="error"], .error-message, [role="alert"]');
    this.lockedUserError = page.locator('.api-error, .locked-error, [data-testid="locked-error"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://bstackdemo.com');
    await this.waitForPageLoad();
  }

  async clickSignIn(): Promise<void> {
    await this.signinButton.click({ delay: 100 });
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.usernameInput.press('Enter');
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.passwordInput.press('Enter');
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.navigate();
    await this.clickSignIn();
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    return this.page.url().includes('bstackdemo.com') && !(this.page.url().includes('login'));
  }
}
