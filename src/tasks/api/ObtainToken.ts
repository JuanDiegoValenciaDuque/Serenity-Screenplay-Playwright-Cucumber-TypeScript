import { Interaction, notes, Question, Task } from '@serenity-js/core';
import { LastResponse, PostRequest, Send } from '@serenity-js/rest';
import { PrimoNotes } from '../../models/PrimoNotes';

const AUTH_URL = 'https://identity.primofabric.com/connect/token';

export class ObtainToken {
  static forPrimoApi() {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.CLIENTE_ID ?? '',
      client_secret: process.env.CLIENTE_SECRET ?? '',
    }).toString();

    return Task.where(
      '#actor obtains PRIMO API bearer token',
      Interaction.where('#actor logs the auth request', _actor => {
        console.log(`[ObtainToken] POST ${AUTH_URL}`);
        console.log(`[ObtainToken] grant_type=client_credentials | client_id=${process.env.CLIENTE_ID}`);
        return Promise.resolve();
      }),
      Send.a(
        PostRequest.to(AUTH_URL)
          .with(body)
          .using({ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }),
      ),
      notes<PrimoNotes>().set(
        'bearerToken',
        Question.about('access_token from auth response', actor =>
          actor.answer(LastResponse.body<{ access_token: string }>()).then(b => b.access_token),
        ),
      ),
    );
  }
}
