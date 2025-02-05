import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
import { patientName, RegistrationPage } from '../utils/pages/registration-page';
import { firstUser, Keycloak, secondUser } from '../utils/pages/keycloak';

let homePage: HomePage;
let keycloak: Keycloak;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  keycloak = new Keycloak(page);
  registrationPage = new RegistrationPage(page);

  await keycloak.login();
});

test('User creation and data filtering', async ({ page }) => {
  // setup
  await keycloak.navigateToUsers();
  await keycloak.addUserButton().click();
  await keycloak.createFirstUser();
  await keycloak.navigateToCredentials();
  await keycloak.createUserPassword();
  await keycloak.navigateToRoles();
  await keycloak.assignRoleToUser();
  await page.getByLabel('Breadcrumb').getByRole('link', { name: /users/i }).click();
  await keycloak.addUserButton().click();
  await keycloak.createSecondUser();
  await keycloak.navigateToCredentials();
  await keycloak.createUserPassword();
  await keycloak.navigateToRoles();
  await keycloak.assignRoleToUser();

  // replay
  await homePage.navigateToLoginPage();
  await homePage.loginWithFirstUser();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
  await homePage.navigateToHomePage();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill(`${patientName.firstName} ${patientName.givenName}`), delay(2000);
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(/1 search result/);
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(new RegExp(patientName.firstName));
  await expect(homePage.floatingSearchResultsContainer()).toHaveText(new RegExp(patientName.givenName));
  await homePage.clickOnPatientResult(`${patientName.firstName}  ${patientName.givenName}`);
  await expect(page.locator('header[aria-label="patient banner"]').getByText(`${patientName.firstName + ' ' + patientName.givenName}`)).toBeVisible();
  await page.getByRole('button', { name: /close/i }).click();
  await homePage.logout();

  // verify
  await homePage.loginWithSecondUser();
  await homePage.patientSearchIcon().click();
  await homePage.patientSearchBar().fill(`${patientName.firstName} ${patientName.givenName}`), delay(2000);
  //await expect(homePage.floatingSearchResultsContainer()).toHaveText(/sorry, no patient charts were found/);
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
  await keycloak.deleteUser();
});
