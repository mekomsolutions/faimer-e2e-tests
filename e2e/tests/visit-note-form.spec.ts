import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { patientName, RegistrationPage } from '../utils/pages/registration-page';
import { ClinicalFormsPage, updatedVisitNote, visitNote } from '../utils/pages/clinical-forms-page';

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

test('Add a visit note', async ({ page }) => {
  // setup
  await formsPage.navigateToVisitNoteForm();

  // replay
  await formsPage.fillVisitNoteForm();
  await formsPage.saveForm();

  // verify
  await visitsPage.navigateToVisitsPage();
  await expect(page.getByText(visitNote)).toBeVisible();
});

test('Edit a visit note', async ({ page }) => {
  // setup
  await formsPage.navigateToVisitNoteForm();
  await formsPage.fillVisitNoteForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await expect(page.getByText(visitNote)).toBeVisible();

  // replay
  await formsPage.updateVisitNote();

  // verify
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToNotesPage();
  await expect(page.getByText(/Notes/)).toBeVisible();
  await expect(page.getByText(visitNote)).not.toBeVisible();
  await expect(page.getByText(updatedVisitNote)).toBeVisible();
});

test('Delete a visit note', async ({ page }) => {
  // setup
  await formsPage.navigateToVisitNoteForm();
  await formsPage.fillVisitNoteForm();
  await formsPage.saveForm();
  await visitsPage.navigateToVisitsPage();
  await expect(page.getByText(visitNote)).toBeVisible();

  // replay
  await formsPage.deleteEncounter();

  // verify
  await homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`);
  await visitsPage.navigateToVisitsPage();
  await formsPage.navigateToNotesPage();
  await expect(page.getByRole('heading', {name: /notes/i})).toBeVisible();
  await expect(page.getByText(visitNote)).not.toBeVisible();
  await expect(page.getByText(/there are no notes to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
