import { EnrichedData } from './EnrichedData';
import { TestData } from './TestData';

export interface PrimoNotes {
  bearerToken: string;
  quoteNumber: number;
  selectedCarrier: number;
  orderNumber: number;
  testData: TestData;
  enrichedData: EnrichedData;
}
