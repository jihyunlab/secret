import { Text as TextCrypto } from './cryptos/text.crypto';
import { File as FileCrypto } from './cryptos/file.crypto';
import { Env as EnvCrypto } from './cryptos/env.crypto';
import { Crypto as CryptoHelper } from './helpers/crypto.helper';
import { Location as LocationHelper } from './helpers/location.helper';
import { Encoding } from 'crypto';
import { DotenvConfigOutput } from 'dotenv';

export const Text = {
  encrypt: (text: string, key?: string | Buffer) => {
    return TextCrypto.encrypt(text, key);
  },

  decrypt: (hex: string, key?: string | Buffer) => {
    return TextCrypto.decrypt(hex, key);
  },
};

export const File = {
  encrypt: (input: string, output?: string, key?: string | Buffer) => {
    return FileCrypto.encrypt(input, output, key);
  },

  decrypt: (input: string, output?: string, key?: string | Buffer) => {
    return FileCrypto.decrypt(input, output, key);
  },
};

export const Env = {
  load: (config: DotenvConfigOutput, key?: string) => {
    EnvCrypto.load(config, key);
  },

  encrypt: (input: string, output?: string, key?: string | Buffer) => {
    return EnvCrypto.encrypt(input, output, key);
  },

  decrypt: (input: string, output?: string, key?: string | Buffer) => {
    return EnvCrypto.decrypt(input, output, key);
  },
};

export const Crypto = {
  encrypt: {
    binary: (text: string, inputEncoding?: Encoding, key?: string | Buffer) => {
      return CryptoHelper.encrypt.string(text, inputEncoding, 'binary', key);
    },

    hex: (text: string, inputEncoding?: Encoding, key?: string | Buffer) => {
      return CryptoHelper.encrypt.string(text, inputEncoding, 'hex', key);
    },

    base64: (text: string, inputEncoding?: Encoding, key?: string | Buffer) => {
      return CryptoHelper.encrypt.string(text, inputEncoding, 'base64', key);
    },

    uint8Array: (buffer: Buffer, key?: string | Buffer) => {
      return new Uint8Array(CryptoHelper.encrypt.buffer(buffer, key));
    },

    string: (string: string, inputEncoding?: Encoding, outputEncoding?: BufferEncoding, key?: string | Buffer) => {
      return CryptoHelper.encrypt.string(string, inputEncoding, outputEncoding, key);
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      return CryptoHelper.encrypt.buffer(buffer, key);
    },
  },

  decrypt: {
    binary: (text: string, outputEncoding?: Encoding, key?: string | Buffer) => {
      return CryptoHelper.decrypt.string(text, 'binary', outputEncoding, key);
    },

    hex: (text: string, outputEncoding?: Encoding, key?: string | Buffer) => {
      return CryptoHelper.decrypt.string(text, 'hex', outputEncoding, key);
    },

    base64: (text: string, outputEncoding?: Encoding, key?: string | Buffer) => {
      return CryptoHelper.decrypt.string(text, 'base64', outputEncoding, key);
    },

    uint8Array: (uint8Array: Uint8Array, key?: string | Buffer) => {
      return CryptoHelper.decrypt.buffer(Buffer.from(uint8Array), key);
    },

    string: (string: string, inputEncoding?: Encoding, outputEncoding?: BufferEncoding, key?: string | Buffer) => {
      return CryptoHelper.decrypt.string(string, inputEncoding, outputEncoding, key);
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      return CryptoHelper.decrypt.buffer(buffer, key);
    },
  },
};

export { LocationHelper };
