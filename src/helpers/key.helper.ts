import { AEAD, HASH, Hash, Helper, PBKDF } from '@jihyunlab/crypto';

export const Key = {
  load() {
    const key = process.env.JIHYUNLAB_SECRET_KEY;

    if (!key || key.length === 0) {
      return null;
    }

    return key;
  },

  generate(key?: string | Buffer, salt: string | Buffer = '', hash: HASH = HASH.SHA512) {
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
      Hash.create(hash).update(loadedKey).hex(),
      Hash.create(hash).update(salt).hex(),
      PBKDF.PBKDF2,
      1024,
      hash
    );
  },
};
