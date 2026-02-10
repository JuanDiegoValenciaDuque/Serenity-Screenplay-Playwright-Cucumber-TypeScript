import * as crypto from 'crypto';

export class Decryptor {
  static decrypt(
    payload: { encrypted: string; iv: string; authTag: string },
    keyHex: string
  ): string {
    const key = Buffer.from(keyHex, 'hex');

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(payload.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(payload.authTag, 'hex'));

    let decrypted = decipher.update(payload.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
