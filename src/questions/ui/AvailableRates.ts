import { Actor, notes, Question } from '@serenity-js/core';
import { Text } from '@serenity-js/web';
import { QuotingPage } from '../../userinterfaces/QuotingPage';

export class AvailableRates extends Question<Promise<string[]>> {
  static shown() {
    return new AvailableRates();
  }

  constructor() {
    super(`#actor retrieves the available rates`);
  }

  async answeredBy(actor: Actor): Promise<string[]> {
    const rates = await Text.ofAll(QuotingPage.PriceRates).answeredBy(actor);
    notes().set('RETRIEVED_RATES', rates);
    console.log(rates);
    return rates;
  }
}
