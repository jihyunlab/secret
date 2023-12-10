import { Crypto as CryptoHelper } from '../helpers/crypto.helper';
import { Location as LocationHelper } from '../helpers/location.helper';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { parse } from 'dotenv';

export const Env = {
  encrypt: (input: string, key?: string | Buffer, output?: string) => {
    const location = LocationHelper.toAbsolute(input);

    if (!LocationHelper.isExist(location)) {
      throw new Error('input .env file does not exist.');
    }

    if (LocationHelper.isDirectory(location)) {
      throw new Error('there is a directory in the input .env path.');
    }

    if (!LocationHelper.toBasename(location).startsWith('.env')) {
      throw new Error('the file name does not start with .env.');
    }

    const env = parse(readFileSync(location));
    const envKeys = Object.keys(env);

    let encrypted = undefined;

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];

      const value = env[envKey];
      encrypted = encrypted + `${envKey}=${CryptoHelper.encrypt.string(value, key)}\n`;
    }

    if (output && encrypted) {
      const location = LocationHelper.toAbsolute(output);

      if (LocationHelper.isExist(location) && LocationHelper.isDirectory(location)) {
        throw new Error('there is a directory in the output .env path.');
      }

      mkdirSync(LocationHelper.toDirectory(location, true), { recursive: true });
      writeFileSync(location, encrypted);
    }

    return encrypted;
  },

  decrypt: (input: string, key?: string | Buffer, output?: string) => {
    const location = LocationHelper.toAbsolute(input);

    if (!LocationHelper.isExist(location)) {
      throw new Error('input .env file does not exist.');
    }

    if (LocationHelper.isDirectory(location)) {
      throw new Error('there is a directory in the input .env path.');
    }

    if (!LocationHelper.toBasename(location).startsWith('.env')) {
      throw new Error('the file name does not start with .env.');
    }

    const env = parse(readFileSync(location));
    const envKeys = Object.keys(env);

    let decrypted = '';

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];

      const value = env[envKey];
      decrypted = decrypted + `${envKey}=${CryptoHelper.decrypt.string(value, key)}\n`;
    }

    if (output) {
      const location = LocationHelper.toAbsolute(output);

      if (LocationHelper.isExist(location) && LocationHelper.isDirectory(location)) {
        throw new Error('there is a directory in the output .env path.');
      }

      mkdirSync(LocationHelper.toDirectory(location, true), { recursive: true });
      writeFileSync(location, decrypted);
    }

    return decrypted;
  },
};
