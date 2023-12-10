import { Text as TextCrypto } from './cryptos/text.crypto';
import { File as FileCrypto } from './cryptos/file.crypto';
import { Env as EnvCrypto } from './cryptos/env.crypto';
import { Crypto as CryptoHelper } from './helpers/crypto.helper';
import { Location as LocationHelper } from './helpers/location.helper';
import { Encoding } from 'crypto';

export const Text = {
  encrypt: (text: string, key?: string | Buffer) => {
    return TextCrypto.encrypt(text, key);
  },

  decrypt: (hex: string, key?: string | Buffer) => {
    return TextCrypto.decrypt(hex, key);
  },
};

export const File = {
  encrypt: (input: string, key?: string | Buffer, output?: string) => {
    return FileCrypto.encrypt(input, key, output);
  },

  decrypt: (input: string, key?: string | Buffer, output?: string) => {
    return FileCrypto.decrypt(input, key, output);
  },
};

export const Env = {
  encrypt: (input: string, key?: string | Buffer, output?: string) => {
    return EnvCrypto.encrypt(input, key, output);
  },

  decrypt: (input: string, key?: string | Buffer, output?: string) => {
    return EnvCrypto.decrypt(input, key, output);
  },
};

export const Crypto = {
  encrypt: {
    string: (string: string, key?: string | Buffer, inputEncoding?: Encoding, outputEncoding?: BufferEncoding) => {
      return CryptoHelper.encrypt.string(string, key, inputEncoding, outputEncoding);
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      return CryptoHelper.encrypt.buffer(buffer, key);
    },
  },

  decrypt: {
    string: (string: string, key?: string | Buffer, inputEncoding?: Encoding, outputEncoding?: BufferEncoding) => {
      return CryptoHelper.decrypt.string(string, key, inputEncoding, outputEncoding);
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      return CryptoHelper.decrypt.buffer(buffer, key);
    },
  },
};

export { LocationHelper };
