import * as fs from 'fs';
import { Decryptor } from './decryptor';

export class CredentialsProvider {
  static get(): { user: string; password: string } {
    const credentials = JSON.parse(
      fs.readFileSync('credentials.enc', 'utf-8')
    );

    const key = process.env.KEY;
    if (!key) throw new Error('KEY environment variable not set');

    return {
      user: credentials.user,
      password: Decryptor.decrypt(credentials.password, key),
    };
  }
}