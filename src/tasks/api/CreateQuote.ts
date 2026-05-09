import { Interaction, notes, Question, Task } from '@serenity-js/core';
import { LastResponse, PostRequest, Send } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';
import { QuoteRequestBuilder } from '../../models/api/QuoteRequestBuilder';

interface QuoteBody {
  data: { quoteNumber: number; carrierQuotes: Array<{ rateNumber: number }> } | null;
  errors: unknown;
}

export class CreateQuote {
  static forLtl() {
    return Task.where(
      '#actor creates an LTL quote',
      Send.a(
        PostRequest.to('https://api.primofabric.com/portal/v2/quote')
          .with(
            Question.about('quote request body', async actor => {
              const testData = await actor.answer(notes<PrimoNotes>().get('testData'));
              const enrichedData = await actor.answer(notes<PrimoNotes>().get('enrichedData'));
              const body = QuoteRequestBuilder.from(testData, enrichedData);
              console.log('[CreateQuote] Body:', JSON.stringify(body, null, 2));
              return body;
            }),
          )
          .using(
            Question.about('quote request auth header', actor =>
              actor.answer(notes<PrimoNotes>().get('bearerToken')).then(token => ({
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                timeout: 60_000,
                validateStatus: () => true,
              })),
            ),
          ),
      ),
      Interaction.where('#actor logs the quote response', async actor => {
        const status = await actor.answer(LastResponse.status());
        const body = await actor.answer(LastResponse.body<QuoteBody>());
        console.log(`[CreateQuote] Status: ${status}`);
        console.log(`[CreateQuote] Body: ${JSON.stringify(body, null, 2)}`);
        if (!body.data) {
          throw new Error(`[CreateQuote] Quote failed (${status}): ${JSON.stringify(body.errors)}`);
        }
      }),
      notes<PrimoNotes>().set(
        'quoteNumber',
        Question.about('quote number from response', actor =>
          actor.answer(LastResponse.body<QuoteBody>()).then(b => b.data!.quoteNumber),
        ),
      ),
      notes<PrimoNotes>().set(
        'selectedCarrier',
        Question.about('selected carrier from response', actor =>
          actor.answer(LastResponse.body<QuoteBody>()).then(b => b.data!.carrierQuotes[0].rateNumber),
        ),
      ),
    );
  }
}
