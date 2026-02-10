import { clean, runTestsByTag, generateReport } from './utils';

clean();
process.env.BROWSER = 'chromium';
runTestsByTag('@smoke and @quoting', process.env.BROWSER);
generateReport();