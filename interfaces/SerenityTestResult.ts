import { SerenityTag } from './SerenityTag';

export interface SerenityTestResult {
  tags?: SerenityTag[];
  context?: string;
  name?: string;
  [key: string]: unknown;
}
