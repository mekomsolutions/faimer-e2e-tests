import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/pages/home-page';
import { MedicationsPage } from '../utils/pages/medications-page';
import { VisitsPage } from '../utils/pages/visits-page';
import { RegistrationPage } from '../utils/pages/registration-page';

let homePage: HomePage;
let visitsPage: VisitsPage;
let medicationsPage: MedicationsPage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  visitsPage = new VisitsPage(page);
  medicationsPage = new MedicationsPage(page);
  registrationPage = new RegistrationPage(page);

  await homePage.login();
  await registrationPage.navigateToRegistrationForm();
  await registrationPage.createPatient();
});

test('Add a drug order', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();

  // replay
  await medicationsPage.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 325mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await medicationsPage.fillDrugOrderForm();
  await medicationsPage.saveDrugOrder();

  // verify
  await medicationsPage.navigateToMedicationsPage();
  const dataRow = medicationsPage.medicationsTable().locator('tbody > tr');
  await expect(dataRow).toContainText(/aspirin 325mg/i);
  await expect(dataRow).toContainText(/12 tablet/i);
  await expect(dataRow).toContainText(/twice daily/i);
  await expect(dataRow).toContainText(/5 days/i);
  await expect(dataRow).toContainText(/intravenous/i);
  await expect(dataRow).toContainText(/indication hypertension/i);
});

test('Modify a drug order', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  await medicationsPage.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 325mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await medicationsPage.fillDrugOrderForm();
  await medicationsPage.saveDrugOrder();
  await medicationsPage.navigateToMedicationsPage();
  const dataRow = medicationsPage.medicationsTable().locator('tbody > tr');
  await expect(dataRow).toContainText(/aspirin 325mg/i);
  await expect(dataRow).toContainText(/12 tablet/i);
  await expect(dataRow).toContainText(/twice daily/i);
  await expect(dataRow).toContainText(/5 days/i);

  // replay
  await page.getByRole('button', { name: /options/i, exact: true }).click();
  await page.getByRole('menuitem', { name: /modify/i, exact: true }).click();
  await medicationsPage.modifyDrugOrder();

  // verify
  await medicationsPage.navigateToMedicationsPage();
  await expect(dataRow).toContainText(/aspirin 325mg/i);
  await expect(dataRow.nth(0)).toContainText(/8 tablet/i);
  await expect(dataRow.nth(0)).toContainText(/thrice daily/i);
  await expect(dataRow.nth(0)).toContainText(/6 days/i);
});

test('Discontinue a drug order', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();
  await medicationsPage.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 325mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await medicationsPage.fillDrugOrderForm();
  await medicationsPage.saveDrugOrder();

  // replay
  await medicationsPage.navigateToMedicationsPage();
  await medicationsPage.discontinueDrugOrder();

  // verify
  await expect(page.getByText(/there are no active medications to display for this patient/i)).toBeVisible();
});

test('Add a drug order with free text dosage', async ({ page }) => {
  // setup
  await visitsPage.startPatientVisit();

  // replay
  await medicationsPage.navigateToDrugOrderForm();
  await page.getByRole('searchbox').fill('Aspirin 81mg');
  await page.getByRole('button', { name: /order form/i }).click();
  await page.locator('div').filter({ hasText: /^Off$/ }).locator('div').click();
  await page.getByPlaceholder(/free text dosage/i).fill('2 Tablets - Every after eight hours - To be taken after a meal.');
  await page.getByLabel('Duration', { exact: true }).fill('3');
  await page.getByLabel(/quantity to dispense/i).fill('18');
  await page.getByLabel(/prescription refills/i).fill('2');
  await page.locator('#indication').fill('Hypertension');
  await medicationsPage.saveDrugOrder();

  // verify
  await medicationsPage.navigateToMedicationsPage();
  const dataRow = medicationsPage.medicationsTable().locator('tbody > tr');
  await expect(dataRow).toContainText(/aspirin 81mg/i);
  await expect(dataRow).toContainText(/18 tablet/i);
  await expect(dataRow).toContainText(/3 days/i);
  await expect(dataRow).toContainText(/2 tablets - every after eight hours - to be taken after a meal/i);
  await expect(dataRow).toContainText(/indication hypertension/i);
});

test.afterEach(async ({}) => {
  await homePage.voidPatient();
});
