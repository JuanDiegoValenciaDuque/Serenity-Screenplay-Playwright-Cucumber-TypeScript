import { Question, AnswersQuestions } from '@serenity-js/core';
import { getCommodities } from '../../utils/commodityHelper';
import { TestData } from '../../models/TestData';

export class IsQuoteBookable extends Question<boolean> {
  static for(data: TestData) {
    return new IsQuoteBookable(data);
  }

  constructor(private readonly data: TestData) {
    super(`#actor checks if the quote is bookable`);
  }

  answeredBy(_actor: AnswersQuestions): boolean {
    return getCommodities(this.data).every(c => c.length > 0 || c.width > 0 || c.height > 0);
  }
}
