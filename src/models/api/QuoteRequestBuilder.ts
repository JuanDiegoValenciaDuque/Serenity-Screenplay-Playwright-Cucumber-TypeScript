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

function buildItems(data: TestData, enriched: EnrichedData) {
  const slots = [1, 2, 3, 4, 5] as const;
  return slots
    .filter(n => data[`C${n}_Qty` as keyof TestData])
    .map((n, index) => ({
      itemName: data[`C${n}_Name` as keyof TestData] as string,
      packageType: resolvePackageType(data[`C${n}_Package` as keyof TestData] as string),
      quantity: data[`C${n}_Qty` as keyof TestData] as number,
      length: data[`C${n}_Length` as keyof TestData] as number,
      width: data[`C${n}_Width` as keyof TestData] as number,
      height: data[`C${n}_Height` as keyof TestData] as number,
      weight: data[`C${n}_Weight` as keyof TestData] as number,
      volume: enriched.commodityDetails[index]?.volume ?? null,
      commodityClass: enriched.commodityDetails[index]?.freightClass ?? null,
      numberOfPieces: null,
      pieceType: null,
      levels: (data[`C${n}_Levels` as keyof TestData] as number) ?? 1,
      isHazardous: !!data[`C${n}_Hazmat` as keyof TestData],
      UNOrTechnicalName: '',
      isStackable: (data[`C${n}_Stackable` as keyof TestData] as string) === 'Yes',
    }));
}

export class QuoteRequestBuilder {
  static from(data: TestData, enriched: EnrichedData) {
    return {
      customerReference: 1237100099,
      customerNumber: 1235100202,
      customerName: 'Primo TEST',
      requestingUser: process.env.USER_EMAIL ?? '',
      modes: [data.Mode],
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
      origin: {
        name: null,
        address1: null,
        address2: null,
        city: enriched.originCity,
        state: enriched.originState,
        postalCode: String(data.OriginZip),
        country: 'US',
      },
      destination: {
        name: null,
        address1: null,
        address2: null,
        city: enriched.destinationCity,
        state: enriched.destinationState,
        postalCode: String(data.DestinationZip),
        country: 'US',
      },
      items: buildItems(data, enriched),
      selectedAccessorials: [],
      service: null,
      equipment: null,
      equipmentLength: null,
      UOM: 'US',
    };
  }
}
