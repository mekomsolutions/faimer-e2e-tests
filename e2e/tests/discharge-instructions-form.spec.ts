import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { patientName, RegistrationPage } from '../utils/pages/registration-page';
import { 
  ClinicalFormsPage,
  additionalInstructions,
  dischargeMedications,
  followUpAppointment,
  reasonsToContactDoctor,
  treatmentInformationAndInstructions,
  updatedAdditionalInstructions,
  updatedDischargeMedications,
  updatedFollowUpAppointment,
  updatedReasonsToContactDoctor,
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

test('Add discharge instructions', async ({ page }) => {
  // setup
  await formsPage.navigateToDischargeInstructionsForm();

  // replay
  await formsPage.fillDischargeInstructionsForm();
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(treatmentInformationAndInstructions)).toBeVisible();
  await expect(page.getByText(reasonsToContactDoctor)).toBeVisible();
  await expect(page.getByText(dischargeMedications)).toBeVisible();
  await expect(page.getByText(followUpAppointment)).toBeVisible();
  await expect(page.getByText(additionalInstructions)).toBeVisible();
});

test('Edit discharge instructions', async ({ page }) => {
  // setup
  await formsPage.navigateToDischargeInstructionsForm();
  await formsPage.fillDischargeInstructionsForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(treatmentInformationAndInstructions)).toBeVisible();
  await expect(page.getByText(reasonsToContactDoctor)).toBeVisible();
  await expect(page.getByText(dischargeMedications)).toBeVisible();
  await expect(page.getByText(followUpAppointment)).toBeVisible();
  await expect(page.getByText(additionalInstructions)).toBeVisible();

  // replay
  await formsPage.updateDischargeInstructions();

  // verify
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(treatmentInformationAndInstructions)).toBeVisible();
  await expect(page.getByText(reasonsToContactDoctor)).not.toBeVisible();
  await expect(page.getByText(updatedReasonsToContactDoctor)).toBeVisible();
  await expect(page.getByText(dischargeMedications)).not.toBeVisible();
  await expect(page.getByText(updatedDischargeMedications)).toBeVisible();
  await expect(page.getByText(followUpAppointment)).not.toBeVisible();
  await expect(page.getByText(updatedFollowUpAppointment)).toBeVisible();
  await expect(page.getByText(additionalInstructions)).not.toBeVisible();
  await expect(page.getByText(updatedAdditionalInstructions)).toBeVisible();
});

test('Delete discharge instructions', async ({ page }) => {
  // setup
  await formsPage.navigateToDischargeInstructionsForm();
  await formsPage.fillDischargeInstructionsForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToEncounterPage();
  await page.getByRole('button', { name: /expand current row/i }).click();
  await expect(page.getByText(treatmentInformationAndInstructions)).toBeVisible();
  await expect(page.getByText(reasonsToContactDoctor)).toBeVisible();
  await expect(page.getByText(dischargeMedications)).toBeVisible();
  await expect(page.getByText(followUpAppointment)).toBeVisible();
  await expect(page.getByText(additionalInstructions)).toBeVisible();

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
