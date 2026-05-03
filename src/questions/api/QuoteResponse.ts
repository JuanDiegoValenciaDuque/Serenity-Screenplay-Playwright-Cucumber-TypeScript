import { Question } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';

interface QuoteBody {
  data: {
    quoteNumber: number;
    carrierQuotes: Array<{ rateNumber: number }>;
  };
}

export class QuoteResponse {
  static quoteNumber() {
    return Question.about('quote number', actor =>
      actor.answer(LastResponse.body<QuoteBody>()).then(body => body.data.quoteNumber),
    );
  }

  static firstCarrierRateNumber() {
    return Question.about('first carrier rate number', actor =>
      actor.answer(LastResponse.body<QuoteBody>()).then(body => body.data.carrierQuotes[0].rateNumber),
    );
  }
}
