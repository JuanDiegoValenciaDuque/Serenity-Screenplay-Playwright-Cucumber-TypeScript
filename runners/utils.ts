import { execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { SerenityTag } from '../interfaces/SerenityTag';

export function clean() {
  execSync('npx rimraf target', { stdio: 'inherit' });
}

export function runApiTests(tag?: string) {
  const isWindows = process.platform === 'win32';
  const cucumberPath = path.resolve('node_modules', '.bin', isWindows ? 'cucumber-js.cmd' : 'cucumber-js');

  const args: string[] = [
    'features/api/**/*.feature',
    '--require-module',
    'ts-node/register',
    '--require',
    'features/api/**/*.steps.ts',
    '--require',
    'support/**/*.ts',
    '--format',
    '@serenity-js/cucumber',
  ];

  if (tag) args.push('--tags', tag);

  const spawnArgs = isWindows ? ['/c', cucumberPath, ...args] : args;
  const spawnCmd = isWindows ? 'cmd.exe' : cucumberPath;

  const result = spawnSync(spawnCmd, spawnArgs, {
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      RUN_MODE: 'api',
      SERENITY_OUTPUT_DIRECTORY: 'target/site/serenity/api',
    },
  });

  if (result.status !== 0) {
    throw new Error('API test execution failed');
  }
}

export function runTestsByTag(tag: string | undefined, browser: string) {
  const isWindows = process.platform === 'win32';
  const cucumberPath = path.resolve('node_modules', '.bin', isWindows ? 'cucumber-js.cmd' : 'cucumber-js');

  const args: string[] = [
    'features/ui/**/*.feature',
    '--require-module',
    'ts-node/register',
    '--require',
    'features/ui/**/*.steps.ts',
    '--require',
    'support/**/*.ts',
    '--format',
    '@serenity-js/cucumber',
  ];

  if (tag) {
    args.push('--tags', tag);
  }

  const spawnArgs = isWindows ? ['/c', cucumberPath, ...args] : args;
  const spawnCmd = isWindows ? 'cmd.exe' : cucumberPath;

  const result = spawnSync(spawnCmd, spawnArgs, {
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      BROWSER: browser,
      SERENITY_OUTPUT_DIRECTORY: `target/site/serenity/${browser}`,
    },
  });

  if (result.status !== 0) {
    throw new Error(`${browser} execution failed`);
  }
}

export function mergeAndModifyResults(browsers: string[]) {
  const mergedDir = path.resolve('target/site/serenity/merged');

  if (!fs.existsSync(mergedDir)) {
    fs.mkdirSync(mergedDir, { recursive: true });
  }

  browsers.forEach(browser => {
    const browserDir = path.resolve(`target/site/serenity/${browser}`);

    if (!fs.existsSync(browserDir)) {
      console.warn(`No results for ${browser}, skipping`);
      return;
    }

    const files = fs.readdirSync(browserDir);

    files.forEach(file => {
      if (file.endsWith('.png')) {
        const sourcePath = path.join(browserDir, file);
        const destPath = path.join(mergedDir, file);
        fs.copyFileSync(sourcePath, destPath);
        return;
      }

      if (!file.endsWith('.json')) return;

      const sourcePath = path.join(browserDir, file);
      const destPath = path.join(mergedDir, `${browser}-${file}`);

      const content = fs.readFileSync(sourcePath, 'utf8');
      const json = JSON.parse(content);

      json.context = json.context ? `${browser.toUpperCase()} - ${json.context}` : browser.toUpperCase();

      json.tags = json.tags || [];
      if (!json.tags.some((t: SerenityTag) => t.name === `browser:${browser}`)) {
        json.tags.push({
          name: `browser:${browser}`,
          type: 'tag',
        });
      }

      fs.writeFileSync(destPath, JSON.stringify(json, null, 2));
    });
  });
}

export function generateConsolidatedReport(browsers: string[]) {
  mergeAndModifyResults(browsers);

  const mergedDir = path.resolve('target/site/serenity/merged');

  if (!fs.existsSync(mergedDir)) {
    console.warn('No merged directory found. Skipping report generation.');
    return;
  }

  const files = fs.readdirSync(mergedDir).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.warn('No test results found in merged directory. Skipping report generation.');
    return;
  }

  execSync(
    `npx serenity-bdd run --source ${mergedDir} --destination target/site/serenity/report`,
    { stdio: 'inherit' },
  );
}
