import { expect, type Page } from '@playwright/test';
import { delay, OpenMRS, patientName } from './home-page';

let homePage :  OpenMRS;

export class VisitsPage {
  constructor(readonly page: Page) {}

  async navigateToVisitsPage() {
    await this.page.getByRole('link', { name: /visits/i }).click();
  }

  async startPatientVisit() {
    homePage = new OpenMRS(this.page);
    await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
    await this.page.getByRole('button', { name: 'Start a visit' }).click();
    await this.page.locator('label').filter({ hasText: 'Facility Visit' }).locator('span').first().click();
    await this.page.locator('form').getByRole('button', { name: 'Start visit' }).click();
    await expect(this.page.getByText('Facility Visit started successfully')).toBeVisible();
    await delay(3000);
  }

  async editPatientVisit() {
    await this.page.getByRole('button', { name: /edit visit details/i }).click();
    await this.page.locator('label').filter({ hasText: 'Home Visit' }).locator('span').first().click();
    await this.page.getByRole('button', { name: /update visit/i }).click();
    await delay(3000);
  }

  async endPatientVisit() {
    await this.page.getByRole('button', { name: /actions/i, exact: true }).click();
    await this.page.getByRole('menuitem', { name: /end visit/i }).click();
    await this.page.getByRole('button', { name: /danger end visit/i }).click();
    await expect(this.page.getByText(/visit ended/i)).toBeVisible();
  }
}
