export interface AccessorialItem {
  accessorial: string;
  accessorialType: string;
  mode: string;
}

export interface HazmatInfo {
  commercialName: string;
  hazardousClass: string;
  packingGroup: string;
  unNumber: string;
}

export interface CommodityEnrichment {
  volume: number;
  density: number;
  freightClass: string;
  hazmatInfo: HazmatInfo | null;
  nmfc: string | null;
}

export interface EnrichedData {
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  commodityDetails: CommodityEnrichment[];
  selectedAccessorials: AccessorialItem[];
}
