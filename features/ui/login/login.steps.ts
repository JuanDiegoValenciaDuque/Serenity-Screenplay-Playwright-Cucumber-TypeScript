import 'dotenv/config';
import { Given, Then, When } from '@cucumber/cucumber';
import { Ensure, includes, isTrue } from '@serenity-js/assertions';
import { OpenSite } from '../../../src/tasks/ui/OpenSite';
import { PageTitle } from '../../../src/questions/ui/PageTitle';
import { actorInTheSpotlight } from '@serenity-js/core';
import { PerformLogin } from '../../../src/tasks/ui/PerformLogin';
import { TermsExist } from '../../../src/questions/ui/TermsExist';

const baseUrl = process.env.BASE_URL ?? 'https://staging.prestabit.space';

Given('the user opens the Portal site', async () => {
  await actorInTheSpotlight().attemptsTo(OpenSite.at(baseUrl));
});

Then('I should see the tittle {string}', async (expectedTittle: string) => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(PageTitle.ofThePage(), includes(expectedTittle)));
});

When('the user logs in with credentials', async () => {
  await actorInTheSpotlight().attemptsTo(PerformLogin.with());
});

When('the user logs in with {string} and {string}', async (email: string, password: string) => {
  await actorInTheSpotlight().attemptsTo(PerformLogin.with(email, password));
});

Then('user read the terms', async () => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(TermsExist.check(), isTrue()));
});
