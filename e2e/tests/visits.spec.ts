import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
});

test('Start patient visit', async ({ page }) => {
  // setup
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();

  // replay
  await visitsPage.startPatientVisit();

  // verify
  await visitsPage.navigateToVisitsPage();
  await expect(page.getByRole('heading', {name: 'Facility Visit'})).toBeVisible();
  await expect(page.getByText(/active visit/i)).toBeVisible();
});

test('Edit patient visit', async ({ page }) => {
  // setup
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
  await visitsPage.startPatientVisit();
  await visitsPage.navigateToVisitsPage();
  await expect(page.getByRole('heading', {name: 'Facility Visit'})).toBeVisible();

  // replay
  await visitsPage.updatePatientVisit();

  // verify
  await expect(page.getByRole('heading', {name: 'Facility Visit'})).not.toBeVisible();
  await expect(page.getByRole('heading', {name: 'Home Visit'})).toBeVisible();
  await expect(page.getByText(/active visit/i)).toBeVisible();
});

test('End patient visit', async ({ page }) => {
  // setup
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
  await visitsPage.startPatientVisit();

  // replay
  await visitsPage.endPatientVisit();

  // verify
  await expect(page.getByText(/active visit/i)).not.toBeVisible();
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
