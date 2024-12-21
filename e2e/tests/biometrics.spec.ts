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

test('Record biometrics', async ({}) => {
  // setup
  const headerRow = biometricsAndVitalsPage.biometricsTable().locator('thead > tr');
  const dataRow = biometricsAndVitalsPage.biometricsTable().locator('tbody > tr');
  await visitsPage.startPatientVisit();
  
  // replay
  await biometricsAndVitalsPage.navigateToBiometricsAndVitalsPage();
  await biometricsAndVitalsPage.addPatientBiometrics();

  // verify
  await expect(headerRow).toContainText(/weight/i);
  await expect(headerRow).toContainText(/height/i);
  await expect(headerRow).toContainText(/bmi/i);
  await expect(headerRow).toContainText(/muac/i);
  await expect(dataRow).toContainText('76');
  await expect(dataRow).toContainText('164');
  await expect(dataRow).toContainText('28.3');
  await expect(dataRow).toContainText('34');
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
