import { AEAD, Aead, Helper } from '@jihyunlab/crypto';
import { Key } from './key.helper';
import { Encoding } from 'crypto';

export const Crypto = {
  encrypt: {
    string: (string: string, inputEncoding?: Encoding, outputEncoding?: BufferEncoding, key?: string | Buffer) => {
      const nonce = Helper.nonce.generate(AEAD.AES_256_GCM);
      const encrypted = Aead.create(AEAD.AES_256_GCM, Key.generate(key), 16).encrypt.hex(string, nonce, inputEncoding);
      const buffer = Buffer.concat([nonce, Buffer.from(encrypted.text, 'hex'), encrypted.tag]);

      return buffer.toString(outputEncoding ? outputEncoding : 'hex');
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      const nonce = Helper.nonce.generate(AEAD.AES_256_GCM);
      const encrypted = Aead.create(AEAD.AES_256_GCM, Key.generate(key), 16).encrypt.buffer(buffer, nonce);

      return Buffer.concat([nonce, encrypted.text, encrypted.tag]);
    },
  },

  decrypt: {
    string: (string: string, inputEncoding?: Encoding, outputEncoding?: BufferEncoding, key?: string | Buffer) => {
      const info = Helper.cipher.info(AEAD.AES_256_GCM);
      const buffer = Buffer.from(string, inputEncoding ? inputEncoding : 'hex');

      const decrypted = Aead.create(AEAD.AES_256_GCM, Key.generate(key)).decrypt.buffer(
        buffer.subarray(info.ivLength, buffer.length - 16),
        buffer.subarray(buffer.length - 16, buffer.length),
        buffer.subarray(0, info.ivLength)
      );

      return decrypted.toString(outputEncoding ? outputEncoding : 'utf8');
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      const info = Helper.cipher.info(AEAD.AES_256_GCM);

      return Aead.create(AEAD.AES_256_GCM, Key.generate(key)).decrypt.buffer(
        buffer.subarray(info.ivLength, buffer.length - 16),
        buffer.subarray(buffer.length - 16, buffer.length),
        buffer.subarray(0, info.ivLength)
      );
    },
  },
};
