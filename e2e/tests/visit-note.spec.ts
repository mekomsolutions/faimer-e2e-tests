import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';
import { VisitNotePage } from '../utils/pages/visit-note-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let visitNotePage: VisitNotePage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  visitNotePage = new VisitNotePage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
});

test('Add a visit note', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  
  // replay
  await visitNotePage.navigateToVisitNotePage();
  await visitNotePage.addVisitNote();

  // verify
  await visitsPage.navigateToVisitsPage();
  await expect(page.getByText(/diabetic ketoacidosis/i)).toBeVisible();
  await expect(page.getByText(/patient has excessive thirst, frequent urination, nausea and vomiting/i)).toBeVisible();
});

test('Delete a visit note', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  await visitNotePage.navigateToVisitNotePage();
  await visitNotePage.addVisitNote();

  // replay
  await visitsPage.navigateToVisitsPage();
  await visitNotePage.deleteVisitNote();

  // verify
  await expect(page.getByLabel(/all encounters/i).getByText(/there are no encounters to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
