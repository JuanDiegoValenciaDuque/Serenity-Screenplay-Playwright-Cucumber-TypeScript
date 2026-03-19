import { Given, Then, When } from '@cucumber/cucumber';
import { actorInTheSpotlight } from '@serenity-js/core';
import { OpenQuoting } from '../../src/tasks/OpenQuoting';
import { FillQuote } from '../../src/tasks/FillQuote';
import { AvailableRates } from '../../src/questions/AvailableRates';
import { Ensure, equals, not } from '@serenity-js/assertions';

Given('the user wants to create a new LTL quote', async () => {
  await actorInTheSpotlight().attemptsTo(OpenQuoting.LTL());
});

When('the user gets the best available rates', async () => {
  await actorInTheSpotlight().attemptsTo(FillQuote.LTL());
});

When('the user logs into Shipwell', async () => {
    
});

Then('the user can see all the rates displayed successfully', async () => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(AvailableRates.shown(), not(equals(null))));
})

When('the user searches the quote by reference', () => {
});

Then('the quote should exist in Shipwell', () => {
});


