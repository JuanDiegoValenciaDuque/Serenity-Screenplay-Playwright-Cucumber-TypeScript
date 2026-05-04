export interface CommodityEnrichment {
  volume: number;
  density: number;
  freightClass: string;
}

export interface EnrichedData {
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  commodityDetails: CommodityEnrichment[];
}
