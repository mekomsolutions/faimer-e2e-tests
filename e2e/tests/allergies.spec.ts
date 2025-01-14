import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';
import { AllergiesPage } from '../utils/pages/allergies-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let registrationPage: RegistrationPage;
let allergiesPage: AllergiesPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  registrationPage = new RegistrationPage(page);
  allergiesPage = new AllergiesPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
});

test('Add an allergy', async ({}) => {
  // setup
  const headerRow = allergiesPage.allergiesTable().locator('thead > tr');
  const dataRow = allergiesPage.allergiesTable().locator('tbody > tr');
  await visitsPage.startPatientVisit();
  
  // replay
  await allergiesPage.navigateToAllergiesPage();
  await allergiesPage.addPatientAllergies();

  // verify
  await expect(headerRow).toContainText(/allergen/i);
  await expect(headerRow).toContainText(/severity/i);
  await expect(headerRow).toContainText(/reaction/i);
  await expect(headerRow).toContainText(/onset date and comments/i);
  await expect(dataRow).toContainText(/dairy food/i);
  await expect(dataRow).toContainText(/moderate/i);
  await expect(dataRow).toContainText(/diarrhea/i);
  await expect(dataRow).toContainText(/gas and bloating after eating boiled eggs/i);
});

test('Edit an allergy', async ({}) => {
  // setup
  const dataRow = allergiesPage.allergiesTable().locator('tbody > tr');
  await visitsPage.startPatientVisit();
  await allergiesPage.navigateToAllergiesPage();
  await allergiesPage.addPatientAllergies();
  await expect(dataRow).toContainText(/dairy food/i);
  await expect(dataRow).toContainText(/moderate/i);
  await expect(dataRow).toContainText(/diarrhea/i);
  await expect(dataRow).toContainText(/gas and bloating after eating boiled eggs/i);

  // replay
  await allergiesPage.updatePatientAllergies();

  // verify
  await expect(dataRow).not.toContainText(/dairy food/i);
  await expect(dataRow).toContainText(/eggss/i);
  await expect(dataRow).not.toContainText(/mild/i);
  await expect(dataRow).toContainText(/severe/i);
  await expect(dataRow).not.toContainText(/gas and bloating after eating boiled eggs/i);
  await expect(dataRow).toContainText(/gas and bloating after eating/i);
});

test('Delete an allergy', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  await allergiesPage.navigateToAllergiesPage();
  await allergiesPage.addPatientAllergies();

  // replay
  await allergiesPage.removePatientAllergies();

  // verify
  await expect(page.getByText(/dairy food/i)).not.toBeVisible();
  await expect(page.getByText(/there are no allergy intolerances to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
