import { AEAD, HASH, Hash, Helper } from '@jihyunlab/crypto';

export const Key = {
  load() {
    let key = process.env.JIHYUNLAB_SECRET_KEY;

    if (!key) {
      throw new Error('key not found.');
    }

    return key;
  },

  generate(key: string | Buffer) {
    return Helper.key.generate(
      AEAD.AES_256_CCM,
      Hash.create(HASH.SHA512).update(key).hex(),
      Hash.create(HASH.SHA512).update('').hex()
    );
  },
};
