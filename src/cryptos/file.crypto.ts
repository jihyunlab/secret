import { Crypto as CryptoHelper } from '../helpers/crypto.helper';
import { Location as LocationHelper } from '../helpers/location.helper';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

export const File = {
  encrypt: (input: string, output?: string, key?: string | Buffer) => {
    const location = LocationHelper.toAbsolute(input);

    if (!LocationHelper.isExist(location)) {
      throw new Error('input file does not exist.');
    }

    if (LocationHelper.isDirectory(location)) {
      throw new Error('there is a directory in the input path.');
    }

    const buffer = readFileSync(location);
    const encrypted = CryptoHelper.encrypt.buffer(buffer, key);

    if (output) {
      const location = LocationHelper.toAbsolute(output);

      if (LocationHelper.isExist(location) && LocationHelper.isDirectory(location)) {
        throw new Error('there is a directory in the output path.');
      }

      mkdirSync(LocationHelper.toDirectory(location, true), { recursive: true });
      writeFileSync(location, encrypted);
    }

    return encrypted;
  },

  decrypt: (input: string, output?: string, key?: string | Buffer) => {
    const location = LocationHelper.toAbsolute(input);

    if (!LocationHelper.isExist(location)) {
      throw new Error('input file does not exist.');
    }

    if (LocationHelper.isDirectory(location)) {
      throw new Error('there is a directory in the input path.');
    }

    const buffer = readFileSync(location);
    const decrypted = CryptoHelper.decrypt.buffer(buffer, key);

    if (output) {
      const location = LocationHelper.toAbsolute(output);

      if (LocationHelper.isExist(location) && LocationHelper.isDirectory(location)) {
        throw new Error('there is a directory in the output path.');
      }

      mkdirSync(LocationHelper.toDirectory(location, true), { recursive: true });
      writeFileSync(location, decrypted);
    }

    return decrypted;
  },
};
