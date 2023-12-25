import { AEAD, HASH, Hash, Helper } from '@jihyunlab/crypto';

export const Key = {
  load() {
    const key = process.env.JIHYUNLAB_SECRET_KEY;

    if (!key || key.length === 0) {
      return null;
    }

    return key;
  },

  generate(key?: string | Buffer) {
    let loadedKey: string | Buffer | null | undefined;

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
