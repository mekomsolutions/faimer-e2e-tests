import { Page, expect } from '@playwright/test';
import { delay } from './home-page';

export var firstUser = {
  userName : '',
  firstName : '',
  email : '',
}

export var secondUser = {
  userName : '',
  firstName : '',
  email : '',
}

export class Keycloak {
  constructor(readonly page: Page) {}

  readonly addUserButton = () => this.page.getByTestId('add-user');

  async login() {
    await this.page.goto(`${process.env.KEYCLOAK_URL_DEV}/admin/master/console`);
    await this.page.getByLabel(/username or email/i).fill(`${process.env.KEYCLOAK_USERNAME}`);
    await this.page.getByLabel(/password/i).fill(`${process.env.KEYCLOAK_PASSWORD}`);
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await expect(this.page).toHaveURL(/.*console/), delay(6000);
  }
  
  async navigateToUsers() {
    await this.page.getByTestId('realmSelectorToggle').click();
    await expect(this.page.getByRole('menuitem', { name: 'ozone' })).toBeVisible();
    await this.page.getByRole('menuitem', { name: 'ozone' }).click();
    await this.page.getByRole('link', { name: /users/i }).click();
  }

  async createFirstUser() {
    firstUser = {
      userName : `${Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      firstName: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      email: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}@gmail.com`
    }
    await this.page.locator('input[name="username"]').fill(`${firstUser.userName}`);
    await this.page.getByTestId('email-input').fill(`${firstUser.email}`);
    await this.page.locator('label').filter({ hasText: /yesno/i }).locator('span').first().click(), delay(1000);
    await this.page.getByTestId('firstName-input').fill(`${firstUser.firstName}`);
    await this.saveUser();
  }

  async createSecondUser() {
    secondUser = {
      userName : `${Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      firstName: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      email: `${Array.from({ length: 6 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}@gmail.com`
    }
    await this.page.locator('input[name="username"]').fill(`${secondUser.userName}`);
    await this.page.getByTestId('email-input').fill(`${secondUser.email}`);
    await this.page.locator('label').filter({ hasText: /yesno/i }).locator('span').first().click(), delay(1000);
    await this.page.getByTestId('firstName-input').fill(`${secondUser.firstName}`);
    await this.saveUser();
  }

  async saveUser() {
    await this.page.getByTestId('create-user').click();
    await expect(this.page.getByRole('heading', { name: /the user has been created/i })).toBeVisible(), delay(2000);
  }

  async navigateToCredentials() {
    await this.page.getByTestId('credentials').click();
  }

  async createUserPassword() {
    await this.page.getByTestId('no-credentials-empty-action').click();
    await this.page.getByTestId('passwordField').fill('password');
    await this.page.getByTestId('passwordConfirmationField').fill('password');
    await this.page.locator('label').filter({ hasText: /onoff/i }).locator('span').first().click(), delay(1000);
    await this.page.getByTestId('confirm').click(), delay(1500);
    await this.page.getByTestId('confirm').click();
    await expect(this.page.getByRole('heading', { name: /the password has been set successfully/i })).toBeVisible(), delay(3000);
  }

  async navigateToRoles() {
    await this.page.getByTestId('role-mapping-tab').click();
    await this.page.getByTestId('assignRole').click();
    await this.page.getByRole('button', { name: /filter by realm roles/i }).click();
    await this.page.getByTestId('roles').click(), delay(2000);
  }

  async assignRoleToUser() {
  await this.page.getByRole('textbox', { name: /search/i }).fill('openmrs');
  await this.page.getByRole('textbox', { name: /search/i }).press('Enter');
  await this.page.getByRole('checkbox', { name: /select all rows/i }).check();
  await this.page.getByTestId('assign').click();
  await expect(this.page.getByText(/user role mapping successfully updated/i)).toBeVisible();
  }

  async deleteUser() {
    await this.page.goto(`${process.env.KEYCLOAK_URL_DEV}/admin/master/console/#/ozone/users`);
    await this.page.getByRole('textbox', { name: 'search' }).fill(`${firstUser.userName}`);
    await this.page.getByRole('textbox', { name: 'search' }).press('Enter'), delay(1000);
    await this.confirmDelete();
    await this.page.getByRole('textbox', { name: 'search' }).fill(`${secondUser.userName}`);
    await this.page.getByRole('textbox', { name: 'search' }).press('Enter'), delay(1000);
    await this.confirmDelete();
  }

  async confirmDelete() {
    await this.page.getByRole('button', { name: /actions/i }).click();
    await this.page.getByRole('menuitem', { name: /delete/i }).click();
    await this.page.getByTestId('confirm').click();
    await expect(this.page.getByText(/the user has been deleted/i)).toBeVisible();
  }
}
