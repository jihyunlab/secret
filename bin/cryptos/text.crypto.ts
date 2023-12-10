import { Text as TextCrypto } from '../../src/index';

export const Text = {
  encrypt: (text: string, key?: string, output?: string, bak = false) => {
    try {
      console.log(`text: ${text}`);

      if (output) {
        console.log('warning: the -o option cannot be used when encrypting text.');
      }

      if (bak) {
        console.log('warning: the -b option cannot be used when encrypting text.');
      }

      const encrypted = TextCrypto.encrypt(text, key);

      console.log(`encrypted: ${encrypted}`);
      console.log('text encryption success.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  },

  decrypt: (hex: string, key?: string, output?: string, bak = false) => {
    try {
      console.log(`text: ${hex}`);

      if (output) {
        console.log('warning: the -o option cannot be used when decrypting text.');
      }

      if (bak) {
        console.log('warning: the -b option cannot be used when decrypting text.');
      }

      const decrypted = TextCrypto.decrypt(hex, key);

      console.log(`decrypted: ${decrypted}`);
      console.log('text decryption success.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  },
};
