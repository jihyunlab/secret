/**
 * @jest-environment node
 */
import { CIPHER, EnvCipher } from '../../src/index';

describe('Env cipher', () => {
  const processEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: undefined,
    };
  });

  afterAll(() => {
    process.env = processEnv;
  });

  test(`Negative: createCipher() - secret does not exist.`, async () => {
    expect(async () => {
      await EnvCipher.create(CIPHER.AES_256_GCM);
    }).rejects.toThrow(Error('secret does not exist.'));
  });

  test(`Negative: encrypt() - text does not exist.`, async () => {
    const cipher = await EnvCipher.create(CIPHER.AES_256_GCM, 'key');

    expect(async () => {
      await cipher.encrypt(undefined as unknown as string);
    }).rejects.toThrow(Error('text does not exist.'));
  });

  test(`Negative: decrypt() - text does not exist.`, async () => {
    const cipher = await EnvCipher.create(CIPHER.AES_256_GCM, 'key');

    expect(async () => {
      await cipher.decrypt(undefined as unknown as string);
    }).rejects.toThrow(Error('text does not exist.'));
  });
});
