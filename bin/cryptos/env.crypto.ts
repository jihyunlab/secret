import { Env as EnvCrypto, LocationHelper } from '../../src/index';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export const Env = {
  encrypt: (input: string, key?: string, output?: string, bak = false) => {
    try {
      const location = LocationHelper.toAbsolute(input);
      console.log(`input: ${LocationHelper.toRelative(location)}`);

      if (!LocationHelper.isExist(location)) {
        throw new Error('the input file or directory does not exist.');
      }

      if (LocationHelper.isDirectory(location)) {
        let locationOutput = output;

        if (locationOutput) {
          locationOutput = LocationHelper.toAbsolute(locationOutput);

          if (LocationHelper.isExist(locationOutput) && !LocationHelper.isDirectory(locationOutput)) {
            throw new Error('there is a file in the output directory path.');
          }
        }

        let ignore: string | undefined;
        const ignoreFile = join(process.cwd(), '.secretignore');

        if (LocationHelper.isExist(ignoreFile)) {
          ignore = readFileSync(ignoreFile).toString();
        }

        const directory = LocationHelper.searchDirectory(location, ignore);

        for (let i = 0; i < directory.ignores.length; i++) {
          console.log(`ignored: ${LocationHelper.toRelative(directory.ignores[i])}`);
        }

        for (let i = 0; i < directory.files.length; i++) {
          const file = directory.files[i];

          if (!LocationHelper.toBasename(file).startsWith('.env')) {
            continue;
          }

          if (bak) {
            writeFileSync(`${file}.bak`, readFileSync(file));
          }

          let output: string | undefined = undefined;

          if (locationOutput) {
            output = join(locationOutput, file.replace(location, ''));
            EnvCrypto.encrypt(file, key, output);
            console.log(`encrypted: ${LocationHelper.toRelative(output)}`);
          } else {
            const encrypted = EnvCrypto.encrypt(file, key);
            writeFileSync(file, encrypted);
            console.log(`encrypted: ${LocationHelper.toRelative(file)}`);
          }
        }

        console.log('.env directory encryption success.');
      } else {
        const encrypted = EnvCrypto.encrypt(location, key, output);

        if (bak) {
          writeFileSync(`${location}.bak`, readFileSync(location));
        }

        if (output) {
          console.log(`encrypted: ${LocationHelper.toRelative(output)}`);
        } else {
          writeFileSync(location, encrypted);
          console.log(`encrypted: ${LocationHelper.toRelative(location)}`);
        }

        console.log('.env file encryption success.');
      }
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
        throw new Error('the input file or directory does not exist.');
      }

      if (LocationHelper.isDirectory(location)) {
        let locationOutput = output;

        if (locationOutput) {
          locationOutput = LocationHelper.toAbsolute(locationOutput);

          if (LocationHelper.isExist(locationOutput) && !LocationHelper.isDirectory(locationOutput)) {
            throw new Error('there is a file in the output directory path.');
          }
        }

        let ignore: string | undefined;
        const ignoreFile = join(process.cwd(), '.secretignore');

        if (LocationHelper.isExist(ignoreFile)) {
          ignore = readFileSync(ignoreFile).toString();
        }

        const directory = LocationHelper.searchDirectory(location, ignore);

        for (let i = 0; i < directory.ignores.length; i++) {
          console.log(`ignored: ${LocationHelper.toRelative(directory.ignores[i])}`);
        }

        for (let i = 0; i < directory.files.length; i++) {
          const file = directory.files[i];

          if (!LocationHelper.toBasename(file).startsWith('.env')) {
            continue;
          }

          if (bak) {
            writeFileSync(`${file}.bak`, readFileSync(file));
          }

          let output: string | undefined = undefined;

          if (locationOutput) {
            output = join(locationOutput, file.replace(location, ''));
            EnvCrypto.decrypt(file, key, output);
            console.log(`decrypted: ${LocationHelper.toRelative(output)}`);
          } else {
            const decrypted = EnvCrypto.decrypt(file, key);
            writeFileSync(file, decrypted);
            console.log(`decrypted: ${LocationHelper.toRelative(file)}`);
          }
        }

        console.log('.env directory decryption success.');
      } else {
        const decrypted = EnvCrypto.decrypt(location, key, output);

        if (bak) {
          writeFileSync(`${location}.bak`, readFileSync(location));
        }

        if (output) {
          console.log(`decrypted: ${LocationHelper.toRelative(output)}`);
        } else {
          writeFileSync(location, decrypted);
          console.log(`decrypted: ${LocationHelper.toRelative(location)}`);
        }

        console.log('.env file decryption success.');
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
