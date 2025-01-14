import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { patientName, RegistrationPage } from '../utils/pages/registration-page';
import { 
  ClinicalFormsPage,
  consultations,
  dischargeInstructions,
  dischargeMedications,
  dischargeTo,
  hospitalCourse,
  procedure,
  updatedConsultations,
  updatedDischargeMedications,
  updatedHospitalCourse,
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

test('Add discharge summary', async ({ page }) => {
  // setup
  await formsPage.navigateToDischargeSummaryForm();

  // replay
  await formsPage.fillDischargeSummaryForm();
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(procedure)).toBeVisible();
  await expect(page.getByText(consultations)).toBeVisible();
  await expect(page.getByText(hospitalCourse)).toBeVisible();
  await expect(page.getByText(dischargeTo)).toBeVisible();
  await expect(page.getByText(/acute cholecystitis/i)).toBeVisible();
  await expect(page.getByText(dischargeMedications)).toBeVisible();
  await expect(page.getByText(dischargeInstructions)).toBeVisible();
});

test('Edit discharge summary', async ({ page }) => {
  // setup
  await formsPage.navigateToDischargeSummaryForm();
  await formsPage.fillDischargeSummaryForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(procedure)).toBeVisible();
  await expect(page.getByText(consultations)).toBeVisible();
  await expect(page.getByText(hospitalCourse)).toBeVisible();
  await expect(page.getByText(dischargeTo)).toBeVisible();
  await expect(page.getByText(/acute cholecystitis/i)).toBeVisible();
  await expect(page.getByText(dischargeMedications)).toBeVisible();
  await expect(page.getByText(dischargeInstructions)).toBeVisible();

  // replay
  await formsPage.updateDischargeSummary();

  // verify
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(consultations)).not.toBeVisible();
  await expect(page.getByText(updatedConsultations)).toBeVisible();
  await expect(page.getByText(hospitalCourse)).not.toBeVisible();
  await expect(page.getByText(updatedHospitalCourse)).toBeVisible();
  await expect(page.getByText(/acute cholecystitis/i)).not.toBeVisible();
  await expect(page.getByText(/acute peptic ulcer with perforation/i)).toBeVisible();
  await expect(page.getByText(dischargeMedications)).not.toBeVisible();
  await expect(page.getByText(updatedDischargeMedications)).toBeVisible();
  await expect(page.getByText(dischargeInstructions)).not.toBeVisible();
  await expect(page.getByText(updatedDischargeMedications)).toBeVisible();
});

test('Delete discharge summary', async ({ page }) => {
  // setup
  await formsPage.navigateToDischargeSummaryForm();
  await formsPage.fillDischargeSummaryForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(procedure)).toBeVisible();
  await expect(page.getByText(consultations)).toBeVisible();
  await expect(page.getByText(hospitalCourse)).toBeVisible();
  await expect(page.getByText(dischargeTo)).toBeVisible();
  await expect(page.getByText(/acute cholecystitis/i)).toBeVisible();
  await expect(page.getByText(dischargeMedications)).toBeVisible();
  await expect(page.getByText(dischargeInstructions)).toBeVisible();

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
