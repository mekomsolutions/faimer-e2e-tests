import { expect, type Page } from '@playwright/test';

export class DiagnosisPage {
  constructor(readonly page: Page) {}

  async navigateToDiagnosisPage() {
    await this.page.getByLabel(/visit note/i).click();
  }

  async addDiagnosis() {
    await this.page.getByPlaceholder(/choose a primary diagnosis/i).fill('Diabetic ketoacidosis');
    await this.page.getByRole('menuitem', { name: /diabetic ketoacidosis/i }).click();
    await this.page.getByPlaceholder(/write any notes here/i).fill('Patient has excessive thirst, frequent urination, nausea and vomiting');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/visit note saved/i)).toBeVisible();
  }

  async deleteDiagnosis() {
    await this.page.getByRole('tab', { name: /all encounters/i }).click();
    await this.page.getByRole('button', { name: /options/i }).nth(0).click();
    await this.page.getByRole('menuitem', { name: /delete this encounter/i }).click();
    await this.page.getByRole('button', { name: /delete/i }).click();
    await expect(this.page.getByText(/encounter deleted/i)).toBeVisible();
  }
}
