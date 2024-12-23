import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';
import { ImmunizationsPage } from '../utils/pages/immunizations-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let immunizationsPage: ImmunizationsPage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  immunizationsPage = new ImmunizationsPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
  await visitsPage.startPatientVisit();
});

test('Add an immunization', async ({ page }) => {
  // setup
  const headerRow = immunizationsPage.immunizationsTable().locator('thead > tr');
  const immunizationType = immunizationsPage.immunizationsTable().locator('tbody td:nth-child(2)');
  const vaccinationDate = immunizationsPage.immunizationsTable().locator('tbody td:nth-child(3)');

  // replay
  await immunizationsPage.navigateToImmunizationsPage();
  await immunizationsPage.addPatientImmunization();

  // verify
  await expect(headerRow).toContainText(/vaccine/i);
  await expect(headerRow).toContainText(/recent vaccination/i);
  await expect(immunizationType).toContainText(/hepatitis b vaccination/i);
  await expect(vaccinationDate).toContainText(/nov 28, 2024/i);
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
