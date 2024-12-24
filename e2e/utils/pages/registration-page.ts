import { type Page, expect } from '@playwright/test';
import { delay } from './home-page';

export var patientName = {
  firstName : '',
  givenName : '',
  updatedFirstName : ''
}

export var patientContact = {
  phoneNumber : '',
  postalCode : '',
  province : '',
  city : '',
  country : '',
}

export class RegistrationPage {
  constructor(readonly page: Page) {}

  readonly createPatientButton = () => this.page.locator('button[type=submit]');
  readonly birthDateInput = () => this.page.locator('#birthdate');

  async navigateToRegistrationForm() {
    await this.page.getByRole('button', { name: /add patient/i }).click();
    await expect(this.createPatientButton()).toBeEnabled();
  }

  async createPatient() {
    patientName = {
      firstName : `e2e_test_${Array.from({ length: 4 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      givenName : `${Array.from({ length: 8 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`, 
      updatedFirstName: `${Array.from({ length: 8 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`
    }

    patientContact = {
      phoneNumber : `077${Math.floor(Math.random() * 10000000)}`,
      postalCode: `+${Math.floor(Math.random() * 1000)}`,
      province: `Oriente`,
      city: `Fernando de la Mora`,
      country: `Paraguay`,
    }

    await this.page.locator('#givenName').fill(`${patientName.firstName}`);
    await this.page.locator('#familyName').fill(`${patientName.givenName}`);
    await this.page.locator('label').filter({ hasText: /^Male$/ }).locator('span').first().click();
    this.birthDateInput().getByRole('presentation').focus();
    await this.birthDateInput().locator('[data-type="day"]').fill('18');
    await this.birthDateInput().locator('[data-type="month"]').fill('02');
    await this.birthDateInput().locator('[data-type="year"]').fill('1999');
    await this.page.locator('#address1').fill('Asunción city');
    await this.page.locator('#cityVillage').fill(`${patientContact.city}`);
    await this.page.locator('#stateProvince').fill(`${patientContact.province}`);
    await this.page.locator('#country').fill(`${patientContact.country}`);
    await this.page.locator('#postalCode').fill(`${patientContact.postalCode}`);
    await this.page.locator('#phone').fill(`${patientContact.phoneNumber}`)
    await this.page.getByRole('button', { name: /register patient/i }).click();
    await expect(this.page.getByText(/new patient created/i)).toBeVisible(), delay(4000);
  }

  async updatePatientDetails() {
    await this.page.getByRole('button', { name: /actions/i, exact: true }).click();
    await this.page.getByRole('menuitem', { name: /edit patient details/i }).click(), delay(4000);
    await this.page.locator('#givenName').fill(patientName.updatedFirstName), delay(2000);
    await this.page.locator('label').filter({ hasText: /female/i }).locator('span').first().click();
    await this.birthDateInput().locator('[data-type="day"]').fill('28');
    await this.birthDateInput().locator('[data-type="month"]').fill('04');
    await this.page.getByRole('button', { name: /update patient/i }).click();
    await expect(this.page.getByText(/patient details updated/i)).toBeVisible();
    patientName.firstName = `${patientName.updatedFirstName}`, delay(4000);
  }
}
