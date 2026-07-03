import { Interaction, notes, Task } from '@serenity-js/core';
import { GetRequest, Send, LastResponse } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';
import { HazmatInfo } from '../../models/EnrichedData';
import { TestData } from '../../models/TestData';

const HAZMAT_URL = '/portal/v1/flow/hazmat/search';

interface HazmatResponse {
  data: HazmatInfo[];
  errors: null | string[];
}

function activeCommoditySlots(data: TestData): number[] {
  return ([1, 2, 3, 4, 5] as const).filter(n => data[`C${n}_Qty` as keyof TestData]);
}

export class ResolveHazmat {
  static forHazardousCommodities() {
    return Task.where(
      '#actor resolves hazmat information for hazardous commodities',
      Interaction.where('#actor calls hazmat search endpoint per hazardous commodity', async actor => {
        const testData = await actor.answer(notes<PrimoNotes>().get('testData'));
        const enrichedData = await actor.answer(notes<PrimoNotes>().get('enrichedData'));
        const slots = activeCommoditySlots(testData);

        const hasHazmat = slots.some(n => testData[`C${n}_Hazmat` as keyof TestData]);
        if (!hasHazmat) return;

        for (let index = 0; index < slots.length; index++) {
          const n = slots[index];
          const unNumber = testData[`C${n}_Hazmat` as keyof TestData] as string;

          if (!unNumber) {
            continue;
          }

          await Send.a(
            GetRequest.to(`${HAZMAT_URL}?value=${unNumber}`).using({
              headers: {
                Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
              },
              validateStatus: () => true,
            }),
          ).performAs(actor);

          const response = await actor.answer(LastResponse.body<HazmatResponse>());

          if (!response.data?.length) {
            throw new Error(`No hazmat data found for UN number: ${unNumber}`);
          }

          const { commercialName, hazardousClass, packingGroup } = response.data[0];
          enrichedData.commodityDetails[index].hazmatInfo = { commercialName, hazardousClass, packingGroup, unNumber };
        }

        await notes<PrimoNotes>().set('enrichedData', enrichedData).performAs(actor);
      }),
    );
  }
}
