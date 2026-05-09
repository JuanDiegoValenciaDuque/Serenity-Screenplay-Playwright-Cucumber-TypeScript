import { Given } from '@cucumber/cucumber';
import { actorInTheSpotlight, notes } from '@serenity-js/core';
import { ExcelReader } from '../../../src/utils/excelReader';
import { PrimoNotes } from '../../../src/models/PrimoNotes';

Given('I load the Excel file from {string}', function (filePath) {
  this.excelData = ExcelReader.readExcel(filePath);
});

Given('I get test data for {string}', async function (caseId) {
  const testData = ExcelReader.getRowByCaseId(this.excelData, caseId);
  this.testData = testData;
  await actorInTheSpotlight().attemptsTo(
    notes<PrimoNotes>().set('testData', testData),
  );
});
