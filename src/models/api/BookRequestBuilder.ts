import FormData from 'form-data';
import { EnrichedData } from '../EnrichedData';
import { TestData } from '../TestData';

const PACKAGE_TYPE_MAP: Record<string, number> = {
  Pallet: 100,
  Box: 200,
  Crate: 300,
  Bundle: 400,
  Drum: 500,
};

function resolvePackageType(label: string): number {
  return PACKAGE_TYPE_MAP[label] ?? 100;
}

function buildCommodities(data: TestData, enriched: EnrichedData) {
  const slots = [1, 2, 3, 4, 5] as const;
  return slots
    .filter(n => data[`C${n}_Qty` as keyof TestData])
    .map((n, index) => ({
      description: data[`C${n}_Name` as keyof TestData] as string,
      freightClass: enriched.commodityDetails[index]?.freightClass ?? null,
      suggestedClass: enriched.commodityDetails[index]?.freightClass ?? null,
      packageType: resolvePackageType(data[`C${n}_Package` as keyof TestData] as string),
      quantity: data[`C${n}_Qty` as keyof TestData] as number,
      numberOfPieces: null,
      pieceType: null,
      length: data[`C${n}_Length` as keyof TestData] as number,
      width: data[`C${n}_Width` as keyof TestData] as number,
      height: data[`C${n}_Height` as keyof TestData] as number,
      weight: data[`C${n}_Weight` as keyof TestData] as number,
      density: enriched.commodityDetails[index]?.density ?? null,
      nmfc: (data[`C${n}_NMFC` as keyof TestData] as string) ?? null,
      isHazardous: !!data[`C${n}_Hazmat` as keyof TestData],
      isStackable: (data[`C${n}_Stackable` as keyof TestData] as string) === 'Yes',
      levels: (data[`C${n}_Levels` as keyof TestData] as number) ?? 1,
      hazardousMaterial: null,
    }));
}

export class BookRequestBuilder {
  static formDataFrom(data: TestData, enriched: EnrichedData, quoteNumber: number, selectedCarrier: number): FormData {
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
      estimatedPickupDate: new Date(Date.now() + 2 * 86_400_000).toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 4 * 86_400_000).toISOString(),
      commodities: buildCommodities(data, enriched),
      hazardousContact: null,
      pickupAddress: {
        name: data.OriginCompany,
        address1: data.OriginAddress1,
        address2: data.OriginAddress2 ?? null,
        city: enriched.originCity,
        state: enriched.originState,
        postalCode: String(data.OriginZip),
        country: 'US',
        customerBsn: null,
      },
      deliveryAddress: {
        name: data.DestinationCompany,
        address1: data.DeliveryAddress1,
        address2: data.DeliveryAddress2 ?? null,
        city: enriched.destinationCity,
        state: enriched.destinationState,
        postalCode: String(data.DestinationZip),
        country: 'US',
        customerBsn: null,
      },
      stopAddress: null,
      pickupInformation: {
        instructions: '',
        referenceNumber: data.PickupRef ?? '',
        contact: {
          name: data.PickupContact,
          phone: String(data.PickupPhone),
          phonePrefix: '+1',
          email: data.PickupEmail,
        },
        shippingWindowTimeFrom: data.PickupWindowFrom ?? '08:00',
        shippingWindowTimeTo: data.PickupWindowTo ?? '17:00',
      },
      deliveryInformation: {
        instructions: '',
        referenceNumber: data.DeliveryRef ?? '',
        contact: {
          name: data.DeliveryContact,
          phone: String(data.DeliveryPhone),
          phonePrefix: '+1',
          email: data.DeliveryEmail,
        },
        shippingWindowTimeFrom: data.DeliveryWindowFrom ?? '08:00',
        shippingWindowTimeTo: data.DeliveryWindowTo ?? '17:00',
      },
    };

    const referenceNumbers = JSON.stringify([
      { name: 'Ref #', value: data.ThirdPartyReference, showOnBol: true },
      { name: 'Reference# name', value: data.AdditionalReference, showOnBol: true },
    ]);
    const thirdParty = JSON.stringify({
      referenceNumber: data.ThirdPartyReference,
      additionalReference: data.AdditionalReference,
      additionalReferenceName: 'Reference# name',
    });
    const brokerInformation = JSON.stringify({
      brokerName: null,
      brokerPhone: null,
      brokerContactName: null,
      brokerInstructions: null,
    });

    const formPayload = {
      customerNumber: '1235100202',
      customerBsn: '1237100099',
      bookDate: new Date().toISOString(),
      bolInstructions: '',
      bolRemarks: '',
      freightDirection: 'Outbound',
      isInsured: false,
      referenceNumbers: JSON.parse(referenceNumbers),
      thirdParty: JSON.parse(thirdParty),
      brokerInformation: JSON.parse(brokerInformation),
      notificationEmails: data.PickupEmail,
      movement,
    };
    console.log('\n========== [BookShipment] REQUEST PAYLOAD ==========');
    console.log(JSON.stringify(formPayload, null, 2));
    console.log('=====================================================\n');

    const formData = new FormData();
    formData.append('customerNumber', '1235100202');
    formData.append('customerBsn', '1237100099');
    formData.append('bookDate', new Date().toISOString());
    formData.append('bolInstructions', '');
    formData.append('bolRemarks', '');
    formData.append('freightDirection', 'Outbound');
    formData.append('isInsured', 'false');
    formData.append('referenceNumbers', referenceNumbers);
    formData.append('thirdParty', thirdParty);
    formData.append('brokerInformation', brokerInformation);
    formData.append('notificationEmails', data.PickupEmail);
    formData.append('movement', JSON.stringify(movement));
    formData.append('glCoding', '');
    formData.append('insurance', '');

    return formData;
  }
}
