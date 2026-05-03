import FormData from 'form-data';
import { Interaction, notes, Question, Task } from '@serenity-js/core';
import { LastResponse, PostRequest, Send } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';

export class BookShipment {
  static withQuoteData() {
    return Task.where(
      '#actor books the LTL shipment',
      Send.a(
        PostRequest.to('https://api.primofabric.com/portal/v1/book')
          .with(
            Question.about('book request form data', async actor => {
              const quoteNumber = await actor.answer(notes<PrimoNotes>().get('quoteNumber'));
              const selectedCarrier = await actor.answer(notes<PrimoNotes>().get('selectedCarrier'));

              console.log('[BookShipment] POST https://api.primofabric.com/portal/v1/book');
              console.log('[BookShipment] quoteNumber:', quoteNumber, '| selectedCarrier:', selectedCarrier);

              const movement = {
                quote: {
                  lfsQuoteNumber: quoteNumber,
                  selectedCarrier,
                  leastCostReason: null,
                  equipmentType: null,
                  serviceType: null,
                  equipmentLength: null,
                  UOM: 'US',
                },
                estimatedDistanceInMiles: 0,
                estimatedPickupDate: '2026-05-04T05:00:00.000Z',
                estimatedDeliveryDate: '2026-05-06T05:00:00.000Z',
                commodities: [
                  {
                    description: 'Televisions',
                    freightClass: '175',
                    suggestedClass: '175',
                    packageType: 100,
                    quantity: 1,
                    numberOfPieces: null,
                    pieceType: null,
                    length: 34,
                    width: 46,
                    height: 68,
                    weight: 345,
                    density: 5.61,
                    nmfc: null,
                    isHazardous: false,
                    isStackable: true,
                    levels: 2,
                    hazardousMaterial: null,
                  },
                ],
                hazardousContact: null,
                pickupAddress: {
                  name: 'Company Name Origin',
                  address1: 'Address 1 Pickup',
                  address2: 'Address 2 Pickup',
                  city: 'BOSTON',
                  state: 'MA',
                  postalCode: '02108',
                  country: 'US',
                  customerBsn: null,
                },
                deliveryAddress: {
                  name: 'Company Name Destination',
                  address1: 'Address 1 Destination',
                  address2: 'Address 2 Destination',
                  city: 'CLEVELAND',
                  state: 'OH',
                  postalCode: '44114',
                  country: 'US',
                  customerBsn: null,
                },
                stopAddress: null,
                pickupInformation: {
                  instructions: 'PickUp instructions',
                  referenceNumber: 'Pick Up Reference Number',
                  contact: { name: 'Contact Name PickUp', phone: '3122322323', phonePrefix: '+1', email: 'test@origin.com' },
                  shippingWindowTimeFrom: '02:30',
                  shippingWindowTimeTo: '06:00',
                },
                deliveryInformation: {
                  instructions: 'Delivery instructions',
                  referenceNumber: 'Delivery Reference Number',
                  contact: { name: 'Contact Name Delivery', phone: '2345643435', phonePrefix: '+1', email: 'test@delivery.com' },
                  shippingWindowTimeFrom: '01:00',
                  shippingWindowTimeTo: '07:00',
                },
              };

              const bookDate = new Date().toISOString();
              const referenceNumbersJson = JSON.stringify([
                { name: 'Ref #', value: 'Third Party Reference', showOnBol: true },
                { name: 'Reference# name ', value: 'Additional reference#', showOnBol: true },
              ]);
              const thirdPartyJson = JSON.stringify({ referenceNumber: 'Third Party Reference', additionalReference: 'Additional reference#', additionalReferenceName: 'Reference# name ' });
              const brokerInformationJson = JSON.stringify({ brokerName: null, brokerPhone: null, brokerContactName: null, brokerInstructions: null });
              const movementJson = JSON.stringify(movement);

              const formData = new FormData();
              formData.append('customerNumber', '1235100202');
              formData.append('customerBsn', '1237100099');
              formData.append('bookDate', bookDate);
              formData.append('bolInstructions', '');
              formData.append('bolRemarks', '');
              formData.append('freightDirection', 'Outbound');
              formData.append('isInsured', 'false');
              formData.append('referenceNumbers', referenceNumbersJson);
              formData.append('thirdParty', thirdPartyJson);
              formData.append('brokerInformation', brokerInformationJson);
              formData.append('notificationEmails', 'juan.valencia@heyprimo.com');
              formData.append('movement', movementJson);
              formData.append('glCoding', '');
              formData.append('insurance', '');

              console.log('\n========== [BookShipment] FORM FIELDS ==========');
              console.log(`customerNumber    : 1235100202`);
              console.log(`customerBsn       : 1237100099`);
              console.log(`bookDate          : ${bookDate}`);
              console.log(`bolInstructions   : `);
              console.log(`bolRemarks        : `);
              console.log(`freightDirection  : Outbound`);
              console.log(`isInsured         : false`);
              console.log(`referenceNumbers  : ${referenceNumbersJson}`);
              console.log(`thirdParty        : ${thirdPartyJson}`);
              console.log(`brokerInformation : ${brokerInformationJson}`);
              console.log(`notificationEmails: juan.valencia@heyprimo.com`);
              console.log(`movement          : ${movementJson}`);
              console.log(`glCoding          : `);
              console.log(`insurance         : `);
              console.log(`Content-Type      : ${JSON.stringify(formData.getHeaders())}`);
              console.log('=================================================\n');

              return formData;
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
