import { Interaction, notes, Task } from '@serenity-js/core';
import { PostRequest, Send, LastResponse } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';

const ADDRESS_SEARCH_URL = 'https://api.primofabric.com/portal/v1/address-search';

interface AddressSearchResponse {
  data: Array<{ city: string; state: string }> | null;
  errors: unknown;
}

async function lookupZip(zip: string, actor: any): Promise<{ city: string; state: string }> {
  await Send.a(
    PostRequest.to(ADDRESS_SEARCH_URL)
      .with({ searchValue: zip, country: 'US' })
      .using({
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        validateStatus: () => true,
      }),
  ).performAs(actor);

  const body = await actor.answer(LastResponse.body<AddressSearchResponse>());
  const status = await actor.answer(LastResponse.status());

  console.log(`[ResolveZipCode] ZIP ${zip} → status: ${status} | data: ${JSON.stringify(body)}`);

  if (!body.data || body.data.length === 0) {
    throw new Error(`[ResolveZipCode] No address found for zip "${zip}". Response: ${JSON.stringify(body)}`);
  }

  return { city: body.data[0].city, state: body.data[0].state };
}

export class ResolveZipCode {
  static forOriginAndDestination() {
    return Task.where(
      '#actor resolves city and state for origin and destination',
      Interaction.where('#actor resolves zip codes', async actor => {
        const testData = await actor.answer(notes<PrimoNotes>().get('testData'));

        const origin = await lookupZip(String(testData.OriginZip), actor);
        const destination = await lookupZip(String(testData.DestinationZip), actor);

        console.log(`[ResolveZipCode] Origin: ${origin.city}, ${origin.state}`);
        console.log(`[ResolveZipCode] Destination: ${destination.city}, ${destination.state}`);

        const existing = await actor.answer(notes<PrimoNotes>().get('enrichedData')).catch(() => null);

        await notes<PrimoNotes>().set('enrichedData', {
          ...(existing ?? { commodityDetails: [] }),
          originCity: origin.city,
          originState: origin.state,
          destinationCity: destination.city,
          destinationState: destination.state,
        }).performAs(actor);
      }),
    );
  }
}
