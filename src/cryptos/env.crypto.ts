import { Crypto as CryptoHelper } from '../helpers/crypto.helper';
import { Location as LocationHelper } from '../helpers/location.helper';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { DotenvConfigOutput, DotenvPopulateInput, parse, populate } from 'dotenv';

export const Env = {
  load: (config: DotenvConfigOutput, key?: string) => {
    const parsed = config['parsed'];

    if (parsed) {
      const envKeys = Object.keys(parsed);
      const input: DotenvPopulateInput = {};

      for (let i = 0; i < envKeys.length; i++) {
        const envKey = envKeys[i];

        const value = parsed[envKey];
        input[envKey] = CryptoHelper.decrypt.string(value, 'hex', 'utf8', key);
      }

      let processEnv = process.env as DotenvPopulateInput;

      if (processEnv) {
        populate(processEnv, input, { override: true });
      }
    }
  },

  encrypt: (input: string, output?: string, key?: string | Buffer) => {
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

    let encrypted = '';

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];

      const value = env[envKey];
      encrypted = encrypted + `${envKey}=${CryptoHelper.encrypt.string(value, 'utf8', 'hex', key)}\n`;
    }

    if (output) {
      const location = LocationHelper.toAbsolute(output);

      if (LocationHelper.isExist(location) && LocationHelper.isDirectory(location)) {
        throw new Error('there is a directory in the output .env path.');
      }

      mkdirSync(LocationHelper.toDirectory(location, true), { recursive: true });
      writeFileSync(location, encrypted);
    }

    return encrypted;
  },

  decrypt: (input: string, output?: string, key?: string | Buffer) => {
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
      decrypted = decrypted + `${envKey}=${CryptoHelper.decrypt.string(value, 'hex', 'utf8', key)}\n`;
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
