import fs from 'fs';
import path from 'path';
import os from 'os';

export class TempStore {
  private static filePath = path.join(os.tmpdir(), `cred-${Date.now()}.tmp`);

  static write(content: string) {
    fs.writeFileSync(this.filePath, content, { encoding: 'utf8' });
    return this.filePath;
  }

  static read() {
    return fs.readFileSync(this.filePath, 'utf8');
  }

  static clean() {
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath);
    }
  }
}