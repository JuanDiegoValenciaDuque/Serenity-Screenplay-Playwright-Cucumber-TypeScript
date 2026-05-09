import { Interaction, notes, Question, Task } from '@serenity-js/core';
import { LastResponse, PostRequest, Send } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';
import { BookRequestBuilder } from '../../models/api/BookRequestBuilder';

export class BookShipment {
  static withQuoteData() {
    return Task.where(
      '#actor books the LTL shipment',
      Send.a(
        PostRequest.to('https://api.primofabric.com/portal/v1/book')
          .with(
            Question.about('book request form data', async actor => {
              const testData = await actor.answer(notes<PrimoNotes>().get('testData'));
              const enrichedData = await actor.answer(notes<PrimoNotes>().get('enrichedData'));
              const quoteNumber = await actor.answer(notes<PrimoNotes>().get('quoteNumber'));
              const selectedCarrier = await actor.answer(notes<PrimoNotes>().get('selectedCarrier'));

              console.log('[BookShipment] POST https://api.primofabric.com/portal/v1/book');
              console.log('[BookShipment] quoteNumber:', quoteNumber, '| selectedCarrier:', selectedCarrier);

              return BookRequestBuilder.formDataFrom(testData, enrichedData, quoteNumber, selectedCarrier);
            }),
          )
          .using({
            headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
            timeout: 60_000,
            validateStatus: () => true,
          }),
      ),
      Interaction.where('#actor logs the booking response', async actor => {
        const status = await actor.answer(LastResponse.status());
        const body = await actor.answer(LastResponse.body());
        console.log('\n========== [BookShipment] RESPONSE ==========');
        console.log(`Status : ${status}`);
        console.log(`Body   : ${JSON.stringify(body, null, 2)}`);
        console.log('=============================================\n');
      }),
    );
  }
}
