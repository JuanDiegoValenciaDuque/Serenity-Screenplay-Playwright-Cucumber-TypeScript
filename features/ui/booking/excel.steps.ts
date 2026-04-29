import { Given } from '@cucumber/cucumber';
import { ExcelReader } from '../../../src/utils/excelReader';

Given('I load the Excel file from {string}', function (filePath) {
    this.excelData = ExcelReader.readExcel(filePath);
});

Given('I get test data for {string}', function (caseId) {
    this.testData = ExcelReader.getRowByCaseId(this.excelData, caseId);
});
