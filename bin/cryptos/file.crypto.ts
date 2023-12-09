import { File as FileCrypto, LocationHelper } from '../../src/index';
import { readFileSync, writeFileSync } from 'fs';

export const File = {
  encrypt: (input: string, key?: string, output?: string, bak = false, log = true) => {
    try {
      const location = LocationHelper.toAbsolute(input);

      if (log) {
        console.log(`input: ${location}`);
      }

      const encrypted = FileCrypto.encrypt(location, key, output);

      if (bak) {
        writeFileSync(`${location}.bak`, readFileSync(location));

        if (log) {
          console.log(`bak: ${location}.bak`);
        }
      }

      if (output) {
        if (log) {
          console.log(`output: ${LocationHelper.toAbsolute(output)}`);
        }
      } else {
        writeFileSync(location, encrypted);

        if (log) {
          console.log(`output: ${location}`);
        }
      }

      if (log) {
        console.log(`encrypted: ${encrypted.toString('hex')}`);
        console.log('file encryption success.');
      } else {
        console.log(`${encrypted}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  },

  decrypt: (input: string, key?: string, output?: string, bak = false, log = true) => {
    try {
      const location = LocationHelper.toAbsolute(input);

      if (log) {
        console.log(`input: ${location}`);
      }

      const decrypted = FileCrypto.decrypt(location, key, output);

      if (bak) {
        writeFileSync(`${location}.bak`, readFileSync(location));

        if (log) {
          console.log(`bak: ${location}.bak`);
        }
      }

      if (output) {
        if (log) {
          console.log(`output: ${LocationHelper.toAbsolute(output)}`);
        }
      } else {
        writeFileSync(location, decrypted);

        if (log) {
          console.log(`output: ${location}`);
        }
      }

      if (log) {
        console.log(`decrypted: ${decrypted.toString()}`);
        console.log('file decryption success.');
      } else {
        console.log(`${decrypted}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  },
};
