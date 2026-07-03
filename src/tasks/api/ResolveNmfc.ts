import { Interaction, notes, Task } from '@serenity-js/core';
import { GetRequest, Send, LastResponse } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';
import { TestData } from '../../models/TestData';

const NMFC_BASE_URL = '/portal/v1/flow/nmfc';

interface NmfcSearchResponse {
  data: { nmfcCode: number; nmfcDescription: string }[];
  errors: null | string[];
}

interface NmfcCalculateResponse {
  data: { nmfcSubCode: string; class: string };
  errors: null | string[];
}

function activeCommoditySlots(data: TestData): number[] {
  return ([1, 2, 3, 4, 5] as const).filter(n => data[`C${n}_Qty` as keyof TestData]);
}

export class ResolveNmfc {
  static forAllCommodities() {
    return Task.where(
      '#actor resolves NMFC codes for commodities',
      Interaction.where('#actor calls NMFC search and calculate endpoints', async actor => {
        const testData = await actor.answer(notes<PrimoNotes>().get('testData'));
        const enrichedData = await actor.answer(notes<PrimoNotes>().get('enrichedData'));
        const slots = activeCommoditySlots(testData);
        const auth = { headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` }, validateStatus: () => true };

        const hasNmfc = slots.some(n => testData[`C${n}_NMFC` as keyof TestData]);
        if (!hasNmfc) return;

        for (let index = 0; index < slots.length; index++) {
          const n = slots[index];
          const nmfcCode = testData[`C${n}_NMFC` as keyof TestData] as string;

          if (!nmfcCode) {
            continue;
          }

          await Send.a(GetRequest.to(`${NMFC_BASE_URL}/search?value=${nmfcCode}`).using(auth)).performAs(actor);
          const searchResponse = await actor.answer(LastResponse.body<NmfcSearchResponse>());

          if (!searchResponse.data?.length) {
            throw new Error(`No NMFC data found for code: ${nmfcCode}`);
          }

          const { nmfcDescription } = searchResponse.data[0];
          const density = enrichedData.commodityDetails[index].density;

          await Send.a(
            GetRequest.to(`${NMFC_BASE_URL}/${nmfcCode}/calculate?density=${density}&nmfcDescription=${encodeURIComponent(nmfcDescription)}`).using(auth),
          ).performAs(actor);
          const calcResponse = await actor.answer(LastResponse.body<NmfcCalculateResponse>());

          enrichedData.commodityDetails[index].nmfc = `${nmfcCode}-${calcResponse.data.nmfcSubCode}`;
        }

        await notes<PrimoNotes>().set('enrichedData', enrichedData).performAs(actor);
      }),
    );
  }
}
