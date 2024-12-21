import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { ConditionsPage } from '../utils/pages/conditions-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let conditionsPage: ConditionsPage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  conditionsPage = new ConditionsPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
});

test('Add a condition', async ({}) => {
  // setup
  const dataRow = conditionsPage.conditionsTable().locator('tbody > tr');
  await visitsPage.startPatientVisit();
  
  // replay
  await conditionsPage.navigateToConditionsPage();
  await conditionsPage.addPatientCondition();

  // verify
  await expect(dataRow).toContainText(/typhoid fever/i);
  await expect(dataRow).toContainText(/jul 2023/i);
  await expect(dataRow).toContainText(/active/i);
});

test('Edit a condition', async ({page}) => {
  // setup
  const dataRow = conditionsPage.conditionsTable().locator('tbody > tr');
  await visitsPage.startPatientVisit();
  await conditionsPage.navigateToConditionsPage();
  await conditionsPage.addPatientCondition();
  await expect(dataRow).toContainText(/typhoid fever/i);
  await expect(dataRow).toContainText(/jul 2023/i);
  await expect(dataRow).toContainText(/active/i);

  // replay
  await conditionsPage.editPatientCondition();

  // verify
  await page.getByRole('combobox', { name: /show/i }).click();
  await page.getByText('All', {exact: true}).click();
  await expect(dataRow).toContainText(/typhoid fever/i);
  await expect(dataRow).not.toContainText(/jul 2023/i);
  await expect(dataRow).toContainText(/aug 2023/i);
  await expect(dataRow).toContainText(/inactive/i);
});

test('Delete a condition', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  await conditionsPage.navigateToConditionsPage();
  await conditionsPage.addPatientCondition();

  // replay
  await conditionsPage.voidPatientCondition();

  // verify
  await expect(page.getByText(/there are no conditions to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
