/**
 * @jest-environment node
 */
import { EnvHelper } from '../../src/index';
import { rmSync } from 'fs';

describe('Env helper', () => {
  test(`Positive: read() - relative`, async () => {
    const env = await EnvHelper.read(`./test/.env`);

    expect(env['JIHYUNLAB']).toBe('SECRET');
  });

  test(`Positive: read() - absolute`, async () => {
    const env = await EnvHelper.read(`${process.cwd()}/test/.env`);

    expect(env['JIHYUNLAB']).toBe('SECRET');
  });

  test(`Positive: write() - relative`, async () => {
    let env = await EnvHelper.read(`./test/.env`);
    await EnvHelper.write(`./test/.env_test_relative`, env);

    env = await EnvHelper.read(`./test/.env_test_relative`);

    rmSync(`${process.cwd()}/test/.env_test_relative`, { force: true });
    expect(env['JIHYUNLAB']).toBe('SECRET');
  });

  test(`Positive: write() - absolute`, async () => {
    let env = await EnvHelper.read(`${process.cwd()}/test/.env`);
    await EnvHelper.write(`${process.cwd()}/test/.env_test_absolute`, env);

    env = await EnvHelper.read(`./test/.env_test_absolute`);

    rmSync(`${process.cwd()}/test/.env_test_absolute`, { force: true });
    expect(env['JIHYUNLAB']).toBe('SECRET');
  });

  test(`Negative: read() - file does not exist.`, async () => {
    expect(async () => {
      await EnvHelper.read(`${process.cwd()}/test/helpers/undefined`);
    }).rejects.toThrow(Error('file does not exist.'));
  });

  test(`Negative: read() - the input path is a directory.`, async () => {
    expect(async () => {
      await EnvHelper.read(`${process.cwd()}/test/helpers`);
    }).rejects.toThrow(Error('the input path is a directory.'));
  });

  test(`Negative: write() - the input path is a directory.`, async () => {
    const env = await EnvHelper.read(`${process.cwd()}/test/.env`);

    expect(async () => {
      await EnvHelper.write(`${process.cwd()}/test/helpers`, env);
    }).rejects.toThrow(Error('the input path is a directory.'));
  });
});
