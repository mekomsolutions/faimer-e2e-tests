import { Page, expect } from '@playwright/test';

export var patientName = {
  firstName : '',
  givenName : '',
  updatedFirstName : ''
}

var patientFullName = '';

export const delay = (mills) => {
  let datetime1 = new Date().getTime();
  let datetime2 = datetime1 + mills;
  while(datetime1 < datetime2) {
     datetime1 = new Date().getTime();
    }
}
export class OpenMRS {
  constructor(readonly page: Page) {}

  readonly patientSearchIcon = () => this.page.locator('[data-testid="searchPatientIcon"]');
  readonly patientSearchBar = () => this.page.locator('[data-testid="patientSearchBar"]');

  async login() {
    await this.page.goto(`${process.env.O3_URL_DEV}`);
    await this.page.locator('#username').fill(`${process.env.O3_USERNAME}`);
    await this.page.getByRole('button', { name: /continue/i }).click();
    await this.page.locator('#password').fill(`${process.env.O3_PASSWORD}`);
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await this.page.locator('label').filter({ hasText: 'Inpatient Ward' }).locator('span').first().click();
    await this.page.getByRole('button', { name: /confirm/i }).click();
    await expect(this.page).toHaveURL(/.*home/);
  }

  async createPatient() {
    patientName = {
      firstName : `e2e_test_${Array.from({ length: 4 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      givenName : `${Array.from({ length: 8 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`, 
      updatedFirstName: `${Array.from({ length: 8 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`
    }
    patientFullName = patientName.firstName + ' ' + patientName.givenName;
    await expect(this.page.getByRole('button', { name: /add patient/i })).toBeEnabled();
    await this.page.getByRole('button', { name: /add patient/i }).click();
    await expect(this.page.getByRole('button', { name: /register patient/i })).toBeEnabled();
    await this.page.getByLabel(/first name/i).fill(`${patientName.firstName}`);
    await this.page.getByLabel(/family name/i).fill(`${patientName.givenName}`);
    await this.page.locator('label').filter({ hasText: /^Male$/ }).locator('span').first().click();
    await this.page.locator('div').filter({ hasText: /^Date of Birth Known\?YesNo$/ }).getByRole('tab', { name: 'No' }).click();
    await expect(this.page.getByLabel(/estimated age in years/i)).toBeVisible();
    await this.page.getByLabel(/estimated age in years/i).clear();
    await this.page.getByLabel(/estimated age in years/i).fill(`${Math.floor(Math.random() * 99)}`);
    await expect(this.page.getByText(/register patient/i)).toBeVisible();
    await this.page.getByRole('button', { name: /register patient/i }).click();
    await expect(this.page.getByText(/new patient created/i)).toBeVisible();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
    await delay(3000);
  }

  async goToHomePage() {
    await this.page.goto(`${process.env.O3_URL_DEV}/openmrs/spa/home`);
    await expect(this.page).toHaveURL(/.*home/);
  }

  async searchPatient(searchText: string) {
    await this.goToHomePage();
    await this.patientSearchIcon().click();
    await this.patientSearchBar().fill(searchText);
    await this.page.getByRole('link', { name: `${patientFullName}` }).first().click();
  }

  async voidPatient() {
    await this.page.goto(`${process.env.O3_URL_DEV}/openmrs/admin/patients/index.htm`);
    await expect(this.page.getByPlaceholder(' ')).toBeVisible();
    await this.page.getByPlaceholder(' ').type(`${patientName.firstName + ' ' + patientName.givenName}`);
    await this.page.locator('#openmrsSearchTable tbody tr.odd td:nth-child(1)').click();
    await this.page.locator('input[name="voidReason"]').fill('Void patient created by smoke test');
    await this.page.getByRole('button', { name: 'Delete Patient', exact: true }).click();
    await expect(this.page.locator('//*[@id="patientFormVoided"]')).toContainText('This patient has been deleted');
  }
}
