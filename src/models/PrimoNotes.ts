import { EnrichedData } from './EnrichedData';
import { TestData } from './TestData';

export interface PrimoNotes {
  quoteNumber: number;
  selectedCarrier: number;
  orderNumber: number;
  testData: TestData;
  enrichedData: EnrichedData;
}
