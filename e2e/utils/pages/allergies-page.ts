import { expect, type Page } from '@playwright/test';
import { delay } from './home-page';

export class AllergiesPage {
  constructor(readonly page: Page) {}

  readonly allergiesTable = () => this.page.getByRole('table', { name: /allergies summary/i });

  async navigateToAllergiesPage() {
    await this.page.getByRole('link', { name: /allergies/i }).click();
  }

  async addPatientAllergies() {
    await this.page.getByText(/record allergy intolerance/i).click();
    await this.page.getByPlaceholder(/select the allergen/i).click();
    await this.page.getByText(/dairy food/i).click();
    await this.page.getByText(/diarrhea/i).click();
    await this.page.getByText(/moderate/i).click();
    await this.page.locator('#comments').fill('Gas and bloating after eating boiled eggs');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/allergy saved/i)).toBeVisible(), delay(2000);
  }

  async editPatientAllergies() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click();
    await this.page.getByRole('menuitem', { name: /edit/i }).click();
    await this.page.getByPlaceholder(/select the allergen/i).click();
    await this.page.getByTestId('allergens-container').getByText(/eggs/i).click();
    await this.page.getByText(/severe/i).click();
    await this.page.locator('#comments').fill('Gas and bloating after eating');
    await this.page.getByRole('button', { name: /save and close/i }).click();
    await expect(this.page.getByText(/allergy updated/i)).toBeVisible(), delay(2000);
  }

  async removePatientAllergies() {
    await this.page.getByRole('button', { name: /options/i }).nth(0).click();
    await this.page.getByRole('menuitem', { name: /delete/i }).click();
    await this.page.getByRole('button', { name: /delete/i }).click();
    await expect(this.page.getByText(/allergy deleted/i)).toBeVisible();
  }
}
