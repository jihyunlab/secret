import { File } from '../src/index';
import { readFileSync, rmSync, writeFileSync } from 'fs';

describe('File', () => {
  const keyString = 'JihyunLab';
  const keyBuffer = Buffer.from(keyString, 'utf8');

  const textString = 'Welcome to JihyunLab.';

  const file = 'test/plain.txt';
  const encryptedFile = 'test/encrypted.enc';
  const decryptedFile = 'test/decrypted.enc';

  beforeEach(() => {
    process.env.JIHYUNLAB_SECRET_KEY = keyString;
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
