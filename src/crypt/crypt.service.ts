import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class CryptService {
  async encrypt(password: string, iv: string, text: string): Promise<string> {
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-cbc', key, iv);

    const encryptText = Buffer.concat([
      cipher.update(text),
      cipher.final(),
    ]).toString('hex');

    return encryptText;
  }

  async decrypt(password, iv, text): Promise<string> {
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    const decryptText = Buffer.concat([
      decipher.update(Buffer.from(text, 'hex')),
      decipher.final(),
    ]).toString();

    return decryptText;
  }
}
