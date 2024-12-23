import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';
import { BiometricsAndVitalsPage } from '../utils/pages/vitals-and-biometrics-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let biometricsAndVitalsPage: BiometricsAndVitalsPage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  biometricsAndVitalsPage = new BiometricsAndVitalsPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
});

test('Record vitals', async ({}) => {
  // setup
  const headerRow = biometricsAndVitalsPage.vitalsTable().locator('thead > tr');
  const dataRow = biometricsAndVitalsPage.vitalsTable().locator('tbody > tr');
  await visitsPage.startPatientVisit();
  
  // replay
  await biometricsAndVitalsPage.navigateToBiometricsAndVitalsPage();
  await biometricsAndVitalsPage.addPatientVitals();

  // verify
  await expect(headerRow).toContainText(/temp/i);
  await expect(headerRow).toContainText(/bp/i);
  await expect(headerRow).toContainText(/pulse/i);
  await expect(headerRow).toContainText(/r. rate/i);
  await expect(headerRow).toContainText(/SPO2/i);
  await expect(dataRow).toContainText('35.8');
  await expect(dataRow).toContainText('125 / 95');
  await expect(dataRow).toContainText('62');
  await expect(dataRow).toContainText('18');
  await expect(dataRow).toContainText('97');
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
