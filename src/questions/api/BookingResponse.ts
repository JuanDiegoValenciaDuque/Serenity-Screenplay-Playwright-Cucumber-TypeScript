import { Question } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';

interface BookingBody {
  data: {
    orderNumber: number;
    bolNumber: string;
    referenceQuoteNumber: string;
    documents: Array<{
      displayName: string;
      docType: string;
      url: string;
      fileName: string;
    }>;
  };
}

export class BookingResponse {
  static orderNumber() {
    return Question.about('booking order number', actor =>
      actor.answer(LastResponse.body<BookingBody>()).then(body => body.data.orderNumber),
    );
  }

  static bolNumber() {
    return Question.about('BOL number', actor =>
      actor.answer(LastResponse.body<BookingBody>()).then(body => body.data.bolNumber),
    );
  }
}
