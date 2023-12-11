import { File as FileCrypto, LocationHelper } from '../../src/index';
import { join } from 'path';
import { readFileSync, writeFileSync, cpSync, rmSync } from 'fs';

export const Directory = {
  encrypt: (input: string, output?: string, bak = false, key?: string) => {
    try {
      const location = LocationHelper.toAbsolute(input);
      console.log(`input: ${LocationHelper.toRelative(location)}`);

      let locationOutput = output;

      if (!LocationHelper.isExist(location)) {
        throw new Error('input directory does not exist.');
      }

      if (!LocationHelper.isDirectory(location)) {
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

      const directory = LocationHelper.searchDirectory(location, ignore);

      // for (let i = 0; i < directory.ignores.length; i++) {
      //   console.log(`ignored: ${LocationHelper.toRelative(directory.ignores[i])}`);
      // }

      let temporaryOutput = false;

      if (!locationOutput) {
        temporaryOutput = true;
        locationOutput = LocationHelper.toAbsolute('secret_temporary');

        if (LocationHelper.isExist(locationOutput)) {
          rmSync(locationOutput, { recursive: true, force: true });
        }
      }

      for (let i = 0; i < directory.files.length; i++) {
        const file = directory.files[i];

        if (LocationHelper.toBasename(file).startsWith('.secretignore')) {
          console.log(`ignored: ${LocationHelper.toRelative(file)}`);
          continue;
        }

        if (bak) {
          writeFileSync(`${file}.bak`, readFileSync(file));
        }

        let output: string | undefined = undefined;

        if (locationOutput) {
          output = join(locationOutput, file.replace(location, ''));
          FileCrypto.encrypt(file, output, key);
          console.log(`encrypted: ${LocationHelper.toRelative(file)}`);
        }
      }

      if (temporaryOutput) {
        cpSync(locationOutput, location, { recursive: true, force: true });

        if (LocationHelper.isExist(locationOutput)) {
          rmSync(locationOutput, { recursive: true, force: true });
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

  decrypt: (input: string, output?: string, bak = false, key?: string) => {
    try {
      const location = LocationHelper.toAbsolute(input);
      console.log(`input: ${LocationHelper.toRelative(location)}`);

      let locationOutput = output;

      if (!LocationHelper.isExist(location)) {
        throw new Error('input directory does not exist.');
      }

      if (!LocationHelper.isDirectory(location)) {
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

      const directory = LocationHelper.searchDirectory(location, ignore);

      // for (let i = 0; i < directory.ignores.length; i++) {
      //   console.log(`ignored: ${LocationHelper.toRelative(directory.ignores[i])}`);
      // }

      let temporaryOutput = false;

      if (!locationOutput) {
        temporaryOutput = true;
        locationOutput = LocationHelper.toAbsolute('secret_temporary');

        if (LocationHelper.isExist(locationOutput)) {
          rmSync(locationOutput, { recursive: true, force: true });
        }
      }

      for (let i = 0; i < directory.files.length; i++) {
        const file = directory.files[i];

        if (LocationHelper.toBasename(file).startsWith('.secretignore')) {
          console.log(`ignored: ${LocationHelper.toRelative(file)}`);
          continue;
        }

        if (bak) {
          writeFileSync(`${file}.bak`, readFileSync(file));
        }

        let output: string | undefined = undefined;

        if (locationOutput) {
          output = join(locationOutput, file.replace(location, ''));
          FileCrypto.decrypt(file, output, key);
          console.log(`decrypted: ${LocationHelper.toRelative(file)}`);
        }
      }

      if (temporaryOutput) {
        cpSync(locationOutput, location, { recursive: true, force: true });

        if (LocationHelper.isExist(locationOutput)) {
          rmSync(locationOutput, { recursive: true, force: true });
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
