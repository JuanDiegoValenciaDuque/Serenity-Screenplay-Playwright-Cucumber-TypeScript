import { Given, Then, When } from '@cucumber/cucumber';
import { Ensure, includes } from '@serenity-js/assertions';
import { OpenSite } from '../../src/tasks/OpenSite';
import { TextExist } from '../../src/questions/TextExist';
import { actorInTheSpotlight } from '@serenity-js/core';
import { Log } from '../../src/tasks/Log';

Given('the user opens the Portal site', async () => {
  await actorInTheSpotlight().attemptsTo(OpenSite.at('https://portal.primofabric.com/'));
})

Then('I should see the tittle {string}', async (expectedTittle: string) => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(TextExist.ofHeading(), includes(expectedTittle)));
})

When('the user logs in with credentials', async () => {
  await actorInTheSpotlight().attemptsTo(Log.in());
})