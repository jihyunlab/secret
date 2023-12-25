import { File } from '../../src/index';
import { join } from 'path';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';

describe('File', () => {
  const keyString = 'JihyunLab';
  const keyBuffer = Buffer.from(keyString, 'utf8');

  const textString = 'Welcome to JihyunLab.';

  const base = 'test-file';

  const file = join(base, 'plain.txt');
  const encryptedFile = join(base, 'encrypted.enc');
  const decryptedFile = join(base, 'decrypted.enc');

  beforeAll(() => {
    process.env.JIHYUNLAB_SECRET_KEY = keyString;
    mkdirSync(base, { recursive: true });
  });

  afterAll(() => {
    rmSync(base, { recursive: true, force: true });
  });

  beforeEach(() => {
    writeFileSync(file, textString);
  });

  afterEach(() => {
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
});
