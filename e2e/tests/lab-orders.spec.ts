import { test, expect } from '@playwright/test';
import { delay, HomePage } from '../utils/pages/home-page';
import { OrdersPage } from '../utils/pages/orders-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let ordersPage: OrdersPage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  ordersPage = new OrdersPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
  await visitsPage.startPatientVisit();
});

test('Add a lab test', async ({ page }) => {
  // setup
  await ordersPage.navigateToLabOrderForm();

  // replay
  await page.getByRole('searchbox').fill('Bacteriuria test, urine'), delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.saveLabOrder();

  // verify
  await ordersPage.navigateToOrdersPage();
  await expect(page.getByRole('cell', { name: /test order/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /bacteriuria test, urine/i })).toBeVisible();
});

test('Modify a lab order', async ({ page }) => {
  // setup
  await ordersPage.navigateToLabOrderForm();
  await page.getByRole('searchbox').fill('Blood urea nitrogen'), delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.saveLabOrder();
  await ordersPage.navigateToOrdersPage();
  await expect(page.getByRole('cell', { name: /blood urea nitrogen/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /routine/i })).toBeVisible();

  // replay
  await ordersPage.modifyLabOrder();
  await ordersPage.saveLabOrder();

  // verify
  await expect(page.getByRole('cell', { name: /blood urea nitrogen/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /routine/i })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: /stat/i })).toBeVisible();
});

test('Discontinue a lab order', async ({ page }) => {
  // setup
  await ordersPage.navigateToLabOrderForm();
  await page.getByRole('searchbox').fill('Blood urea nitrogen'), delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await ordersPage.saveLabOrder();

  // replay
  await ordersPage.navigateToOrdersPage();
  await ordersPage.cancelLabOrder();

  // verify
  await expect(page.getByText(/there are no orders to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
