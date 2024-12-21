import { expect, type Page } from '@playwright/test';

export class BiometricsAndVitalsPage {
  constructor(readonly page: Page) {}

  readonly biometricsTable = () => this.page.getByRole('table', { name: /biometrics/i });
  readonly vitalsTable = () => this.page.getByRole('table', { name: /vitals/i });

  async navigateToBiometricsAndVitalsPage() {
    await this.page.getByRole('link', { name: /vitals & biometrics/i }).click();
  }

  async addPatientBiometrics() {
    await this.page.getByText(/record biometrics/i).click();
    await this.page.getByRole('spinbutton', { name: /weight/i }).fill('76');
    await this.page.getByRole('spinbutton', { name: /height/i }).fill('164');
    await this.page.getByRole('spinbutton', { name: /muac/i }).fill('34');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/biometrics saved/i)).toBeVisible();
  }

  async addPatientVitals() {
    await this.page.getByText(/record vital signs/i).click();
    await this.page.getByRole('spinbutton', { name: /temperature/i }).fill('35.8');
    await this.page.getByRole('spinbutton', { name: /systolic/i }).fill('125');
    await this.page.getByRole('spinbutton', { name: /diastolic/i }).fill('95');
    await this.page.getByRole('spinbutton', { name: /pulse/i }).fill('62');
    await this.page.getByRole('spinbutton', { name: /respiration rate/i }).fill('18');
    await this.page.getByRole('spinbutton', { name: /oxygen saturation/i }).fill('97');
    await this.page.getByPlaceholder(/type any additional notes here/i).fill('Notes for vitals');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/vitals and biometrics saved/i)).toBeVisible();
  }
}
