import { notes, Question, Task } from '@serenity-js/core';
import { LastResponse, PostRequest, Send } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';

interface QuoteBody {
  data: { quoteNumber: number; carrierQuotes: Array<{ rateNumber: number }> };
}

const quoteBody = {
  customerReference: 1237100099,
  customerNumber: 1235100202,
  customerName: 'Primo TEST',
  requestingUser: 'primo-it@heyprimo.com',
  modes: ['LTL', 'Truckload'],
  declaredValue: 0,
  insurance: {
    cargoValue: 0,
    isNewGoods: true,
    goodsValue: 'NEW',
    addFreightCost: false,
    addExtraCoverage: false,
    insuredName: '',
    insuredCountry: '',
  },
  pickupDate: null,
  origin: { name: null, address1: null, address2: null, city: 'BOSTON', state: 'MA', postalCode: '02108', country: 'US' },
  destination: { name: null, address1: null, address2: null, city: 'CLEVELAND', state: 'OH', postalCode: '44114', country: 'US' },
  items: [
    {
      itemName: 'Televisions',
      packageType: 100,
      quantity: 1,
      length: 34,
      width: 46,
      height: 68,
      weight: 345,
      volume: 61.55,
      commodityClass: '175',
      numberOfPieces: null,
      pieceType: null,
      levels: 2,
      isHazardous: false,
      UNOrTechnicalName: '',
      isStackable: true,
    },
  ],
  selectedAccessorials: [],
  service: null,
  equipment: null,
  equipmentLength: null,
  UOM: 'US',
};

export class CreateQuote {
  static forLtl() {
    return Task.where(
      '#actor creates an LTL quote',
      Send.a(
        PostRequest.to('https://api.primofabric.com/portal/v2/quote')
          .with(quoteBody)
          .using(
            Question.about('quote request auth header', actor =>
              actor.answer(notes<PrimoNotes>().get('bearerToken')).then(token => ({
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                timeout: 60_000,
              })),
            ),
          ),
      ),
      notes<PrimoNotes>().set(
        'quoteNumber',
        Question.about('quote number from response', actor =>
          actor.answer(LastResponse.body<QuoteBody>()).then(b => b.data.quoteNumber),
        ),
      ),
      notes<PrimoNotes>().set(
        'selectedCarrier',
        Question.about('selected carrier from response', actor =>
          actor.answer(LastResponse.body<QuoteBody>()).then(b => b.data.carrierQuotes[0].rateNumber),
        ),
      ),
    );
  }
}
