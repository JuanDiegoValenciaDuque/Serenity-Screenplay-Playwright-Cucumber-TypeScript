import { Interaction, notes, Task } from '@serenity-js/core';
import { GetRequest, Send, LastResponse } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';
import { AccessorialItem } from '../../models/EnrichedData';
import { TestData } from '../../models/TestData';

const ACCESSORIALS_URL = '/portal/v2/accessorials';

interface AccessorialResponse {
  data: Array<{ value: string; accessorialType: string; mode: string }> | null;
  errors: unknown;
}

function getAccessorialValues(data: TestData): string[] {
  return [data.Accessorial1, data.Accessorial2, data.Accessorial3, data.Accessorial4].filter(Boolean);
}

export class ResolveAccessorials {
  static forQuote() {
    return Task.where(
      '#actor resolves accessorials for the quote',
      Interaction.where('#actor calls accessorials endpoint', async actor => {
        const testData = await actor.answer(notes<PrimoNotes>().get('testData'));
        const values = getAccessorialValues(testData);

        if (!values.length) return;

        await Send.a(
          GetRequest.to(`${ACCESSORIALS_URL}?mode=${testData.Mode}`).using({
            headers: {
              Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            },
            validateStatus: () => true,
          }),
        ).performAs(actor);

        const response = await actor.answer(LastResponse.body<AccessorialResponse>());

        if (!response.data?.length) return;

        const selectedAccessorials: AccessorialItem[] = [];

        for (const value of values) {
          const match = response.data.find(a => a.value === value);
          if (match) {
            selectedAccessorials.push({ accessorial: match.value, accessorialType: match.accessorialType, mode: match.mode });
          }
        }

        const enrichedData = await actor.answer(notes<PrimoNotes>().get('enrichedData'));
        await notes<PrimoNotes>().set('enrichedData', { ...enrichedData, selectedAccessorials }).performAs(actor);
      }),
    );
  }
}
