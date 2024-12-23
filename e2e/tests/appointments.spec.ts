import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';
import { AppointmentsPage } from '../utils/pages/appoitnments-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let appointmentsPage: AppointmentsPage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  appointmentsPage = new AppointmentsPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
});

test('Add an appointment', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  
  // replay
  await appointmentsPage.navigateToAppointmentsPage();
  await appointmentsPage.addPatientAppointment();

  // verify
  await expect(page.getByRole('cell', { name: /inpatient ward/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /general medicine service/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /scheduled/i }).nth(0)).toBeVisible();
  await expect(page.getByRole('cell', { name: /this is an appointment./i })).toBeVisible();
});

test('Edit an appointment', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  await appointmentsPage.navigateToAppointmentsPage();
  await appointmentsPage.addPatientAppointment();
  await expect(page.getByRole('cell', { name: /general medicine service/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /this is an appointment./i })).toBeVisible();

  // replay
  appointmentsPage.editPatientAppointment();
  
  // verify
  await expect(page.getByRole('cell', { name: /general medicine service/i })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: /rehabilitation service/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /this is an appointment./i })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: /Revised appointment./i })).toBeVisible();
});

test('Cancel an appointment', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  await appointmentsPage.navigateToAppointmentsPage();
  await appointmentsPage.addPatientAppointment();
  await expect(page.getByRole('cell', { name: /inpatient ward/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /general medicine service/i })).toBeVisible();

  // replay
  appointmentsPage.cancelPatientAppointment();
  
  // verify
  await expect(appointmentsPage.page.getByText(/there are no appointments scheduled for today to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({ }) => {
  await homePage.voidPatient();
});
