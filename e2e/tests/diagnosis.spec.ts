import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';
import { DiagnosisPage } from '../utils/pages/visit-note-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let diagnosisPage: DiagnosisPage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  diagnosisPage = new DiagnosisPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
});

test('Add a diagnosis', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  
  // replay
  await diagnosisPage.navigateToDiagnosisPage();
  await diagnosisPage.addDiagnosis();

  // verify
  await visitsPage.navigateToVisitsPage();
  await expect(page.getByText(/diabetic ketoacidosis/i)).toBeVisible();
  await expect(page.getByText(/patient has excessive thirst, frequent urination, nausea and vomiting/i)).toBeVisible();
});

test('Delete a diagnosis', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  await diagnosisPage.navigateToDiagnosisPage();
  await diagnosisPage.addDiagnosis();

  // replay
  await visitsPage.navigateToVisitsPage();
  await diagnosisPage.deleteDiagnosis();

  // verify
  await expect(page.getByLabel(/all encounters/i).getByText(/there are no encounters to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
