import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { patientName, RegistrationPage } from '../utils/pages/registration-page';
import { 
  ClinicalFormsPage,
  complications,
  consent,
  indication,
  physcian,
  procedure,
  procedureSummary,
  updatedComplications,
  updatedConsent,
  UpdatedProcedureSummary,
   } from '../utils/pages/clinical-forms-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let registrationPage: RegistrationPage;
let formsPage: ClinicalFormsPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  formsPage = new ClinicalFormsPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
  await visitsPage.startPatientVisit();
  await formsPage.navigateToClinicalForms();
});

test('Add procedure note', async ({ page }) => {
  // setup
  await formsPage.navigateToProcedureNoteForm();

  // replay
  await formsPage.fillProcedureNoteForm();
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(procedure)).toBeVisible();
  await expect(page.getByText(indication)).toBeVisible();
  await expect(page.getByText(physcian)).toBeVisible();
  await expect(page.getByText(consent)).toBeVisible();
  await expect(page.getByText(/local anesthesia and sedation/i)).toBeVisible();
  await expect(page.getByText(procedureSummary)).toBeVisible();
  await expect(page.getByText(complications)).toBeVisible();
});

test('Edit procedure note', async ({ page }) => {
  // setup
  await formsPage.navigateToProcedureNoteForm();
  await formsPage.fillProcedureNoteForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(procedure)).toBeVisible();
  await expect(page.getByText(indication)).toBeVisible();
  await expect(page.getByText(physcian)).toBeVisible();
  await expect(page.getByText(consent)).toBeVisible();
  await expect(page.getByText(/local anesthesia and sedation/i)).toBeVisible();
  await expect(page.getByText(procedureSummary)).toBeVisible();
  await expect(page.getByText(complications)).toBeVisible();

  // replay
  await formsPage.updateProcedureNote();

  // verify
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(consent)).not.toBeVisible();
  await expect(page.getByText(updatedConsent)).toBeVisible();
  await expect(page.getByText(/local anesthesia and sedation/i)).not.toBeVisible();
  await expect(page.getByText(/monitored anesthesia care/i)).toBeVisible();
  await expect(page.getByText(procedureSummary)).not.toBeVisible();
  await expect(page.getByText(UpdatedProcedureSummary)).toBeVisible();
  await expect(page.getByText(complications)).not.toBeVisible();
  await expect(page.getByText(updatedComplications)).toBeVisible();
});

test('Delete procudure note', async ({ page }) => {
  // setup
  await formsPage.navigateToProcedureNoteForm();
  await formsPage.fillProcedureNoteForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(procedure)).toBeVisible();
  await expect(page.getByText(indication)).toBeVisible();
  await expect(page.getByText(physcian)).toBeVisible();
  await expect(page.getByText(consent)).toBeVisible();
  await expect(page.getByText(/local anesthesia and sedation/i)).toBeVisible();
  await expect(page.getByText(procedureSummary)).toBeVisible();
  await expect(page.getByText(complications)).toBeVisible();

  // replay
  await page.getByRole('button', { name: /danger delete this encounter/i }).click();
  await page.getByRole('button', { name: 'danger Delete', exact: true }).click(), delay(3000);

  // verify
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await expect(page.getByText(/There are no encounters to display for this patient/).nth(0)).toBeVisible();
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
