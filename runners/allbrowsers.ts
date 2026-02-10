import { clean, runTestsByTag, generateReport } from './utils';

const browser: string = process.env.BROWSER ?? 'chromium';
runTestsByTag('@smoke and @quoting', browser);
generateReport();