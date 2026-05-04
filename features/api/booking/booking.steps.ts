import { Given, Then, When } from '@cucumber/cucumber';
import { actorCalled, actorInTheSpotlight } from '@serenity-js/core';
import { Ensure, isGreaterThan, isPresent, equals } from '@serenity-js/assertions';
import { ObtainToken } from '../../../src/tasks/api/ObtainToken';
import { CreateQuote } from '../../../src/tasks/api/CreateQuote';
import { BookShipment } from '../../../src/tasks/api/BookShipment';
import { ResolveZipCode } from '../../../src/tasks/api/ResolveZipCode';
import { ResolveDensity } from '../../../src/tasks/api/ResolveDensity';
import { QuoteResponse } from '../../../src/questions/api/QuoteResponse';
import { BookingResponse } from '../../../src/questions/api/BookingResponse';
import { GetTodo } from '../../../src/tasks/api/GetTodo';
import { LastResponse } from '@serenity-js/rest';
import { TodoResponse } from '../../../src/questions/api/TodoResponse';


Given('the actor calls the API', () => {
  actorCalled('API Actor');
});

When('the actor requests TODO with id {int}', async (id: number) => {
  await actorInTheSpotlight().attemptsTo(GetTodo.withId(id));
});

Then('the response status should be {int}', async (expectedStatus: number) => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(LastResponse.status(), equals(expectedStatus)));
});

Then('the userId should be {int}', async (expectedUserId: number) => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(TodoResponse.userId(), equals(expectedUserId)));
});

Given('the actor is configured to call PRIMO APIs', () => {
  actorCalled('PRIMO Actor');
});

When('the actor obtains a PRIMO API bearer token', async () => {
  await actorInTheSpotlight().attemptsTo(ObtainToken.forPrimoApi());
});

When('the actor resolves city and state for origin and destination', async () => {
  await actorInTheSpotlight().attemptsTo(ResolveZipCode.forOriginAndDestination());
});

When('the actor resolves density and class for each commodity', async () => {
  await actorInTheSpotlight().attemptsTo(ResolveDensity.forAllCommodities());
});

When('the actor creates an LTL quote from Boston MA to Cleveland OH', async () => {
  await actorInTheSpotlight().attemptsTo(CreateQuote.forLtl());
});

When('the actor books the first carrier from the quote', async () => {
  await actorInTheSpotlight().attemptsTo(BookShipment.withQuoteData());
});

Then('the response contains a valid quote number', async () => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(QuoteResponse.quoteNumber(), isGreaterThan(0)));
});

Then('the response contains a BOL number', async () => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(BookingResponse.bolNumber(), isPresent()));
});

Then('the response contains an order number', async () => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(BookingResponse.orderNumber(), isGreaterThan(0)));
});
