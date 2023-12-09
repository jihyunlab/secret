import { Crypto as CryptoHelper } from '../helpers/crypto.helper';
import { Location as LocationHelper } from '../helpers/location.helper';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

export const File = {
  encrypt: (input: string, key?: string | Buffer, output?: string) => {
    const location = LocationHelper.toAbsolute(input);

    if (!LocationHelper.isExist(location)) {
      throw new Error('input file does not exist.');
    }

    if (LocationHelper.isDir(location)) {
      throw new Error('there is a directory in the input path.');
    }

    const buffer = readFileSync(location);
    const encrypted = CryptoHelper.encrypt.buffer(buffer, key);

    if (output) {
      const location = LocationHelper.toAbsolute(output);

      if (LocationHelper.isExist(location) && LocationHelper.isDir(location)) {
        throw new Error('there is a directory in the output path.');
      }

      mkdirSync(LocationHelper.toDir(location, true), { recursive: true });
      writeFileSync(location, encrypted);
    }

    return encrypted;
  },

  decrypt: (input: string, key?: string | Buffer, output?: string) => {
    const location = LocationHelper.toAbsolute(input);

    if (!LocationHelper.isExist(location)) {
      throw new Error('input file does not exist.');
    }

    if (LocationHelper.isDir(location)) {
      throw new Error('there is a directory in the input path.');
    }

    const buffer = readFileSync(location);
    const decrypted = CryptoHelper.decrypt.buffer(buffer, key);

    if (output) {
      const location = LocationHelper.toAbsolute(output);

      if (LocationHelper.isExist(location) && LocationHelper.isDir(location)) {
        throw new Error('there is a directory in the output path.');
      }

      mkdirSync(LocationHelper.toDir(location, true), { recursive: true });
      writeFileSync(location, decrypted);
    }

    return decrypted;
  },
};
