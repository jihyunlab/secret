import { Text } from '../src/index';

describe('Text', () => {
  const keyString = 'JihyunLab';
  const keyBuffer = Buffer.from(keyString, 'utf8');

  const textString = 'Welcome to JihyunLab.';

  beforeEach(() => {
    process.env.JIHYUNLAB_SECRET_KEY = keyString;
  });

  test('environment key()', () => {
    const encrypted = Text.encrypt(textString);
    const decrypted = Text.decrypt(encrypted);
    expect(decrypted).toBe(textString);
  });

  test('user key(string)', () => {
    const encrypted = Text.encrypt(textString, keyString);
    const decrypted = Text.decrypt(encrypted, keyString);
    expect(decrypted).toBe(textString);
  });

  test('user key(buffer)', () => {
    const encrypted = Text.encrypt(textString, keyBuffer);
    const decrypted = Text.decrypt(encrypted, keyBuffer);
    expect(decrypted).toBe(textString);
  });

  test('mixed key()', () => {
    let encrypted: string;
    let decrypted: string;

    encrypted = Text.encrypt(textString, keyString);
    decrypted = Text.decrypt(encrypted);
    expect(decrypted).toBe(textString);

    encrypted = Text.encrypt(textString);
    decrypted = Text.decrypt(encrypted, keyString);
    expect(decrypted).toBe(textString);

    encrypted = Text.encrypt(textString, keyBuffer);
    decrypted = Text.decrypt(encrypted);
    expect(decrypted).toBe(textString);

    encrypted = Text.encrypt(textString);
    decrypted = Text.decrypt(encrypted, keyBuffer);
    expect(decrypted).toBe(textString);
  });
});
