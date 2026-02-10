import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

export class Encryptor {

  static encrypt(plainText: string) {
    const key = crypto.randomBytes(KEY_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    const payload = {
      encrypted,
      iv: iv.toString('hex'),
      authTag,
    };

    console.log('Password encrypted');
    console.log('Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('Key:', key.toString('hex'));
  }
}

const input = process.argv[2];

if (!input) {
  console.error('You must provide a string to encrypt');
  process.exit(1);
}

Encryptor.encrypt(input);