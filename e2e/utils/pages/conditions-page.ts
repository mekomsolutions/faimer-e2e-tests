import { expect, type Page } from '@playwright/test';

export class ConditionsPage {
  constructor(readonly page: Page) {}

  readonly conditionsTable = () => this.page.getByRole('table', { name: /conditions summary/i });

  async navigateToConditionsPage() {
    await this.page.getByRole('link', { name: /conditions/i }).click();
  }

  async addPatientCondition() {
    await this.page.getByText(/record conditions/i).click();
    await this.page.getByPlaceholder(/search conditions/i).fill('Typhoid fever');
    await this.page.getByRole('menuitem', { name: 'Typhoid fever' }).click();
    await this.page.getByLabel('Onset date').fill('27/07/2023');
    await this.page.getByLabel('Onset date').press('Enter');
    await this.page.locator('label').filter({ hasText: /^Active$/ }).locator('span').first().click();
    await this.page.getByRole('button', { name: /save & close/i }).click();
    await expect(this.page.getByText(/condition saved successfully/i)).toBeVisible();
  }

  async updatePatientCondition() {
    await this.page.getByRole('button', { name: /options/i }).click();
    await this.page.getByRole('menuitem', { name: /edit/i }).click();
    await this.page.locator('label').filter({ hasText: 'Inactive' }).click();
    await this.page.getByLabel(/onset date/i).clear();
    await this.page.getByLabel(/onset date/i).fill('11/08/2023');
    await this.page.getByLabel(/onset date/i).press('Tab');
    await this.page.getByRole('button', { name: /save & close/i }).click();
    await expect(this.page.getByText(/condition updated/i)).toBeVisible();
  }

  async voidPatientCondition() {
    await this.page.getByRole('button', { name: /options/i }).click();
    await this.page.getByRole('menuitem', { name: /delete/i }).click();
    await this.page.getByRole('button', { name: /delete/i }).click();
    await expect(this.page.getByText(/condition deleted/i)).toBeVisible();
  }
}
