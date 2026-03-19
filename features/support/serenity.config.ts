import 'dotenv/config';
import { AfterAll, BeforeAll, setDefaultTimeout, Before } from '@cucumber/cucumber';
import { configure, Duration, actorCalled } from '@serenity-js/core';
import path from 'path';
import * as playwright from 'playwright';
import { Actors } from '../../features/support/Actors';

const timeouts = {
  cucumber: {
    step: Duration.ofSeconds(120),
  },
  playwright: {
    defaultNavigationTimeout: Duration.ofSeconds(10),
    defaultTimeout: Duration.ofSeconds(5),
  },
  serenity: {
    cueTimeout: Duration.ofSeconds(5),
  },
};

let browsers: playwright.Browser[] = [];
const browserType = process.env.BROWSER || 'chromium';
const outputDirectory = process.env.SERENITY_OUTPUT_DIRECTORY
  ? path.resolve(process.env.SERENITY_OUTPUT_DIRECTORY)
  : path.resolve(__dirname, `../../target/site/serenity/${browserType}`);

setDefaultTimeout(timeouts.cucumber.step.inMilliseconds());

Before(() => {
  actorCalled('User');
});

BeforeAll(async () => {
  const browserToLaunch = playwright[browserType as keyof typeof playwright] as playwright.BrowserType;
  const browser = await browserToLaunch.launch({
    headless: true,
  });

  browsers.push(browser);

  configure({
    actors: new Actors(
      browser,
      {
        baseURL: process.env.BASE_URL || 'https://staging.prestabit.space',
      },
      {
        defaultNavigationTimeout: timeouts.playwright.defaultNavigationTimeout.inMilliseconds(),
        defaultTimeout: timeouts.playwright.defaultTimeout.inMilliseconds(),
      },
    ),

    crew: [
      ['@serenity-js/console-reporter', { theme: 'auto' }],
      ['@serenity-js/web:Photographer', { strategy: 'TakePhotosOfInteractions' }],
      [
        '@serenity-js/core:ArtifactArchiver',
        {
          outputDirectory: outputDirectory,
        },
      ],
      [
        '@serenity-js/serenity-bdd',
        {
          specDirectory: path.resolve(__dirname, '../../features'),
        },
      ],
    ],

    cueTimeout: timeouts.serenity.cueTimeout,
  });
});

AfterAll(async () => {
  // Close all browsers
  await Promise.all(browsers.map(browser => browser.close()));
  browsers = [];
});
