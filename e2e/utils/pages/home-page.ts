import { Page, expect } from '@playwright/test';
import { patientName } from './registration-page';
import { firstUser, secondUser } from './keycloak';

export const delay = (mills) => {
  const endTime = Date.now() + mills;
  while (Date.now() < endTime) {
    // Do nothing, just wait
  }
};

export class HomePage {
  constructor(readonly page: Page) {}

  readonly patientSearchIcon = () => this.page.locator('[data-testid="searchPatientIcon"]');
  readonly patientSearchBar = () => this.page.locator('[data-testid="patientSearchBar"]');
  readonly patientAdvancedSearch = () => this.page.locator('button[type="submit"]:text("Search")');
  readonly floatingSearchResultsContainer = () => this.page.locator('[data-testid="floatingSearchResultsContainer"]');
  readonly editPatientButton = () => this.page.getByRole('menuitem', { name: /edit patient details/i });

  async login() {
    await this.page.goto(`${process.env.O3_URL_DEV}`);
    await this.page.locator('#username').fill(`${process.env.O3_USERNAME}`);
    await this.enterLoginCredentials();
  }

  async loginWithFirstUser() {
    await this.page.locator('#username').fill(`${firstUser.userName}`);
    await this.enterLoginCredentials();
  }

  async loginWithSecondUser() {
    await this.page.locator('#username').fill(`${secondUser.userName}`);
    await this.page.locator('#password').fill(`${process.env.O3_PASSWORD}`);
    await this.page.getByRole('button', { name: /log in/i }).click();
    await this.page.locator('label').filter({ hasText: /Outpatient Clinic/ }).locator('span').first().click();
    await this.page.getByRole('button', { name: /confirm/i }).click();
    await expect(this.page).toHaveURL(/.*home/);
    await expect(this.page.getByText(/today's appointments/i)).not.toBeVisible();
  }

  async enterLoginCredentials() {
    await this.page.locator('#password').fill(`${process.env.O3_PASSWORD}`);
    await this.page.getByRole('button', { name: /log in/i }).click();
    await this.page.locator('label').filter({ hasText: /inpatient ward/i }).locator('span').first().click();
    await this.page.getByRole('button', { name: /confirm/i }).click();
    await expect(this.page).toHaveURL(/.*home/);
    await expect(this.page.getByText(/today's appointments/i)).not.toBeVisible();
  }

  async navigateToHomePage() {
    await this.page.goto(`${process.env.O3_URL_DEV}/openmrs/spa/home`);
    await expect(this.page).toHaveURL(/.*home/);
  }

  async searchPatient(searchText: string) {
    await this.navigateToHomePage();
    await this.patientSearchIcon().click();
    await this.patientSearchBar().fill(searchText);
    await this.page.getByRole('link', { name: `${patientName.firstName + ' ' + patientName.givenName}` }).first().click();
  }

  async clickOnPatientResult(name: string) {
    await this.floatingSearchResultsContainer().locator(`text=${name}`).click();
  }

  async searchPatientId() {
    await this.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
    await this.page.getByRole('button', { name: /actions/i, exact: true }).click();
    await expect(this.editPatientButton()).toBeEnabled();
    await this.editPatientButton().click(), delay(4000);
    await expect(this.page.getByText(/identifiers/i, {exact: true})).toBeVisible();
    await expect(this.page.getByText(/openmrs id/i, {exact: true})).toBeVisible();
  }

  async navigateToLoginPage() {
    await this.page.goto(`${process.env.O3_URL_DEV}`);
    await expect(this.page.locator('#username')).toBeVisible();
    await expect(this.page.locator('#password')).toBeVisible();
  }

  async logout() {
    await this.page.getByRole('button', { name: /my account/i }).click();
    await this.page.getByRole('button', { name: /logout/i }).click(), delay(2000);
    await this.page.getByRole('button', { name: /logout/i }).click();
  }

  async voidPatient() {
    await this.page.goto(`${process.env.O3_URL_DEV}/openmrs/admin/patients/index.htm`);
    await expect(this.page.getByPlaceholder(' ')).toBeVisible();
    await this.page.getByPlaceholder(' ').type(`${patientName.firstName + ' ' + patientName.givenName}`);
    await this.page.locator('#openmrsSearchTable tbody tr.odd td:nth-child(1)').click();
    await this.page.locator('input[name="voidReason"]').fill('Void patient created by smoke test');
    await this.page.getByRole('button', { name: 'Delete Patient', exact: true }).click();
    await expect(this.page.locator('//*[@id="patientFormVoided"]')).toContainText(/this patient has been deleted/i);
  }

  async voidUnknownPatient() {
    await this.page.goto(`${process.env.O3_URL_DEV}/openmrs/admin/patients/index.htm`);
    await expect(this.page.getByPlaceholder(' ')).toBeVisible();
    await this.page.getByPlaceholder(' ').type('Unknown Unknown');
    await this.page.locator('#openmrsSearchTable tbody tr.odd td:nth-child(1)').click();
    await this.page.locator('input[name="voidReason"]').fill('Void patient created by smoke test');
    await this.page.getByRole('button', { name: 'Delete Patient', exact: true }).click();
    await expect(this.page.locator('//*[@id="patientFormVoided"]')).toContainText(/this patient has been deleted/i);
  }
}
