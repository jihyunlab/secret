import * as crypto from 'crypto';
// import * as dotenv from 'dotenv';
import { AEAD, Aead, Helper } from '@jihyunlab/crypto';
import { Key } from './helpers/key';

// export const Env = {
//   load: (config: dotenv.DotenvConfigOutput) => {},
// };

export const Crypto = {
  encrypt: {
    string: (
      string: string,
      key?: string | Buffer,
      inputEncoding?: crypto.Encoding,
      outputEncoding?: BufferEncoding
    ) => {
      const nonce = Helper.nonce.generate(AEAD.AES_256_CCM);
      const encrypted = Aead.create(AEAD.AES_256_CCM, Key.generate(key), 16).encrypt.hex(string, nonce, inputEncoding);
      const buffer = Buffer.concat([nonce, Buffer.from(encrypted.text, 'hex'), encrypted.tag]);

      return buffer.toString(outputEncoding ? outputEncoding : 'hex');
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      const nonce = Helper.nonce.generate(AEAD.AES_256_CCM);
      const encrypted = Aead.create(AEAD.AES_256_CCM, Key.generate(key), 16).encrypt.buffer(buffer, nonce);

      return Buffer.concat([nonce, encrypted.text, encrypted.tag]);
    },
  },

  decrypt: {
    string: (
      string: string,
      key?: string | Buffer,
      inputEncoding?: crypto.Encoding,
      outputEncoding?: BufferEncoding
    ) => {
      const buffer = Buffer.from(string, inputEncoding ? inputEncoding : 'hex');

      const info = Helper.cipher.info(AEAD.AES_256_CCM);
      const ivLength = info.ivLength ? info.ivLength : 0;

      const decrypted = Aead.create(AEAD.AES_256_CCM, Key.generate(key)).decrypt.buffer(
        buffer.subarray(ivLength, buffer.length - 16),
        buffer.subarray(buffer.length - 16, buffer.length),
        buffer.subarray(0, ivLength)
      );

      return decrypted.toString(outputEncoding ? outputEncoding : 'utf8');
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      const info = Helper.cipher.info(AEAD.AES_256_CCM);
      const ivLength = info.ivLength ? info.ivLength : 0;

      return Aead.create(AEAD.AES_256_CCM, Key.generate(key)).decrypt.buffer(
        buffer.subarray(ivLength, buffer.length - 16),
        buffer.subarray(buffer.length - 16, buffer.length),
        buffer.subarray(0, ivLength)
      );
    },
  },
};

// Env.load(dotenv.config());
// const encrypted = Crypto.encrypt.string('asd');
