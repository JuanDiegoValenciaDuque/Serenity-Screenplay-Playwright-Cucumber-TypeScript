import { clean, runTestsByTag, generateConsolidatedReport } from './utils';

function getTagFromArgs(): string | undefined {
  const tagsArgument = process.argv.find(argument => argument.startsWith('tag='));
  if (!tagsArgument) {
    console.log('No tags provided. Running all scenarios.');
    return undefined;
  }
  return tagsArgument.split('=')[1];
}

function getBrowsersFromArgs(): string[] {
  const browsersArgument = process.argv.find(argument => argument.startsWith('browsers='));
  if (!browsersArgument) {
    console.log('No browsers provided. Running all browsers.');
    return ['chromium', 'webkit'];
  }
  return browsersArgument
    .split('=')[1]
    .split(',')
    .map(b => b.trim());
}

const tag = getTagFromArgs();
const browsers = getBrowsersFromArgs();

console.log('Cleaning previous results...');
clean();

for (const browser of browsers) {
  console.log(`Running tests on ${browser}...`);
  try {
    runTestsByTag(tag, browser);
  } catch (error) {
    console.error(`${browser} failed`);
  }
}

console.log('Generating Serenity consolidated report...');
generateConsolidatedReport(browsers);

console.log('All browsers executed successfully.');
