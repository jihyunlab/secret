import { Text as TextCrypto } from '../../src/index';

export const Text = {
  encrypt: (text: string, key?: string) => {
    try {
      console.log(`text: ${text}`);
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

  decrypt: (hex: string, key?: string) => {
    try {
      console.log(`text: ${hex}`);
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
