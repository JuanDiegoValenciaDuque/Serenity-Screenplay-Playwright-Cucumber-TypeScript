import { BeforeAll, AfterAll, Given, Then, Before, When } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { Ensure, includes } from '@serenity-js/assertions';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { OpenSite } from '../../src/tasks/OpenSite';
import { TextExist } from '../../src/questions/TextExist';
import { Browser, chromium, firefox } from 'playwright';
import { actorInTheSpotlight } from '@serenity-js/core';
import { Log } from '../../src/tasks/Log';

let browser: Browser;
const actor = actorCalled('User');
const browserType = process.env.BROWSER || "chromium"

BeforeAll(async () => {
  switch (browserType) {
    case "chromium":
      browser = await chromium.launch({ headless: false });
      break
  }
});

AfterAll(async () => {
  await browser.close();
});

Before(() => {
  actorCalled('Neo').whoCan(BrowseTheWebWithPlaywright.using(browser));
});

Given('the user opens the Portal site', async () => {
  await actorInTheSpotlight().attemptsTo(OpenSite.at('https://portal.primofabric.com/'));
})


Then('I should see the tittle {string}', async (expectedTittle: string) => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(TextExist.ofHeading(), includes(expectedTittle)));
})

When('the user logs in with credentials', async () => {
  await actorInTheSpotlight().attemptsTo(Log.in());
})






