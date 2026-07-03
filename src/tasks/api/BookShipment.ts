import { Interaction, notes, Question, Task } from '@serenity-js/core';
import { JSONData, Name } from '@serenity-js/core/lib/model';
import { PostRequest, Send } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';
import { BookRequestBuilder } from '../../models/api/BookRequestBuilder';

export class BookShipment {
  static withQuoteData() {
    return Task.where(
      '#actor books the LTL shipment',
      Interaction.where('#actor records the book request payload', async actor => {
        const testData = await actor.answer(notes<PrimoNotes>().get('testData'));
        const enrichedData = await actor.answer(notes<PrimoNotes>().get('enrichedData'));
        const quoteNumber = await actor.answer(notes<PrimoNotes>().get('quoteNumber'));
        const selectedCarrier = await actor.answer(notes<PrimoNotes>().get('selectedCarrier'));
        const payload = BookRequestBuilder.payloadFrom(testData, enrichedData, quoteNumber, selectedCarrier);
        actor.collect(JSONData.fromJSON(JSON.parse(JSON.stringify(payload))), new Name('Book Request Payload'));
      }),
      Send.a(
        PostRequest.to('/portal/v1/book')
          .with(
            Question.about('book request form data', async actor => {
              const testData = await actor.answer(notes<PrimoNotes>().get('testData'));
              const enrichedData = await actor.answer(notes<PrimoNotes>().get('enrichedData'));
              const quoteNumber = await actor.answer(notes<PrimoNotes>().get('quoteNumber'));
              const selectedCarrier = await actor.answer(notes<PrimoNotes>().get('selectedCarrier'));
              return BookRequestBuilder.formDataFrom(testData, enrichedData, quoteNumber, selectedCarrier);
            }),
          )
          .using({
            headers: {
              Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
              'X-Organization-Slug': process.env.ORGANIZATION_SLUG ?? 'portal.primofabric.com',
            },
            timeout: 60_000,
            validateStatus: () => true,
          }),
      ),
    );
  }
}
