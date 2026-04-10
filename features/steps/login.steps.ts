import { Given, Then, When } from '@cucumber/cucumber';
import { Ensure, includes, isTrue } from '@serenity-js/assertions';
import { OpenSite } from '../../src/tasks/OpenSite';
import { TextExist } from '../../src/questions/TextExist';
import { actorInTheSpotlight } from '@serenity-js/core';
import { Log } from '../../src/tasks/Log';
import { TermsExist } from '../../src/questions/TermsExist';

Given('the user opens the Portal site', async () => {
  await actorInTheSpotlight().attemptsTo(OpenSite.at('https://portal.primofabric.com/'));
});

Then('I should see the tittle {string}', async (expectedTittle: string) => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(TextExist.ofHeading(), includes(expectedTittle)));
});

When('the user logs in with credentials', async () => {
//  await actorInTheSpotlight().attemptsTo(Log.in());
});

When('the user logs in with {string} and {string}', async (email: string, password: string) => {
  await actorInTheSpotlight().attemptsTo(Log.in(email, password));
})
 
Then('user read the terms', async () => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(TermsExist.check(), isTrue()));
})
