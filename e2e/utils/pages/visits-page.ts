import { expect, type Page } from '@playwright/test';
import { delay, HomePage } from './home-page';
import { patientName } from './registration-page';

let homePage :  HomePage;

export class VisitsPage {
  constructor(readonly page: Page) {}

  async navigateToVisitsPage() {
    await this.page.getByRole('link', { name: /visits/i }).click(), delay(2000);
  }

  async startPatientVisit() {
    homePage = new HomePage(this.page);
    await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
    await this.page.getByRole('button', { name: /start a visit/i }).click();
    await this.page.locator('label').filter({ hasText: 'Facility Visit' }).locator('span').first().click();
    await this.page.locator('form').getByRole('button', { name: /start visit/i }).click();
    await expect(this.page.getByText(/facility visit started successfully/i)).toBeVisible(), delay(3000);
  }

  async updatePatientVisit() {
    await this.page.getByRole('button', { name: /edit visit details/i }).click();
    await this.page.locator('label').filter({ hasText: 'Home Visit' }).locator('span').first().click();
    await this.page.getByRole('button', { name: /update visit/i }).click(), delay(3000);
  }

  async endPatientVisit() {
    await this.page.getByRole('button', { name: /actions/i, exact: true }).click();
    await this.page.getByRole('menuitem', { name: /end visit/i }).click();
    await this.page.getByRole('button', { name: /danger end visit/i }).click();
    await expect(this.page.getByText(/visit ended/i)).toBeVisible();
  }
}
