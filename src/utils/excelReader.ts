import * as XLSX from 'xlsx';
import { TestData } from '../models/TestData';

let cachedData: TestData[] | null = null;

export class ExcelReader {

    static readExcel(filePath: string): TestData[] {
        if (cachedData) return cachedData;

        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets['LTL'];
        const data = XLSX.utils.sheet_to_json(sheet) as TestData[];
        cachedData = data;

        return data;
    }

    static getRowByCaseId(data: TestData[], caseId: string): TestData {
        const row = data.find(r => r.CaseID === caseId);

        if (!row) {
            throw new Error(`No data found for CaseID: ${caseId}`);
        }

        return row;
    }
}