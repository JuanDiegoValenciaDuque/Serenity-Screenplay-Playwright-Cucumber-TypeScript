import { BeforeAll, AfterAll, Given, Then, Before } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { Ensure, includes } from '@serenity-js/assertions';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { OpenSite } from '../../src/tasks/OpenSite';
import { TextExist } from '../../src/questions/TextExist';
import { Browser, chromium, webkit, firefox } from 'playwright';
import { actorInTheSpotlight } from '@serenity-js/core';

let browser: Browser;
const actor = actorCalled('Neo');
const browserType = process.env.BROWSER || "chromium"

BeforeAll(async () => {
  switch (browserType) {
    case "chromium":
      browser = await chromium.launch({ headless: false });
      break
    case "webkit":
      browser = await webkit.launch({ headless: false });
      break
    case "firefox":
      browser = await firefox.launch({ headless: false });
      break
  }
});

AfterAll(async () => {
  await browser.close();
});

Before(() => {
  actorCalled('Neo').whoCan(BrowseTheWebWithPlaywright.using(browser));
});

Given('I open the example site', async () => {
  await actorInTheSpotlight().attemptsTo(OpenSite.at('https://www.google.com/'));
});

Then('I should see the text {string}', async (expectedText: string) => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(TextExist.ofHeading(), includes(expectedText)));
});
