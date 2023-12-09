import { Text as TextCrypto } from '../../src/index';

export const Text = {
  encrypt: (text: string, key?: string, output?: string, bak = false, log = true) => {
    try {
      if (log) {
        console.log(`text: ${text}`);
      }

      if (log && output) {
        console.log('warning: the -o option cannot be used when encrypting text.');
      }

      if (log && bak) {
        console.log('warning: the -b option cannot be used when encrypting text.');
      }

      const encrypted = TextCrypto.encrypt(text, key);

      if (log) {
        console.log(`encrypted: ${encrypted}`);
        console.log('text encryption success.');
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

  decrypt: (hex: string, key?: string, output?: string, bak = false, log = true) => {
    try {
      if (log) {
        console.log(`text: ${hex}`);
      }

      if (log && output) {
        console.log('warning: the -o option cannot be used when decrypting text.');
      }

      if (log && bak) {
        console.log('warning: the -b option cannot be used when decrypting text.');
      }

      const decrypted = TextCrypto.decrypt(hex, key);

      if (log) {
        console.log(`decrypted: ${decrypted}`);
        console.log('text decryption success.');
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
