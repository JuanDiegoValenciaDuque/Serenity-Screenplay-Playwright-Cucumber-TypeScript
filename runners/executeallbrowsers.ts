import { clean, runApiTests, runTestsByTag, generateConsolidatedReport } from './utils';

function getTagFromArgs(): string | undefined {
  const tagsArgument = process.argv.find(argument => argument.startsWith('tag='));
  if (!tagsArgument) {
    console.log('No tags provided. Running all scenarios.');
    return undefined;
  }
  const raw = tagsArgument.split('=')[1];
  return raw.split(',').map(t => t.trim()).join(' or ');
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

console.log('Running API tests (once, no browser)...');
try {
  runApiTests(tag);
} catch (error) {
  console.error('API tests failed');
}

for (const browser of browsers) {
  console.log(`Running UI tests on ${browser}...`);
  try {
    runTestsByTag(tag, browser);
  } catch (error) {
    console.error(`${browser} failed`);
  }
}

console.log('Generating Serenity consolidated report...');
generateConsolidatedReport(['api', ...browsers]);

console.log('All browsers executed successfully.');
