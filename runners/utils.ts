import { execSync, execFileSync } from 'child_process';

export function clean() {
    execSync('npx rimraf target', { stdio: 'inherit' });
}

export function runTestsByTag(tag: string) {
  execSync(
    `npx cucumber-js "features/**/*.feature" --tags "${tag}" --require-module ts-node/register --require "features/**/*.ts" --format @serenity-js/cucumber`,
    { stdio: 'inherit' }
  );
}

export function generateReport() {
  execSync(
    'serenity-bdd run --features ./feature',
    { stdio: 'inherit' }
  );
}