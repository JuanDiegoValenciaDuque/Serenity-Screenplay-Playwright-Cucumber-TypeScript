import { Interaction, notes, Task } from '@serenity-js/core';
import { PostRequest, Send, LastResponse } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';
import { CommodityEnrichment } from '../../models/EnrichedData';
import { TestData } from '../../models/TestData';

const DENSITY_URL = '/rating/v1/density';

interface DensityResponse {
  data: { totalCube: number; totalDensity: number; freightClass: string };
}

function activeCommoditySlots(data: TestData): number[] {
  return ([1, 2, 3, 4, 5] as const).filter(n => data[`C${n}_Qty` as keyof TestData]);
}

export class ResolveDensity {
  static forAllCommodities() {
    return Task.where(
      '#actor resolves volume, density and class for each commodity',
      Interaction.where('#actor calls density endpoint per commodity', async actor => {
        const testData = await actor.answer(notes<PrimoNotes>().get('testData'));
        const slots = activeCommoditySlots(testData);
        const commodityDetails: CommodityEnrichment[] = [];

        for (const n of slots) {
          await Send.a(
            PostRequest.to(DENSITY_URL)
              .with({
                Length: String(testData[`C${n}_Length` as keyof TestData]),
                Width: String(testData[`C${n}_Width` as keyof TestData]),
                Height: String(testData[`C${n}_Height` as keyof TestData]),
                Weight: String(testData[`C${n}_Weight` as keyof TestData]),
                Volume: 0,
                UOM: 'US',
              })
              .using({
                headers: {
                  Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
                  'Content-Type': 'application/json',
                },
                validateStatus: () => true,
              }),
          ).performAs(actor);

          const response = await actor.answer(LastResponse.body<DensityResponse>());
          const { totalCube, totalDensity, freightClass } = response.data;

          commodityDetails.push({ volume: totalCube, density: totalDensity, freightClass, hazmatInfo: null, nmfc: null });
        }

        const existing = await actor.answer(notes<PrimoNotes>().get('enrichedData')).catch(() => null);

        await notes<PrimoNotes>().set('enrichedData', {
          ...(existing ?? { originCity: '', originState: '', destinationCity: '', destinationState: '', selectedAccessorials: [] }),
          commodityDetails,
        }).performAs(actor);
      }),
    );
  }
}
