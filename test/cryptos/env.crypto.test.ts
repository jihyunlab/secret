import { Env } from '../../src/index';
import { config } from 'dotenv';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

describe('Env', () => {
  const processEnv = process.env;

  const keyString = 'JihyunLab';

  const base = 'test-env';

  const env = join(base, '.env');
  const encEnv = join(base, '.env_enc');
  const dir = join(base, 'dir');
  const file = join(base, 'file');

  const envKey = 'JIHYUNLAB_ENV';
  const envValue = 'WELCOME_TO_JIHYUNLAB';

  beforeAll(() => {
    mkdirSync(base, { recursive: true });
    mkdirSync(dir, { recursive: true });
  });

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
    rmSync(base, { recursive: true, force: true });
  });

  beforeEach(() => {
    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: keyString,
    };

    writeFileSync(env, `${envKey}=${envValue}\n`);
    writeFileSync(file, `${envKey}=${envValue}\n`);

    Env.encrypt(env, encEnv);
  });

  afterEach(() => {
    process.env = processEnv;

    rmSync(env, { force: true });
    rmSync(file, { force: true });
  });

  test('load()', () => {
    Env.load(config({ path: encEnv }));
    expect(process.env.JIHYUNLAB_ENV).toBe(envValue);
  });

  test('cipher(): output', () => {
    Env.encrypt(env, join(base, '.env_enc_cipher'));
    Env.decrypt(join(base, '.env_enc_cipher'), join(base, '.env_dec_cipher'));

    expect(readFileSync(env)).toStrictEqual(readFileSync(join(base, '.env_dec_cipher')));
  });

  test('encrypt(): exception(empty)', () => {
    expect(() => {
      Env.encrypt('');
    }).toThrow(Error);
  });

  test('encrypt(): exception(not found)', () => {
    expect(() => {
      Env.encrypt('wrong');
    }).toThrow(Error);
  });

  test('encrypt(): exception(dir)', () => {
    expect(() => {
      Env.encrypt('test');
    }).toThrow(Error);
  });

  test('encrypt(): exception(dir output)', () => {
    expect(() => {
      Env.encrypt(env, dir);
    }).toThrow(Error);
  });

  test('encrypt() - exception(name)', () => {
    expect(() => {
      Env.encrypt(join(base, 'env.test.ts'));
    }).toThrow(Error);
  });

  test('encrypt() - exception(not .env)', () => {
    expect(() => {
      Env.encrypt(file);
    }).toThrow(Error);
  });

  test('decrypt(): exception(empty)', () => {
    expect(() => {
      Env.decrypt('');
    }).toThrow(Error);
  });

  test('decrypt(): exception(not found)', () => {
    expect(() => {
      Env.decrypt('wrong');
    }).toThrow(Error);
  });

  test('decrypt(): exception(dir)', () => {
    expect(() => {
      Env.decrypt('test');
    }).toThrow(Error);
  });

  test('decrypt(): exception(dir output)', () => {
    expect(() => {
      Env.decrypt(encEnv, dir);
    }).toThrow(Error);
  });

  test('decrypt() - exception(name)', () => {
    expect(() => {
      Env.decrypt(join(base, 'env.test.ts'));
    }).toThrow(Error);
  });

  test('decrypt() - exception(not .env)', () => {
    expect(() => {
      Env.decrypt(file);
    }).toThrow(Error);
  });
});
