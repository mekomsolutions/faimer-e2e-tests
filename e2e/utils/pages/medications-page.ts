import { expect, type Page } from '@playwright/test';

export class MedicationsPage {
  constructor(readonly page: Page) {}

  readonly medicationsTable = () => this.page.getByRole('table', { name: /medications/i });

  async navigateToMedicationsPage() {
    await this.page.getByRole('link', { name: /medications/i }).click();
  }

  async navigateToDrugOrderForm() {
    await expect(this.page.getByLabel(/order basket/i)).toBeVisible();
    await this.page.getByLabel(/order basket/i).click();
    await expect(this.page.getByRole('button', { name: 'Add', exact: true }).nth(0)).toBeVisible();
    await this.page.getByRole('button', { name: 'Add', exact: true }).nth(0).click();
  }

  async fillDrugOrderForm() {
    await this.page.getByPlaceholder('Dose').fill('4');
    await this.page.getByRole('button', { name: 'Open', exact: true }).nth(1).click();
    await this.page.getByText('Intravenous', {exact: true}).click();
    await this.page.getByRole('button', { name: 'Open', exact: true }).nth(2).click();
    await this.page.getByText('Twice daily', {exact: true}).click();
    await this.page.getByPlaceholder(/additional dosing instructions/i).fill('Take after eating');
    await this.page.getByLabel('Duration', { exact: true }).fill('5');
    await this.page.getByLabel(/quantity to dispense/i).fill('12');
    await this.page.getByLabel(/prescription refills/i).fill('3');
    await this.page.locator('#indication').fill('Hypertension');
  }

  async saveDrugOrder() {
    await this.page.getByRole('button', { name: /save order/i }).click();
    await this.page.getByRole('button', { name: /sign and close/i }).focus();
    await this.page.getByRole('button', { name: /sign and close/i }).click();
  }

  async modifyDrugOrder() {
    await this.page.getByPlaceholder('Dose').fill('8');
    await this.page.getByLabel('Clear selected item').nth(2).click();
    await this.page.getByPlaceholder('Frequency').click();
    await this.page.getByText('Thrice daily').click();
    await this.page.getByLabel('Duration', { exact: true }).fill('6');
    await this.page.getByLabel(/quantity to dispense/i).fill('8');
    await this.page.getByRole('button', { name: /save order/i }).dispatchEvent('click');
    await this.page.getByRole('button', { name: /sign and close/i }).dispatchEvent('click');
  }

  async discontinueDrugOrder() {
    await this.page.getByRole('button', { name: /options/i, exact: true }).click();
    await this.page.getByRole('menuitem', { name: /discontinue/i }).click();
    await this.page.getByRole('button', { name: /sign and close/i }).dispatchEvent('click');
  }
}
