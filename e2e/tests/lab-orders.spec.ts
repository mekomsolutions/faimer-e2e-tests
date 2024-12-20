import { test, expect } from '@playwright/test';
import { delay, OpenMRS } from '../utils/pages/home-page';
import { OrdersPage } from '../utils/pages/orders-page';
import { VisitsPage } from '../utils/pages/visits-page';

let openmrs: OpenMRS;
let orders: OrdersPage;
let visits: VisitsPage;

test.beforeEach(async ({ page }) => {
  openmrs = new OpenMRS(page);
  orders = new OrdersPage(page);
  visits = new VisitsPage(page);

  await openmrs.login();
  await openmrs.createPatient();
  await visits.startPatientVisit();
});

test('Add a lab test.', async ({ page }) => {
  // setup
  await orders.navigateToLabOrderForm();

  // replay
  await page.getByRole('searchbox').fill('Bacteriuria test, urine');
  await delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await orders.saveLabOrder();

  // verify
  await orders.navigateToOrdersPage();
  await expect(page.getByRole('cell', { name: /test order/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /bacteriuria test, urine/i })).toBeVisible();
});

test('Modify a lab order.', async ({ page }) => {
  // setup
  await orders.navigateToLabOrderForm();
  await page.getByRole('searchbox').fill('Blood urea nitrogen');
  await delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await orders.saveLabOrder();
  await orders.navigateToOrdersPage();
  await expect(page.getByRole('cell', { name: /blood urea nitrogen/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /routine/i })).toBeVisible();

  // replay
  await orders.modifyLabOrder();
  await orders.saveLabOrder();

  // verify
  await expect(page.getByRole('cell', { name: /blood urea nitrogen/i })).toBeVisible();
  await expect(page.getByRole('cell', { name: /routine/i })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: /stat/i })).toBeVisible();
});

test('Discontinue a lab order.', async ({ page }) => {
  // setup
  await orders.navigateToLabOrderForm();
  await page.getByRole('searchbox').fill('Blood urea nitrogen');
  await delay(2500);
  await page.getByRole('button', { name: /order form/i }).click();
  await orders.saveLabOrder();

  // replay
  await orders.navigateToOrdersPage();
  await orders.cancelLabOrder();

  // verify
  await expect(page.getByText(/there are no orders to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({}) => {
  await openmrs.voidPatient();
});
