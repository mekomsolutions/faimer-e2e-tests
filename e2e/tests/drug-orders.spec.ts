import { test, expect } from '@playwright/test';
import { OpenMRS } from '../utils/pages/home-page';
import { MedicationsPage } from '../utils/pages/medications-page';
import { VisitsPage } from '../utils/pages/visits-page';

let openmrs: OpenMRS;
let medications: MedicationsPage;
let visits: VisitsPage;

test.beforeEach(async ({ page }) => {
  openmrs = new OpenMRS(page);
  medications = new MedicationsPage(page);
  visits = new VisitsPage(page);

  await openmrs.login();
  await openmrs.createPatient();
});

test('Add a drug order.', async ({ page }) => {
  // setup
  await visits.startPatientVisit();

  // replay
  await medications.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 325mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await medications.fillDrugOrderForm();
  await medications.saveDrugOrder();

  // verify
  await medications.navigateToMedicationsPage();
  const dataRow = medications.medicationsTable().locator('tbody > tr');
  await expect(dataRow).toContainText(/aspirin 325mg/i);
  await expect(dataRow).toContainText(/12 tablet/i);
  await expect(dataRow).toContainText(/twice daily/i);
  await expect(dataRow).toContainText(/5 days/i);
  await expect(dataRow).toContainText(/intravenous/i);
  await expect(dataRow).toContainText(/indication hypertension/i);
});

test('Modify a drug order.', async ({ page }) => {
  // setup
  await visits.startPatientVisit();
  await medications.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 325mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await medications.fillDrugOrderForm();
  await medications.saveDrugOrder();
  await medications.navigateToMedicationsPage();
  const dataRow = medications.medicationsTable().locator('tbody > tr');
  await expect(dataRow).toContainText(/aspirin 325mg/i);
  await expect(dataRow).toContainText(/12 tablet/i);
  await expect(dataRow).toContainText(/twice daily/i);
  await expect(dataRow).toContainText(/5 days/i);

  // replay
  await page.getByRole('button', { name: /options/i, exact: true }).click();
  await page.getByRole('menuitem', { name: /modify/i, exact: true }).click();
  await medications.modifyDrugOrder();

  // verify
  await medications.navigateToMedicationsPage();
  await expect(dataRow).toContainText(/aspirin 325mg/i);
  await expect(dataRow.nth(0)).toContainText(/8 tablet/i);
  await expect(dataRow.nth(0)).toContainText(/thrice daily/i);
  await expect(dataRow.nth(0)).toContainText(/6 days/i);
});

test('Discontinue a drug order.', async ({ page }) => {
  // setup
  await visits.startPatientVisit();
  await medications.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 325mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await medications.fillDrugOrderForm();
  await medications.saveDrugOrder();

  // replay
  await medications.navigateToMedicationsPage();
  await medications.discontinueDrugOrder();

  // verify
  await expect(page.getByText(/there are no active medications to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({}) => {
  await openmrs.voidPatient();
});
