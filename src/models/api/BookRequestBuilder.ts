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

const SLOTS = [1, 2, 3, 4, 5] as const;

function resolvePackageType(label: string): number {
  return PACKAGE_TYPE_MAP[label] ?? 100;
}

function buildItems(data: TestData, enriched: EnrichedData) {
  return SLOTS.filter(n => data[`C${n}_Qty` as keyof TestData]).map((n, index) => ({
    itemName: data[`C${n}_Name` as keyof TestData] as string,
    packageType: resolvePackageType(data[`C${n}_Package` as keyof TestData] as string),
    quantity: Number(data[`C${n}_Qty` as keyof TestData]),
    length: Number(data[`C${n}_Length` as keyof TestData]),
    width: Number(data[`C${n}_Width` as keyof TestData]),
    height: Number(data[`C${n}_Height` as keyof TestData]),
    weight: Number(data[`C${n}_Weight` as keyof TestData]),
    volume: enriched.commodityDetails[index]?.volume ?? 0,
    commodityClass: enriched.commodityDetails[index]?.freightClass ?? null,
    numberOfPieces: null,
    pieceType: null,
    levels: Number(data[`C${n}_Levels` as keyof TestData]) || 1,
    isHazardous: !!(data[`C${n}_Hazmat` as keyof TestData] as string),
    UNOrTechnicalName: (data[`C${n}_Hazmat` as keyof TestData] as string) ?? '',
    isStackable: (data[`C${n}_Stackable` as keyof TestData] as string) === 'Yes',
  }));
}

export class BookRequestBuilder {
  static payloadFrom(data: TestData, enriched: EnrichedData, quoteNumber: number, selectedCarrier: number) {
    const pickupDate = new Date(Date.now() + 1 * 86_400_000).toISOString().split('T')[0];
    const deliveryDate = new Date(Date.now() + 5 * 86_400_000).toISOString().split('T')[0];
    const hasHazmat = enriched.commodityDetails.some(c => c.hazmatInfo);

    return {
      customerNumber: Number(process.env.CUSTOMER_NUMBER),
      customerBsn: Number(process.env.CUSTOMER_BSN),
      bookDate: new Date().toISOString(),
      bolInstructions: '',
      bolRemarks: '',
      freightDirection: 2,
      referenceNumbers: null,
      quote: {
        lfsQuoteNumber: quoteNumber,
        selectedCarrier,
      },
      movement: {
        declaredValue: null,
        estimatedPickupDate: pickupDate,
        estimatedDeliveryDate: deliveryDate,
        hazardousContact: hasHazmat
          ? {
              contactName: data.HazmatContactName ?? null,
              contactPhone: data.HazmatContactPhone ?? null,
              contractNumber: data.HazmatContractNumber ?? null,
            }
          : null,
        hazardousMaterial: enriched.commodityDetails.find(c => c.hazmatInfo)?.hazmatInfo ?? null,
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
          instructions: null,
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
          instructions: null,
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
        items: buildItems(data, enriched),
      },
      glCoding: {
        EnterpriseTag: null,
        District: null,
        GlCode: null,
      },
      isInsured: false,
      thirdParty: null,
      brokerInformation: {
        brokerName: null,
        brokerPhone: null,
        brokerContactName: null,
        brokerInstructions: null,
      },
      shippingService: null,
      notificationEmails: data.PickupEmail ?? '',
    };
  }

  static formDataFrom(data: TestData, enriched: EnrichedData, quoteNumber: number, selectedCarrier: number): FormData {
    const payload = BookRequestBuilder.payloadFrom(data, enriched, quoteNumber, selectedCarrier);
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    formData.append('notificationEmails', payload.notificationEmails);
    return formData;
  }
}
