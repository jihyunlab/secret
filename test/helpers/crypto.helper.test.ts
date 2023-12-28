import { Crypto } from '../../src/index';

describe('Crypto', () => {
  const processEnv = process.env;

  const keyString = 'JihyunLab';
  const keyBuffer = Buffer.from(keyString, 'utf8');

  const textString = 'Welcome to JihyunLab.';
  const textBuffer = Buffer.from(textString, 'utf8');

  beforeEach(() => {
    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: keyString,
    };
  });

  afterEach(() => {
    process.env = processEnv;
  });

  test('environment key(binary)', () => {
    const encrypted = Crypto.encrypt.binary(textString);
    const decrypted = Crypto.decrypt.binary(encrypted);
    expect(decrypted).toBe(textString);
  });

  test('environment key(hex)', () => {
    const encrypted = Crypto.encrypt.hex(textString);
    const decrypted = Crypto.decrypt.hex(encrypted);
    expect(decrypted).toBe(textString);
  });

  test('environment key(base64)', () => {
    const encrypted = Crypto.encrypt.base64(textString);
    const decrypted = Crypto.decrypt.base64(encrypted);
    expect(decrypted).toBe(textString);
  });

  test('environment key(uint8Array)', () => {
    const encrypted = Crypto.encrypt.uint8Array(textBuffer);
    const decrypted = Crypto.decrypt.uint8Array(encrypted);
    expect(decrypted).toStrictEqual(textBuffer);
  });

  test('environment key(string)', () => {
    const encrypted = Crypto.encrypt.string(textString);
    const decrypted = Crypto.decrypt.string(encrypted);
    expect(decrypted).toBe(textString);
  });

  test('environment key(string - text encoding)', () => {
    let encrypted: string;
    let decrypted: string;

    encrypted = Crypto.encrypt.string(textString, 'utf8', 'hex');
    decrypted = Crypto.decrypt.string(encrypted, 'hex', 'utf8');
    expect(decrypted).toBe(textString);

    encrypted = Crypto.encrypt.string(textString, 'utf8', 'base64');
    decrypted = Crypto.decrypt.string(encrypted, 'base64', 'utf8');
    expect(decrypted).toBe(textString);

    encrypted = Crypto.encrypt.string(textString, 'utf8', 'base64url');
    decrypted = Crypto.decrypt.string(encrypted, 'base64url', 'utf8');
    expect(decrypted).toBe(textString);

    encrypted = Crypto.encrypt.string(textString, 'utf8', 'binary');
    decrypted = Crypto.decrypt.string(encrypted, 'binary', 'utf8');
    expect(decrypted).toBe(textString);

    encrypted = Crypto.encrypt.binary(textString, 'utf8');
    decrypted = Crypto.decrypt.binary(encrypted, 'utf8');
    expect(decrypted).toBe(textString);

    encrypted = Crypto.encrypt.hex(textString, 'utf8');
    decrypted = Crypto.decrypt.hex(encrypted, 'utf8');
    expect(decrypted).toBe(textString);

    encrypted = Crypto.encrypt.base64(textString, 'utf8');
    decrypted = Crypto.decrypt.base64(encrypted, 'utf8');
    expect(decrypted).toBe(textString);
  });

  test('environment key(buffer)', () => {
    const encrypted = Crypto.encrypt.buffer(textBuffer);
    const decrypted = Crypto.decrypt.buffer(encrypted);
    expect(decrypted).toStrictEqual(textBuffer);
  });

  test('environment key(string - buffer)', () => {
    let stringEncrypted: string;
    let stringDecrypted: string;
    let bufferEncrypted: Buffer;
    let bufferDecrypted: Buffer;

    stringEncrypted = Crypto.encrypt.string(textString);
    bufferDecrypted = Crypto.decrypt.buffer(Buffer.from(stringEncrypted, 'hex'));
    expect(bufferDecrypted).toStrictEqual(textBuffer);

    bufferEncrypted = Crypto.encrypt.buffer(textBuffer);
    stringDecrypted = Crypto.decrypt.string(bufferEncrypted.toString('hex'));
    expect(stringDecrypted).toBe(textString);
  });

  test('user key(binary)', () => {
    const encrypted = Crypto.encrypt.binary(textString, 'utf8', keyString);
    const decrypted = Crypto.decrypt.binary(encrypted, 'utf8', keyString);
    expect(decrypted).toBe(textString);
  });

  test('user key(hex)', () => {
    const encrypted = Crypto.encrypt.hex(textString, 'utf8', keyString);
    const decrypted = Crypto.decrypt.hex(encrypted, 'utf8', keyString);
    expect(decrypted).toBe(textString);
  });

  test('user key(base64)', () => {
    const encrypted = Crypto.encrypt.base64(textString, 'utf8', keyString);
    const decrypted = Crypto.decrypt.base64(encrypted, 'utf8', keyString);
    expect(decrypted).toBe(textString);
  });

  test('user key(uint8Array)', () => {
    const encrypted = Crypto.encrypt.uint8Array(textBuffer, keyString);
    const decrypted = Crypto.decrypt.uint8Array(encrypted, keyString);
    expect(decrypted).toStrictEqual(textBuffer);
  });

  test('user key(string)', () => {
    const encrypted = Crypto.encrypt.string(textString, 'utf8', 'hex', keyString);
    const decrypted = Crypto.decrypt.string(encrypted, 'hex', 'utf8', keyString);
    expect(decrypted).toBe(textString);
  });

  test('user key(buffer)', () => {
    const encrypted = Crypto.encrypt.buffer(textBuffer, keyBuffer);
    const decrypted = Crypto.decrypt.buffer(encrypted, keyBuffer);
    expect(decrypted).toStrictEqual(textBuffer);
  });

  test('mixed key(string)', () => {
    let encrypted: string;
    let decrypted: string;

    encrypted = Crypto.encrypt.string(textString, 'utf8', 'hex', keyString);
    decrypted = Crypto.decrypt.string(encrypted);
    expect(decrypted).toBe(textString);

    encrypted = Crypto.encrypt.string(textString);
    decrypted = Crypto.decrypt.string(encrypted, 'hex', 'utf8', keyString);
    expect(decrypted).toBe(textString);

    encrypted = Crypto.encrypt.string(textString, 'utf8', 'hex', keyBuffer);
    decrypted = Crypto.decrypt.string(encrypted);
    expect(decrypted).toBe(textString);

    encrypted = Crypto.encrypt.string(textString);
    decrypted = Crypto.decrypt.string(encrypted, 'hex', 'utf8', keyBuffer);
    expect(decrypted).toBe(textString);
  });

  test('mixed key(buffer)', () => {
    let encrypted: Buffer;
    let decrypted: Buffer;

    encrypted = Crypto.encrypt.buffer(textBuffer, keyString);
    decrypted = Crypto.decrypt.buffer(encrypted);
    expect(decrypted).toStrictEqual(textBuffer);

    encrypted = Crypto.encrypt.buffer(textBuffer);
    decrypted = Crypto.decrypt.buffer(encrypted, keyString);
    expect(decrypted).toStrictEqual(textBuffer);

    encrypted = Crypto.encrypt.buffer(textBuffer, keyBuffer);
    decrypted = Crypto.decrypt.buffer(encrypted);
    expect(decrypted).toStrictEqual(textBuffer);

    encrypted = Crypto.encrypt.buffer(textBuffer);
    decrypted = Crypto.decrypt.buffer(encrypted, keyBuffer);
    expect(decrypted).toStrictEqual(textBuffer);
  });
});
