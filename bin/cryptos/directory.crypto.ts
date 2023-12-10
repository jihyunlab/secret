import { join } from 'path';
import { File as FileCrypto, LocationHelper } from '../../src/index';
import { readFileSync, writeFileSync } from 'fs';

export const Directory = {
  encrypt: (input: string, key?: string, output?: string, bak = false) => {
    try {
      const locationInput = LocationHelper.toAbsolute(input);
      console.log(`input: ${LocationHelper.toRelative(locationInput)}`);

      let locationOutput = output;

      if (!LocationHelper.isExist(locationInput)) {
        throw new Error('input directory does not exist.');
      }

      if (!LocationHelper.isDirectory(locationInput)) {
        throw new Error('there is a file in the input directory path.');
      }

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

      const directory = LocationHelper.searchDirectory(locationInput, ignore);

      for (let i = 0; i < directory.ignores.length; i++) {
        console.log(`ignored: ${LocationHelper.toRelative(directory.ignores[i])}`);
      }

      for (let i = 0; i < directory.files.length; i++) {
        const file = directory.files[i];

        if (bak) {
          writeFileSync(`${file}.bak`, readFileSync(file));
        }

        let output: string | undefined = undefined;

        if (locationOutput) {
          output = join(locationOutput, file.replace(locationInput, ''));
          FileCrypto.encrypt(file, key, output);
          console.log(`encrypted: ${LocationHelper.toRelative(output)}`);
        } else {
          const encrypted = FileCrypto.encrypt(file, key);
          writeFileSync(file, encrypted);
          console.log(`encrypted: ${LocationHelper.toRelative(file)}`);
        }
      }

      console.log('directory encryption success.');
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
      const locationInput = LocationHelper.toAbsolute(input);
      console.log(`input: ${LocationHelper.toRelative(locationInput)}`);

      let locationOutput = output;

      if (!LocationHelper.isExist(locationInput)) {
        throw new Error('input directory does not exist.');
      }

      if (!LocationHelper.isDirectory(locationInput)) {
        throw new Error('there is a file in the input directory path.');
      }

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

      const directory = LocationHelper.searchDirectory(locationInput, ignore);

      for (let i = 0; i < directory.ignores.length; i++) {
        console.log(`ignored: ${LocationHelper.toRelative(directory.ignores[i])}`);
      }

      for (let i = 0; i < directory.files.length; i++) {
        const file = directory.files[i];

        if (bak) {
          writeFileSync(`${file}.bak`, readFileSync(file));
        }

        let output: string | undefined = undefined;

        if (locationOutput) {
          output = join(locationOutput, file.replace(locationInput, ''));
          FileCrypto.decrypt(file, key, output);
          console.log(`decrypted: ${LocationHelper.toRelative(output)}`);
        } else {
          const decrypted = FileCrypto.decrypt(file, key);
          writeFileSync(file, decrypted);
          console.log(`decrypted: ${LocationHelper.toRelative(file)}`);
        }
      }

      console.log('directory decryption success.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  },
};
