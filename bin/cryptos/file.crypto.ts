import { File as FileCrypto, LocationHelper } from '../../src/index';
import { readFileSync, writeFileSync } from 'fs';

export const File = {
  encrypt: (input: string, key?: string, output?: string, bak = false) => {
    try {
      const location = LocationHelper.toAbsolute(input);
      console.log(`input: ${LocationHelper.toRelative(location)}`);

      if (!LocationHelper.isExist(location)) {
        throw new Error('input file does not exist.');
      }

      const encrypted = FileCrypto.encrypt(location, key, output);

      if (bak) {
        writeFileSync(`${location}.bak`, readFileSync(location));
      }

      if (output) {
        console.log(`encrypted: ${LocationHelper.toRelative(output)}`);
      } else {
        writeFileSync(location, encrypted);
        console.log(`encrypted: ${LocationHelper.toRelative(location)}`);
      }

      console.log('file encryption success.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  },

  decrypt: (input: string, key?: string, output?: string, bak = false) => {
    try {
      const location = LocationHelper.toAbsolute(input);
      console.log(`input: ${LocationHelper.toRelative(location)}`);

      if (!LocationHelper.isExist(location)) {
        throw new Error('input file does not exist.');
      }

      const decrypted = FileCrypto.decrypt(location, key, output);

      if (bak) {
        writeFileSync(`${location}.bak`, readFileSync(location));
      }

      if (output) {
        console.log(`decrypted: ${LocationHelper.toRelative(output)}`);
      } else {
        writeFileSync(location, decrypted);
        console.log(`decrypted: ${LocationHelper.toRelative(location)}`);
      }

      console.log('file decryption success.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  },
};
