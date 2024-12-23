import { test, expect } from '@playwright/test';
import { delay, HomePage} from '../utils/pages/home-page';
import { patientName, RegistrationPage } from '../utils/pages/registration-page';

let homePage: HomePage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  registrationPage = new RegistrationPage(page);
});

test('Register a new patient', async ({ page }) => {
  // setup
  await homePage.login();

  // replay
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();

  // verify
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  const patientBanner = page.locator('header[aria-label="patient banner"]');
  await expect(patientBanner.getByText(`${patientName.firstName + ' ' + patientName.givenName}`)).toBeVisible();
  await expect(patientBanner.getByText(/male/i)).toBeVisible();
  await expect(patientBanner.getByText(/18-Feb-1999/i)).toBeVisible();
  await homePage.voidPatient();
});

test('Register an unknown patient', async ({ page }) => {
  // setup
  await homePage.login();

  // replay
  await registrationPage.navigateToRegistrationForm();
  await page.getByRole('tab', { name: /no/i }).first().click();
  await page.locator('label').filter({ hasText: /female/i }).locator('span').first().click();
  await page.getByRole('tab', { name: /no/i }).nth(1).click();
  await page.getByLabel(/estimated age in years/i).fill(`${Math.floor(Math.random() * 99)}`);
  await registrationPage.createPatientButton().click(), delay(4000);

  // verify
  await homePage.goToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('Unknown Unknown');
  await page.getByRole('link', { name: `Unknown Unknown` }).first().click();
  const patientBanner = page.locator('header[aria-label="patient banner"]');
  await expect(patientBanner.getByText('Unknown Unknown')).toBeVisible();
  await expect(patientBanner.getByText(/female/i)).toBeVisible();
  await homePage.voidUnknownPatient();
});

test('Edit patient details', async ({ page }) => {
  // setup
  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  const patientBanner = page.locator('header[aria-label="patient banner"]');
  await expect(patientBanner.getByText(`${patientName.firstName + ' ' + patientName.givenName}`)).toBeVisible();

  // replay
  await registrationPage.updatePatientDetails();

  // verify
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await expect(patientBanner.getByText(`${patientName.firstName + ' ' + patientName.givenName}`)).toBeVisible();
  await expect(patientBanner.getByText(/female/i)).toBeVisible();
  await expect(patientBanner.getByText(/28-Apr-1999/i)).toBeVisible();
  await homePage.voidPatient();
});
