import { Given, Then, When } from '@cucumber/cucumber';
import { actorInTheSpotlight } from '@serenity-js/core';
import { OpenQuoting } from '../../../src/tasks/ui/OpenQuoting';
import { FillQuote } from '../../../src/tasks/ui/FillQuote';
import { AvailableRates } from '../../../src/questions/ui/AvailableRates';
import { Ensure, equals, not } from '@serenity-js/assertions';

Given('the user wants to create a new LTL quote', async () => {
  await actorInTheSpotlight().attemptsTo(OpenQuoting.LTL());
});

When('the user gets the best available rates', async () => {
  await actorInTheSpotlight().attemptsTo(FillQuote.LTL());
});

Then('the user can see all the rates displayed successfully', async () => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(AvailableRates.shown(), not(equals(null))));
});
