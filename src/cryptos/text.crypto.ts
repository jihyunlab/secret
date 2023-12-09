import { Crypto as CryptoHelper } from '../helpers/crypto.helper';

export const Text = {
  encrypt: (text: string, key?: string | Buffer) => {
    return CryptoHelper.encrypt.string(text, key);
  },

  decrypt: (hex: string, key?: string | Buffer) => {
    return CryptoHelper.decrypt.string(hex, key);
  },
};
