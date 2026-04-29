import 'dotenv/config';
import { AfterAll, BeforeAll, setDefaultTimeout, Before } from '@cucumber/cucumber';
import { Cast, configure, Duration, actorCalled, TakeNotes } from '@serenity-js/core';
import { CallAnApi } from '@serenity-js/rest';
import path from 'path';
import * as playwright from 'playwright';
import { Actors } from './Actors';

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
const isApiMode = process.env.RUN_MODE === 'api';
const outputDirectory = process.env.SERENITY_OUTPUT_DIRECTORY
  ? path.resolve(process.env.SERENITY_OUTPUT_DIRECTORY)
  : path.resolve(__dirname, `../target/site/serenity/${isApiMode ? 'api' : browserType}`);

setDefaultTimeout(timeouts.cucumber.step.inMilliseconds());

Before(() => {
  actorCalled('User');
});

BeforeAll(async () => {
  if (isApiMode) {
    configure({
      actors: Cast.where(actor => actor.whoCan(
        CallAnApi.at(process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com'),
        TakeNotes.usingAnEmptyNotepad(),
      )),
      crew: [
        ['@serenity-js/console-reporter', { theme: 'auto' }],
        ['@serenity-js/core:ArtifactArchiver', { outputDirectory }],
        ['@serenity-js/serenity-bdd', { specDirectory: path.resolve(__dirname, '../features') }],
      ],
      cueTimeout: timeouts.serenity.cueTimeout,
    });
    return;
  }

  const browserToLaunch = playwright[browserType as keyof typeof playwright] as playwright.BrowserType;
  const browser = await browserToLaunch.launch({
    headless: process.env.HEADLESS !== 'false',
  });

  browsers.push(browser);

  configure({
    actors: new Actors(
      browser,
      {
        baseURL: process.env.BASE_URL,
      },
      {
        defaultNavigationTimeout: timeouts.playwright.defaultNavigationTimeout.inMilliseconds(),
        defaultTimeout: timeouts.playwright.defaultTimeout.inMilliseconds(),
      },
    ),

    crew: [
      ['@serenity-js/console-reporter', { theme: 'auto' }],
      ['@serenity-js/web:Photographer', { strategy: 'TakePhotosOfInteractions' }],
      ['@serenity-js/core:ArtifactArchiver', { outputDirectory }],
      ['@serenity-js/serenity-bdd', { specDirectory: path.resolve(__dirname, '../features') }],
    ],

    cueTimeout: timeouts.serenity.cueTimeout,
  });
});

AfterAll(async () => {
  // Close all browsers
  await Promise.all(browsers.map(browser => browser.close()));
  browsers = [];
});
