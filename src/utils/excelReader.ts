import * as XLSX from 'xlsx';
import { TestData } from '../models/TestData';

let cachedData: TestData[] | null = null;

const TIME_FIELDS: (keyof TestData)[] = [
  'PickupWindowFrom', 'PickupWindowTo',
  'DeliveryWindowFrom', 'DeliveryWindowTo',
];

function excelTimeToString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value !== 'number') return '';
  const totalMinutes = Math.round(value * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export class ExcelReader {
  static readExcel(filePath: string): TestData[] {
    if (cachedData) return cachedData;

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['LTL'];
    const data = XLSX.utils.sheet_to_json(sheet) as TestData[];

    for (const row of data) {
      for (const field of TIME_FIELDS) {
        (row as any)[field] = excelTimeToString(row[field]);
      }
    }

    cachedData = data;
    return data;
  }

  static getRowByCaseId(data: TestData[], caseId: string): TestData {
    if (caseId === 'Random') {
      return data[Math.floor(Math.random() * data.length)];
    }

    const row = data.find(r => r.CaseID === caseId);

    if (!row) {
      throw new Error(`No data found for CaseID: ${caseId}`);
    }

    return row;
  }
}
