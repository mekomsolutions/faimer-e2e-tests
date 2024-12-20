import { test, expect } from '@playwright/test';
import { OpenMRS } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';

let openmrs: OpenMRS;
let visits: VisitsPage;

test.beforeEach(async ({ page }) => {
  openmrs = new OpenMRS(page);
  visits = new VisitsPage(page);

  await openmrs.login();
});

test('Start patient visit.', async ({}) => {
  // setup
  await openmrs.createPatient();

  // replay
  await visits.startPatientVisit();

  // verify
  await visits.navigateToVisitsPage();
  await expect(visits.page.getByRole('heading', {name: 'Facility Visit'})).toBeVisible();
  await expect(visits.page.getByText(/active visit/i)).toBeVisible();
});

test('Edit patient visit.', async ({}) => {
  // setup
  await openmrs.createPatient();
  await visits.startPatientVisit();
  await visits.navigateToVisitsPage();
  await expect(visits.page.getByRole('heading', {name: 'Facility Visit'})).toBeVisible();

  // replay
  await visits.editPatientVisit();

  // verify
  await expect(visits.page.getByRole('heading', {name: 'Facility Visit'})).not.toBeVisible();
  await expect(visits.page.getByRole('heading', {name: 'Home Visit'})).toBeVisible();
  await expect(visits.page.getByText(/active visit/i)).toBeVisible();
});

test('End patient visit.', async ({}) => {
  // setup
  await openmrs.createPatient();
  await visits.startPatientVisit();

  // replay
  await visits.endPatientVisit();

  // verify
  await expect(visits.page.getByText(/active visit/i)).not.toBeVisible();
});

test.afterEach(async ({}) => {
  await openmrs.voidPatient();
});
