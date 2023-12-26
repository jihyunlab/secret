import { File } from '../../src/index';
import { join } from 'path';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';

describe('File', () => {
  const processEnv = process.env;

  const keyString = 'JihyunLab';
  const keyBuffer = Buffer.from(keyString, 'utf8');

  const textString = 'Welcome to JihyunLab.';

  const base = 'test-file';

  const dir = join(base, 'dir');
  const file = join(base, 'plain.txt');
  const fileEnc = join(base, 'plain_enc.txt');

  const encryptedFile = join(base, 'encrypted.enc');
  const decryptedFile = join(base, 'decrypted.enc');

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

    writeFileSync(file, textString);

    File.encrypt(file, fileEnc);
  });

  afterEach(() => {
    process.env = processEnv;

    rmSync(file, { force: true });
    rmSync(encryptedFile, { force: true });
    rmSync(decryptedFile, { force: true });
  });

  test('environment key()', () => {
    const encrypted = File.encrypt(file, encryptedFile);
    const decrypted = File.decrypt(encryptedFile, decryptedFile);
    expect(encrypted).toStrictEqual(readFileSync(encryptedFile));
    expect(decrypted).toStrictEqual(readFileSync(decryptedFile));
    expect(readFileSync(file)).toStrictEqual(readFileSync(decryptedFile));
  });

  test('user key(string)', () => {
    const encrypted = File.encrypt(file, encryptedFile, keyString);
    const decrypted = File.decrypt(encryptedFile, decryptedFile, keyString);
    expect(encrypted).toStrictEqual(readFileSync(encryptedFile));
    expect(decrypted).toStrictEqual(readFileSync(decryptedFile));
    expect(readFileSync(file)).toStrictEqual(readFileSync(decryptedFile));
  });

  test('user key(buffer)', () => {
    const encrypted = File.encrypt(file, encryptedFile, keyBuffer);
    const decrypted = File.decrypt(encryptedFile, decryptedFile, keyBuffer);
    expect(encrypted).toStrictEqual(readFileSync(encryptedFile));
    expect(decrypted).toStrictEqual(readFileSync(decryptedFile));
    expect(readFileSync(file)).toStrictEqual(readFileSync(decryptedFile));
  });

  test('mixed key()', () => {
    let encrypted: Buffer;
    let decrypted: Buffer;

    encrypted = File.encrypt(file, encryptedFile, keyString);
    decrypted = File.decrypt(encryptedFile, decryptedFile);
    expect(encrypted).toStrictEqual(readFileSync(encryptedFile));
    expect(decrypted).toStrictEqual(readFileSync(decryptedFile));
    expect(readFileSync(file)).toStrictEqual(readFileSync(decryptedFile));

    encrypted = File.encrypt(file, encryptedFile);
    decrypted = File.decrypt(encryptedFile, decryptedFile, keyString);
    expect(encrypted).toStrictEqual(readFileSync(encryptedFile));
    expect(decrypted).toStrictEqual(readFileSync(decryptedFile));
    expect(readFileSync(file)).toStrictEqual(readFileSync(decryptedFile));

    encrypted = File.encrypt(file, encryptedFile, keyBuffer);
    decrypted = File.decrypt(encryptedFile, decryptedFile);
    expect(encrypted).toStrictEqual(readFileSync(encryptedFile));
    expect(decrypted).toStrictEqual(readFileSync(decryptedFile));
    expect(readFileSync(file)).toStrictEqual(readFileSync(decryptedFile));

    encrypted = File.encrypt(file, encryptedFile);
    decrypted = File.decrypt(encryptedFile, decryptedFile, keyBuffer);
    expect(encrypted).toStrictEqual(readFileSync(encryptedFile));
    expect(decrypted).toStrictEqual(readFileSync(decryptedFile));
    expect(readFileSync(file)).toStrictEqual(readFileSync(decryptedFile));
  });

  test('encrypt(): exception(empty)', () => {
    expect(() => {
      File.encrypt('');
    }).toThrow(Error);
  });

  test('encrypt(): exception(not found)', () => {
    expect(() => {
      File.encrypt('wrong');
    }).toThrow(Error);
  });

  test('encrypt(): exception(dir)', () => {
    expect(() => {
      File.encrypt('test');
    }).toThrow(Error);
  });

  test('encrypt(): exception(dir output)', () => {
    expect(() => {
      File.encrypt(file, dir);
    }).toThrow(Error);
  });

  test('decrypt(): exception(empty)', () => {
    expect(() => {
      File.decrypt('');
    }).toThrow(Error);
  });

  test('decrypt(): exception(not found)', () => {
    expect(() => {
      File.decrypt('wrong');
    }).toThrow(Error);
  });

  test('decrypt(): exception(dir)', () => {
    expect(() => {
      File.decrypt('test');
    }).toThrow(Error);
  });

  test('decrypt(): exception(dir output)', () => {
    expect(() => {
      File.decrypt(fileEnc, dir);
    }).toThrow(Error);
  });
});
