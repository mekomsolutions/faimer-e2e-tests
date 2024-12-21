import { expect, type Page } from '@playwright/test';
import { delay } from './home-page';

export class AppointmentsPage {
  constructor(readonly page: Page) {}

  readonly conditionsTable = () => this.page.getByTestId('table');

  async navigateToAppointmentsPage() {
    await this.page.getByRole('link', { name: /appointments/i }).click();
  }

  async addPatientAppointment() {
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    await this.page.getByLabel(/select a service/i).selectOption('General Medicine service');
    await this.page.getByLabel(/select an appointment type/i).selectOption('Scheduled');
    await this.page.locator('#duration').fill('40');
    await this.page.getByPlaceholder(/write any additional points here/i).fill('This is an appointment.');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/appointment scheduled/i)).toBeVisible();
    await this.page.getByRole('tab', { name: /today/i }).click();
  }

  async editPatientAppointment() {
    await this.page.getByRole('tab', { name: /today/i }).click();
    await this.page.getByRole('button', { name: /options/i }).click();
    await this.page.getByRole('menuitem', { name: /edit/i }).click();
    await this.page.getByLabel(/select a service/i).selectOption('Rehabilitation service');
    await this.page.getByPlaceholder(/write any additional points here/i).fill('Revised appointment.');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/appointment edited/i)).toBeVisible(), delay(3000);
  }

  async cancelPatientAppointment() {
    await this.page.getByRole('tab', { name: /today/i }).click();
    await this.page.getByRole('button', { name: /options/i }).click();
    await this.page.getByRole('menuitem', { name: /cancel/i }).click();
    await this.page.getByRole('button', { name: /cancel appointment/i }).click();
    await expect(this.page.getByText(/appointment cancelled successfully/i)).toBeVisible();
   }
}
