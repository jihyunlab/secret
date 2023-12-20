import { Env } from '../src/index';
import { config } from 'dotenv';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

describe('Env', () => {
  const keyString = 'JihyunLab';

  const base = 'test-env';

  const env = join(base, '.env');
  const dir = join(base, 'dir');
  const file = join(base, 'file');

  const envKey = 'JIHYUNLAB_ENV';
  const envValue = 'WELCOME_TO_JIHYUNLAB';

  beforeAll(() => {
    process.env.JIHYUNLAB_SECRET_KEY = keyString;
    mkdirSync(base, { recursive: true });
    mkdirSync(dir, { recursive: true });
  });

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
    rmSync(base, { recursive: true, force: true });
  });

  beforeEach(() => {
    writeFileSync(env, `${envKey}=${envValue}`);
    writeFileSync(file, `${envKey}=${envValue}`);

    Env.encrypt(env, env);
  });

  afterEach(() => {
    rmSync(env, { force: true });
    rmSync(file, { force: true });
  });

  test('load()', () => {
    Env.load(config({ path: env }));
    expect(process.env.JIHYUNLAB_ENV).toBe(envValue);
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
      Env.decrypt(env, dir);
    }).toThrow(Error);
  });

  test('decrypt() - exception(name)', () => {
    expect(() => {
      Env.decrypt(join(base, 'env.test.ts'));
    }).toThrow(Error);
  });
});
