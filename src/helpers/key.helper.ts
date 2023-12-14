import { AEAD, HASH, Hash, Helper } from '@jihyunlab/crypto';

export const Key = {
  load() {
    return process.env.JIHYUNLAB_SECRET_KEY;
  },

  generate(key?: string | Buffer) {
    let loadedKey: string | Buffer | undefined;

    if (key) {
      loadedKey = key;
    } else {
      loadedKey = this.load();
    }

    if (!loadedKey) {
      throw new Error(
        'the key cannot be found in system environment variables. input the key or add the JIHYUNLAB_SECRET_KEY environment variable.'
      );
    }

    return Helper.key.generate(
      AEAD.AES_256_GCM,
      Hash.create(HASH.SHA512).update(loadedKey).hex(),
      Hash.create(HASH.SHA512).update('').hex()
    );
  },
};
