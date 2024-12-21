import { expect, type Page } from '@playwright/test';
import { delay } from './home-page';

export class ProgramsPage {
  constructor(readonly page: Page) {}

  readonly programsTable = () => this.page.getByRole('table', { name: /program enrollments/i });
  readonly editProgramButton = () => this.page.getByRole('button', { name: /edit program/i });

  async navigateToProgramsPage() {
    await this.page.getByRole('link', { name: /programs/i }).click();
  }

  async addPatientProgramEnrollment() {
    await this.page.getByText(/record program enrollment/i).click();
    await this.page.locator('#program').selectOption('HIV Care and Treatment');
    await this.page.locator('#enrollmentDateInput').fill('15/08/2024');
    await this.page.locator('#completionDateInput').fill('20/08/2024');
    await this.page.locator('#completionDateInput').press('Tab');
    await this.page.locator('#location').selectOption('Outpatient Clinic');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/program enrollment saved/i)).toBeVisible();
  }

  async editPatientProgramEnrollment() {
    await this.editProgramButton().click();
    await this.page.locator('#enrollmentDateInput').clear();
    await this.page.locator('#enrollmentDateInput').fill('16/08/2024');
    await this.page.locator('#completionDateInput').clear();
    await this.page.locator('#completionDateInput').fill('21/08/2024');
    await this.page.locator('#completionDateInput').press('Tab');
    await this.page.locator('#location').selectOption('Community Outreach');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/program enrollment updated/i)).toBeVisible(), delay(3000);
  }
}
