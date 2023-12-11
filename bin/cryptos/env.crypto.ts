import { Env as EnvCrypto, LocationHelper } from '../../src/index';
import { join } from 'path';
import { cpSync, readFileSync, rmSync, writeFileSync } from 'fs';

export const Env = {
  encrypt: (input: string, output?: string, bak = false, key?: string) => {
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

          if (!LocationHelper.toBasename(file).startsWith('.env')) {
            continue;
          }

          if (bak) {
            writeFileSync(`${file}.bak`, readFileSync(file));
          }

          let output: string | undefined = undefined;

          if (locationOutput) {
            output = join(locationOutput, file.replace(location, ''));
            EnvCrypto.encrypt(file, output, key);
            console.log(`encrypted: ${LocationHelper.toRelative(output)}`);
          }
        }

        if (temporaryOutput) {
          cpSync(locationOutput, location, { recursive: true, force: true });

          if (LocationHelper.isExist(locationOutput)) {
            rmSync(locationOutput, { recursive: true, force: true });
          }
        }

        console.log('.env directory encryption success.');
      } else {
        const encrypted = EnvCrypto.encrypt(location, output, key);

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

  decrypt: (input: string, output?: string, bak = false, key?: string) => {
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

          if (!LocationHelper.toBasename(file).startsWith('.env')) {
            continue;
          }

          if (bak) {
            writeFileSync(`${file}.bak`, readFileSync(file));
          }

          let output: string | undefined = undefined;

          if (locationOutput) {
            output = join(locationOutput, file.replace(location, ''));
            EnvCrypto.decrypt(file, output, key);
            console.log(`decrypted: ${LocationHelper.toRelative(output)}`);
          }
        }

        if (temporaryOutput) {
          cpSync(locationOutput, location, { recursive: true, force: true });

          if (LocationHelper.isExist(locationOutput)) {
            rmSync(locationOutput, { recursive: true, force: true });
          }
        }

        console.log('.env directory decryption success.');
      } else {
        const decrypted = EnvCrypto.decrypt(location, output, key);

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
