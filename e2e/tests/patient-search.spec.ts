import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
import { patientName, patientContact, RegistrationPage } from '../utils/pages/registration-page';

let homePage: HomePage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
});

test('Search patient by given name', async ({ page }) => {
  // setup
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();

  // replay
  await homePage.goToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill(`${patientName.givenName}`), delay(2000);

  // verify
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(/1 search result/);
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(new RegExp(patientName.firstName));
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(new RegExp(patientName.givenName));
  await homePage.clickOnPatientResult(`${patientName.firstName}  ${patientName.givenName}`);
  await expect(page.locator('header[aria-label="patient banner"]').getByText(`${patientName.firstName + ' ' + patientName.givenName}`)).toBeVisible();
});

test('Search patient by full name', async ({ page }) => {
  // setup
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();

  // replay
  await homePage.goToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill(`${patientName.firstName} ${patientName.givenName}`), delay(2000);

  // verify
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(/1 search result/);
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(new RegExp(patientName.firstName));
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(new RegExp(patientName.givenName));
  await homePage.clickOnPatientResult(`${patientName.firstName}  ${patientName.givenName}`);
  await expect(page.locator('header[aria-label="patient banner"]').getByText(`${patientName.firstName + ' ' + patientName.givenName}`)).toBeVisible();
});

test('Search patient by patient identifier', async ({ page }) => {
  // setup
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
  await homePage.searchPatientId();
  const openmrsIdentifier = await page.textContent('#demographics section p:nth-child(2)');

  // replay
  await homePage.goToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill(`${openmrsIdentifier}`), delay(2000);

  // verify
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(/1 search result/);
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(new RegExp(patientName.firstName));
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(new RegExp(patientName.givenName));
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(new RegExp(`${openmrsIdentifier}`));
  await homePage.clickOnPatientResult(`${patientName.firstName}  ${patientName.givenName}`);
  await expect(page.locator('header[aria-label="patient banner"]').getByText(`${patientName.firstName + ' ' + patientName.givenName}`)).toBeVisible();
});

test('Search patient by postal code', async ({ page }) => {
  // setup
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();

  // replay
  await homePage.goToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill('e2e_test'), delay(3000);
  await homePage.patientAdvancedSearch().click(), delay(2000);
  //
  await page.locator('#postcode').fill(`${patientContact.postalCode}`);
  await page.getByRole('button', { name: /apply/i }).click(), delay(2000);

  // verify
  await expect(page.getByText(/1 search result/)).toBeVisible();
  await expect(page.getByText(`${patientName.firstName} ${patientName.givenName}`)).toBeVisible();
  await page.getByRole('link', { name: `${patientName.firstName}  ${patientName.givenName}`}).click();
  await expect(page.locator('header[aria-label="patient banner"]').getByText(`${patientName.firstName + ' ' + patientName.givenName}`)).toBeVisible();
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
