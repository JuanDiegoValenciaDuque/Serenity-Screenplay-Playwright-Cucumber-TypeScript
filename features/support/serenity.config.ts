import { BeforeAll, setDefaultTimeout  } from '@cucumber/cucumber';
import { configure, Duration } from '@serenity-js/core';
import path from 'path';

setDefaultTimeout(Duration.ofSeconds(30).inMilliseconds());

BeforeAll(() => {
  configure({
    crew: [
            [ '@serenity-js/console-reporter', { theme: 'auto' } ],
            [ '@serenity-js/web:Photographer', { strategy: 'TakePhotosOfInteractions' } ],
            [ '@serenity-js/core:ArtifactArchiver', { outputDirectory: path.resolve(__dirname, '../../target/site/serenity') } ],
            [ '@serenity-js/serenity-bdd', { specDirectory: path.resolve(__dirname, '../../features') } ],
        ],
  });
});
