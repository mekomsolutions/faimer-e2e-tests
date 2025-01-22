import { expect, type Page } from '@playwright/test';
import { delay } from './home-page';

export const treatmentInformationAndInstructions = `Condition Diagnosed: Hypertension.\nTake the medication once daily in the morning, preferably at the same time each day to maintain consistency.`;
export const reasonsToContactDoctor = `Persistent headaches, blurred vision, or dizziness that does not improve.`;
export const updatedReasonsToContactDoctor = `Persistent headaches, blurred vision, and dizziness that does not improve.`;
export const dischargeMedications = `Aspirin 81 mg (Antiplatelet).\nDosage: Take 1 tablet by mouth once a day.\nInstructions: Take with food to avoid stomach upset.`;
export const updatedDischargeMedications = `Aspirin 81 mg (Antiplatelet).\nDosage: Take 2 tablets by mouth once a day.\nInstructions: Take with food to avoid stomach upset.`;
export const followUpAppointment = `Date: March 10, 2025.\nTime: 10:30 AM.\nLocation: ABC Medical Center, Room 205.\nProvider: Dr. Allen Hanandez, Cardiologist.`;
export const updatedFollowUpAppointment = `Date: March 14, 2025.\nTime: 11:30 AM.\nLocation: ABC Medical Center, Room 205.\nProvider: Dr. Allen Hanandez, Cardiologist.`;
export const additionalInstructions = `Aim for at least 30 minutes of moderate exercise, such as walking or swimming, 5 days a week.`;
export const updatedAdditionalInstructions = `Aim for at least 25 minutes of moderate exercise, such as walking or swimming, 5 days a week.`;
export const visitNote = `Continue current antihypertensive regimen. Encourage home blood pressure monitoring and follow-up in 2 months.`;
export const updatedVisitNote = `Continue current antihypertensive regimen. Encourage home blood pressure monitoring and follow-up in 1 month.`;
export const procedure = `A sterile spinal needle (20-gauge or appropriate size) was inserted into the L3-L4 interspace, aiming toward the midline, and advanced gently until cerebrospinal fluid (CSF) was obtained.`;
export const indication = `Suspicious skin lesion (possible melanoma).`;
export const consent = `Patient verbally agreed to proceed and understands the procedure, including potential complications (e.g., headache, bleeding, infection).`;
export const updatedConsent = `The procedure was thoroughly explained to the patient, including its purpose, risks, and potential complications (e.g., bleeding, infection, scarring).`;
export const physcian = `Dr. Sarah Hanandez, MD`;
export const complications = `No excessive bleeding, signs of infection, or other complications were noted at the time of the procedure`;
export const updatedComplications = `The patient tolerated the procedure well`;
export const procedureSummary = `The patient was positioned in a reclining chair with the right arm exposed for easy access to the lesion.`;
export const UpdatedProcedureSummary = `1% lidocaine was injected around the lesion to anesthetize the area, and the patient tolerated this well without any discomfort.`;
export const consultations = `Consultation was requested for evaluation of chest pain. The chest pain was confirmed was non-cardiac in origin and attributed it to a musculoskeletal issue.`;
export const updatedConsultations = `No further cardiology intervention was required.`;
export const hospitalCourse = `The patient was admitted for evaluation of acute chest pain and fever.`;
export const updatedHospitalCourse = `The patient was started on pain management for musculoskeletal chest pain and received supportive care for fever.`;
export const dischargeTo = `The patient is being discharged to home with family support.`;
export const dischargeInstructions = `Rest and avoid heavy physical exertion for the next 7 days.Gradually resume normal activities as tolerated,`;
export const updatedDischargeInstructions = `Resume a regular diet. No special restrictions.`;

export class ClinicalFormsPage {
  constructor(readonly page: Page) {}

  readonly formsTable = () => this.page.getByRole('table', { name: /forms/i });

  async navigateToClinicalForms() {
    await this.page.getByLabel(/clinical forms/i, { exact: true }).click();
    await expect(this.page.getByRole('cell', { name: /discharge instructions/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /discharge summary/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /procedure note/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /visit note/i, exact: true })).toBeVisible();
  }

  async navigateToVisitNoteForm() {
    await this.page.getByText(/Visit Note/).click();
    await expect(this.page.getByText(/Visit Note/)).toBeVisible();
  }

  async navigateToDischargeInstructionsForm() {
    await this.page.getByText(/discharge instructions/i).click();
    await expect(this.page.getByText(/discharge instructions/i)).toBeVisible();
  }

  async navigateToDischargeSummaryForm() {
    await this.page.getByText(/discharge summary/i).click();
    await expect(this.page.getByText(/discharge summary/i)).toBeVisible();
  }

  async navigateToProcedureNoteForm() {
    await this.page.getByText(/procedure note/i).click();
    await expect(this.page.getByText(/procedure note/i)).toBeVisible();
  }

  async navigateToNotesPage() {
    await this.page.getByRole('tab', { name: /notes/i }).click();
  }

  async navigateToEncounterPage() {
    await this.page.getByRole('tab', { name: /Encounters/, exact: true }).click();
  }

  async fillVisitNoteForm() {
    await this.page.locator('#visitNote').fill(visitNote);
  }

  async updateVisitNote() {
    await this.page.getByRole('tab', { name: /Encounters/, exact: true }).click();
    await this.page.getByRole('button', { name: /expand current row/i }).click();
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.locator('#visitNote').fill(updatedVisitNote);
    await this.page.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText(/record updated/i)).toBeVisible(), delay(2000);
  }

  async deleteEncounter() {
    await this.page.getByRole('tab', { name: /Encounters/, exact: true }).click();
    await this.page.getByRole('button', { name: /expand current row/i }).click();
    await this.page.getByRole('button', { name: /danger delete this encounter/i }).click();
    await this.page.getByRole('button', { name: 'danger Delete', exact: true }).click(), delay(2000);
  }

  async fillDischargeInstructionsForm() {
    await this.page.locator('#dischargeInstructionsTIIs').fill(treatmentInformationAndInstructions);
    await this.page.locator('#dischargeInstructionsRCDs').fill(reasonsToContactDoctor);
    await this.page.locator('#dischargeInstructionsDischargeMedications').fill(dischargeMedications);
    await this.page.locator('#dischargeInstructionsFollowUpAppointments').fill(followUpAppointment);
    await this.page.locator('#dischargeInstructionsAdditionalInstructions').fill(additionalInstructions);
  }

  async updateDischargeInstructions() {
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.locator('#dischargeInstructionsTIIs').fill(treatmentInformationAndInstructions);
    await this.page.locator('#dischargeInstructionsRCDs').fill(updatedReasonsToContactDoctor);
    await this.page.locator('#dischargeInstructionsDischargeMedications').fill(updatedDischargeMedications);
    await this.page.locator('#dischargeInstructionsFollowUpAppointments').fill(updatedFollowUpAppointment);
    await this.page.locator('#dischargeInstructionsAdditionalInstructions').fill(updatedAdditionalInstructions);
    await this.page.getByRole('button', { name: /save/i }).click(), delay(2000);
  }

  async fillProcedureNoteForm() {
    await this.page.locator('#procedureNoteProcedure').fill(procedure);
    await this.page.locator('#procedureNoteIndication').fill(indication);
    await this.page.locator('#procedureNotePhysician').fill(physcian);
    await this.page.locator('#procedureNoteConsent').fill(consent);
    await this.page.locator('label').filter({ hasText: /local anesthesia and sedation/i }).locator('span').first().click();
    await this.page.locator('#procedureNoteProcedureSummary').fill(procedureSummary);
    await this.page.locator('#procedureNoteComplecations').fill(complications);
  }

  async updateProcedureNote() {
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.locator('#procedureNoteConsent').fill(updatedConsent);
    await this.page.locator('label').filter({ hasText: /monitored anesthesia care/i }).locator('span').first().click();
    await this.page.locator('#procedureNoteProcedureSummary').fill(UpdatedProcedureSummary);
    await this.page.locator('#procedureNoteComplecations').fill(updatedComplications);
    await this.page.getByRole('button', { name: /save/i }).click(), delay(2000);
  }

  async fillDischargeSummaryForm() {
    await this.page.getByRole('combobox', { name: /diagnosis/i }).click();
    await this.page.getByText(/acute cholecystitis/i).click();
    await this.page.locator('#dischargeSummaryProcedures').fill(procedure);
    await this.page.locator('#dischargeSummaryConsultations').fill(consultations);
    await this.page.locator('#dischargeSummaryHospitalCourse').fill(hospitalCourse);
    await this.page.locator('#dischargeSummaryDischargeTo').fill(dischargeTo);
    await this.page.locator('#dischargeSummaryDischargeMedication').fill(dischargeMedications);
    await this.page.locator('#dischargeSummaryDischargeInstructions').fill(dischargeInstructions);
  }

  async updateDischargeSummary() {
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.getByRole('combobox', { name: /diagnosis/i }).click();
    await this.page.getByText(/acute peptic ulcer with perforation/i).click();
    await this.page.locator('#dischargeSummaryProcedures').fill(procedure);
    await this.page.locator('#dischargeSummaryConsultations').fill(updatedConsultations);
    await this.page.locator('#dischargeSummaryHospitalCourse').fill(updatedHospitalCourse);
    await this.page.locator('#dischargeSummaryDischargeMedication').fill(updatedDischargeMedications);
    await this.page.locator('#dischargeSummaryDischargeInstructions').fill(updatedDischargeInstructions);
    await this.page.getByRole('button', { name: /save/i }).click(), delay(2000);
  }

  async saveForm() {
    await this.page.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText(/form submitted successfully/i)).toBeVisible();
  }
}
