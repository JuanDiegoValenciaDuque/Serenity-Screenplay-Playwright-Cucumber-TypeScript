import { execSync, execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function clean() {
  execSync('npx rimraf target', { stdio: 'inherit' });
}

export function runTestsByTag(tags: string, browser: string) {
  execSync(`npx cucumber-js "features/**/*.feature" --tags "${tags}" --require-module ts-node/register --require "features/**/*.ts" --format @serenity-js/cucumber`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      BROWSER: browser,
      SERENITY_OUTPUT_DIRECTORY: `target/site/serenity/${browser}`,
    }
  });
}

export function generateReport() {
  const browser = process.env.BROWSER;

  const serenityOutputDir = path.resolve(`target/site/serenity/${browser}`);
  const serenityReportDir = path.resolve(`target/site/serenity-report/${browser}`);

  if (!fs.existsSync(serenityOutputDir)) {
    console.warn(`No serenity results found for ${browser}, skipping report`);
    return;
  }

  fs.mkdirSync(serenityReportDir, { recursive: true });

  execSync(
    `serenity-bdd run \
      --source ${serenityOutputDir} \
      --destination ${serenityReportDir}`,
    { stdio: 'inherit' }
  );
}

