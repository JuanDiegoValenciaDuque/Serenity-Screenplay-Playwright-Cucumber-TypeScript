import { spawn } from 'child_process';
import * as path from 'path';

const node = process.execPath;

const tsNodeScript = path.resolve(
  'node_modules/ts-node/dist/bin.js'
);

const browsers = ['chromium', 'firefox', 'webkit'];

const processes = browsers.map(browser => {
  console.log(`Launching smoke tests on ${browser}`);

  return spawn(
    node,
    [tsNodeScript, 'runners/allbrowsers.ts'],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        BROWSER: browser,
      },
    }
  );
});

Promise.all(
  processes.map(
    p =>
      new Promise<void>((resolve, reject) => {
        p.on('exit', code =>
          code === 0
            ? resolve()
            : reject(new Error(`${browsers} failed`))
        );
      })
  )
)
  .then(() => {
    console.log('All browsers finished successfully');
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });