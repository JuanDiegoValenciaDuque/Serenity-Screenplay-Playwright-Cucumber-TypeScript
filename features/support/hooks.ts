import { BeforeAll, AfterAll, Before } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { chromium, firefox, webkit, Browser } from 'playwright';

let browser: Browser;
const browserType = process.env.BROWSER;

BeforeAll(async () => {
  switch (browserType) {
    case 'chromium':
      browser = await chromium.launch({ headless: false });
      break;

    case 'firefox':
      browser = await firefox.launch({ headless: false });
      break;

    case 'webkit':
      browser = await webkit.launch({ headless: false });
      break;

    default:
      throw new Error(`Unsupported browser: ${browserType}`);
  }
});

AfterAll(async () => {
  await browser?.close();
});

Before(() => {
  actorCalled('User').whoCan(
    BrowseTheWebWithPlaywright.using(browser)
  );
});