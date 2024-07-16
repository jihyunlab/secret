/**
 * @jest-environment node
 */
import { CIPHER, Env } from '../src/index';

describe('Secret', () => {
  const processEnv = process.env;

  test(`Positive: CIPHER.AES_256_CBC`, async () => {
    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: 'jihyunlab',
    };

    let cipher = await Env.createCipher(CIPHER.AES_256_CBC);

    const encrypted = await cipher.encrypt('value');

    cipher = await Env.createCipher(CIPHER.AES_256_CBC);
    const decrypted = await cipher.decrypt(encrypted);

    process.env = processEnv;
    expect(decrypted).toEqual('value');
  });

  test(`Positive: CIPHER.AES_256_CBC - options`, async () => {
    let cipher = await Env.createCipher(CIPHER.AES_256_CBC, 'key', {
      salt: 'salt',
      iterations: 128,
      ivLength: 16,
    });

    const encrypted = await cipher.encrypt('value');

    cipher = await Env.createCipher(CIPHER.AES_256_CBC, 'key', {
      salt: 'salt',
      iterations: 128,
      ivLength: 16,
    });
    const decrypted = await cipher.decrypt(encrypted);

    expect(decrypted).toEqual('value');
  });

  test(`Positive: CIPHER.AES_256_CBC - from node crypto`, async () => {
    const encrypted =
      'e057f49f47d57c6ee73443473971b3b05a4f5e3b26285d57b8ef508d914aa1b7';

    const cipher = await Env.createCipher(CIPHER.AES_256_CBC, 'key');
    const decrypted = await cipher.decrypt(encrypted);

    expect(decrypted).toEqual('value');
  });

  test(`Positive: CIPHER.AES_256_CBC - from web-secure-storage`, async () => {
    const encrypted =
      'e36e4673703230dd1f7e8e2083a934760a6ca0e542a2f7ab9a61ee439601a983bcaacf2e75fb7343914ec30d41b44db4';

    const cipher = await Env.createCipher(CIPHER.AES_256_CBC, 'key');
    const decrypted = await cipher.decrypt(encrypted);

    expect(decrypted).toEqual('web-secure-storage');
  });

  test(`Positive: CIPHER.AES_256_GCM`, async () => {
    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: 'jihyunlab',
    };

    let cipher = await Env.createCipher();

    const encrypted = await cipher.encrypt('value');

    cipher = await Env.createCipher();
    const decrypted = await cipher.decrypt(encrypted);

    process.env = processEnv;
    expect(decrypted).toEqual('value');
  });

  test(`Positive: CIPHER.AES_256_GCM - options`, async () => {
    let cipher = await Env.createCipher(CIPHER.AES_256_GCM, 'key', {
      salt: 'salt',
      iterations: 128,
      ivLength: 12,
      tagLength: 128,
      additionalData: new Uint8Array([1, 2, 3, 4]),
    });

    const encrypted = await cipher.encrypt('value');

    cipher = await Env.createCipher(CIPHER.AES_256_GCM, 'key', {
      salt: 'salt',
      additionalData: new Uint8Array([1, 2, 3, 4]),
    });
    const decrypted = await cipher.decrypt(encrypted);

    expect(decrypted).toEqual('value');
  });

  test(`Positive: CIPHER.AES_256_GCM - from node crypto`, async () => {
    const encrypted =
      '9788cd9c3c6a4012da2c359e3b00970ddd4021418c6801ba4eb379a799294d2e61';

    const cipher = await Env.createCipher(CIPHER.AES_256_GCM, 'key');
    const decrypted = await cipher.decrypt(encrypted);

    expect(decrypted).toEqual('value');
  });

  test(`Positive: CIPHER.AES_256_GCM - from web-secure-storage`, async () => {
    const encrypted =
      '5751cc2e9ddeb49c8ba5ed58b7b73a4129606a4249022df3c223ca2ed74557dbbc6f14e82935640dc52b3a70e9c6';

    const cipher = await Env.createCipher(CIPHER.AES_256_GCM, 'key');
    const decrypted = await cipher.decrypt(encrypted);

    expect(decrypted).toEqual('web-secure-storage');
  });
});
