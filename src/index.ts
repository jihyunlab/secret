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
    string: (string: string, inputEncoding?: Encoding, outputEncoding?: BufferEncoding, key?: string | Buffer) => {
      return CryptoHelper.encrypt.string(string, inputEncoding, outputEncoding, key);
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      return CryptoHelper.encrypt.buffer(buffer, key);
    },
  },

  decrypt: {
    string: (string: string, inputEncoding?: Encoding, outputEncoding?: BufferEncoding, key?: string | Buffer) => {
      return CryptoHelper.decrypt.string(string, inputEncoding, outputEncoding, key);
    },

    buffer: (buffer: Buffer, key?: string | Buffer) => {
      return CryptoHelper.decrypt.buffer(buffer, key);
    },
  },
};

export { LocationHelper };
