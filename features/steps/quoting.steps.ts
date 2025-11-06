import { Given, Then, When } from '@cucumber/cucumber';
import { actorInTheSpotlight } from '@serenity-js/core';
import { OpenQuoting } from '../../src/tasks/OpenQuoting';
import { FillQuote } from '../../src/tasks/FillQuote';

Given('the user wants to create a new LTL quote', async () => {
    await actorInTheSpotlight().attemptsTo(OpenQuoting.LTL());
})

When('the user fills in all the required information', async () => {
    await actorInTheSpotlight().attemptsTo(FillQuote.LTL());
})

When('the system retrieves the best available rates', () => {
})

Then('the user can see all the rates displayed successfully', () => {
})