import { test, expect } from '@playwright/test';
import { OpenMRS } from '../utils/pages/home-page';
import { ConditionsPage } from '../utils/pages/conditions-page';
import { VisitsPage } from '../utils/pages/visits-page';

let openmrs: OpenMRS;
let conditions: ConditionsPage;
let visits: VisitsPage;

test.beforeEach(async ({ page }) => {
  openmrs = new OpenMRS(page);
  conditions = new ConditionsPage(page);
  visits = new VisitsPage(page);

  await openmrs.login();
  await openmrs.createPatient();
});

test('Add a condition', async ({}) => {
  // setup
  const dataRow = conditions.conditionsTable().locator('tbody > tr');
  await visits.startPatientVisit();
  
  // replay
  await conditions.navigateToConditionsPage();
  await conditions.addPatientCondition();

  // verify
  await expect(dataRow).toContainText(/typhoid fever/i);
  await expect(dataRow).toContainText(/jul 2023/i);
  await expect(dataRow).toContainText(/active/i);
});

test('Edit a condition', async ({}) => {
  // setup
  const dataRow = conditions.conditionsTable().locator('tbody > tr');
  await visits.startPatientVisit();
  await conditions.navigateToConditionsPage();
  await conditions.addPatientCondition();
  await expect(dataRow).toContainText(/typhoid fever/i);
  await expect(dataRow).toContainText(/jul 2023/i);
  await expect(dataRow).toContainText(/active/i);

  // replay
  await conditions.editPatientCondition();

  // verify
  await conditions.page.getByRole('combobox', { name: /show/i }).click();
  await conditions.page.getByText('All', {exact: true}).click();
  await expect(dataRow).toContainText(/typhoid fever/i);
  await expect(dataRow).not.toContainText(/jul 2023/i);
  await expect(dataRow).toContainText(/aug 2023/i);
  await expect(dataRow).toContainText(/inactive/i);
});

test('Delete a condition', async ({}) => {
  // setup
  await visits.startPatientVisit();
  await conditions.navigateToConditionsPage();
  await conditions.addPatientCondition();

  // replay
  await conditions.voidPatientCondition();

  // verify
  await expect(conditions.page.getByText(/there are no conditions to display for this patient/i)).toBeVisible();
});

test.afterEach(async ({}) => {
  await openmrs.voidPatient();
});
