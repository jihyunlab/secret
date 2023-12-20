import { Env } from '../src/index';
import { config } from 'dotenv';
import { rmSync, writeFileSync } from 'fs';

describe('Env', () => {
  const keyString = 'JihyunLab';

  const env = 'test/.env';

  const envKey = 'JIHYUNLAB_ENV';
  const envValue = 'WELCOME_TO_JIHYUNLAB';

  beforeEach(() => {
    process.env.JIHYUNLAB_SECRET_KEY = keyString;
    writeFileSync(env, `${envKey}=${envValue}`);
    Env.encrypt(env, env);
  });

  afterEach(() => {
    rmSync(env, { force: true });
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

  test('encrypt(): exception(dir)', () => {
    expect(() => {
      Env.encrypt('test');
    }).toThrow(Error);
  });

  test('encrypt() - exception(name)', () => {
    expect(() => {
      Env.encrypt('test/env.test.ts');
    }).toThrow(Error);
  });

  test('decrypt(): exception(empty)', () => {
    expect(() => {
      Env.encrypt('');
    }).toThrow(Error);
  });

  test('decrypt(): exception(dir)', () => {
    expect(() => {
      Env.encrypt('test');
    }).toThrow(Error);
  });

  test('decrypt() - exception(name)', () => {
    expect(() => {
      Env.encrypt('test/env.test.ts');
    }).toThrow(Error);
  });
});
