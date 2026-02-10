import { clean, runTestsByTag, generateReport } from './utils';

console.log('Running tests on:', process.env.BROWSER);
clean();
runTestsByTag('@smoke and @quoting');
generateReport();