import { Secure } from '../../src/index';
import {
  ExpiredException,
  IllegalArgumentException,
  NotFoundException,
  NotSupportedException,
  SignatureException,
} from '../../src/helpers/exception.helper';
import { HASH, Hash } from '@jihyunlab/crypto';

describe('Message', () => {
  const processEnv = process.env;

  const keyString = 'JihyunLab';
  const keyBuffer = Buffer.from(keyString, 'utf8');

  const textString = 'Welcome to JihyunLab.';

  beforeEach(() => {
    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: keyString,
    };
  });

  afterEach(() => {
    process.env = processEnv;
  });

  test('message()', () => {
    const encoded = Secure.message.encode(Buffer.from(textString));
    const decoded = Secure.message.decode(encoded);

    expect(Buffer.from(textString)).toStrictEqual(decoded);
  });

  test('message(key - string)', () => {
    const encoded = Secure.message.encode(Buffer.from(textString), keyString);
    const decoded = Secure.message.decode(encoded, keyString);

    expect(Buffer.from(textString)).toStrictEqual(decoded);
  });

  test('message(key - buffer)', () => {
    const encoded = Secure.message.encode(Buffer.from(textString), keyBuffer);
    const decoded = Secure.message.decode(encoded, keyBuffer);

    expect(Buffer.from(textString)).toStrictEqual(decoded);
  });

  test('encode(): exception(NotFoundException)', () => {
    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: undefined,
    };

    expect(() => {
      Secure.message.encode(Buffer.from(textString));
    }).toThrow(NotFoundException);
  });

  test('decode(): exception(IllegalArgumentException)', () => {
    expect(() => {
      Secure.message.decode('');
    }).toThrow(IllegalArgumentException);
  });

  test('decode(): exception(IllegalArgumentException)', () => {
    expect(() => {
      Secure.message.decode('string');
    }).toThrow(IllegalArgumentException);
  });

  test('decode(): exception(NotSupportedException - typ)', () => {
    expect(() => {
      const header = Buffer.from(JSON.stringify({ typ: 'JWT', alg: 'ES256', enc: 'A256GCM' })).toString('base64url');

      Secure.message.decode(`${header}.payload.keys.encryptedData.signature`);
    }).toThrow(NotSupportedException);
  });

  test('decode(): exception(NotSupportedException - alg)', () => {
    expect(() => {
      const header = Buffer.from(JSON.stringify({ typ: 'JLSM', alg: 'RS256', enc: 'A256GCM' })).toString('base64url');

      Secure.message.decode(`${header}.payload.keys.encryptedData.signature`);
    }).toThrow(NotSupportedException);
  });

  test('decode(): exception(NotSupportedException - enc)', () => {
    expect(() => {
      const header = Buffer.from(JSON.stringify({ typ: 'JLSM', alg: 'ES256', enc: 'A256CCM' })).toString('base64url');

      Secure.message.decode(`${header}.payload.keys.encryptedData.signature`);
    }).toThrow(NotSupportedException);
  });

  test('decode(): exception(ExpiredException)', () => {
    expect(() => {
      const header = Buffer.from(JSON.stringify({ typ: 'JLSM', alg: 'ES256', enc: 'A256GCM' })).toString('base64url');

      const current = Date.now();
      const payload = Buffer.from(
        JSON.stringify({
          iss: 'https://jihyunlab.com',
          iat: Math.floor(current / 1000) - 320,
          exp: Math.floor(current / 1000) - 160,
          jti: Hash.create(HASH.SHA256).update('').hex(),
        })
      ).toString('base64url');

      Secure.message.decode(`${header}.${payload}.keys.encryptedData.signature`);
    }).toThrow(ExpiredException);
  });

  test('decode(): exception(NotFoundException - jti empty)', () => {
    expect(() => {
      const header = Buffer.from(JSON.stringify({ typ: 'JLSM', alg: 'ES256', enc: 'A256GCM' })).toString('base64url');

      const current = Date.now();
      const payload = Buffer.from(
        JSON.stringify({
          iss: 'https://jihyunlab.com',
          iat: Math.floor(current / 1000),
          exp: Math.floor(current / 1000) + 160,
          jti: '',
        })
      ).toString('base64url');

      Secure.message.decode(`${header}.${payload}.keys.encryptedData.signature`);
    }).toThrow(NotFoundException);
  });

  test('decode(): exception(NotFoundException - jti null)', () => {
    expect(() => {
      const header = Buffer.from(JSON.stringify({ typ: 'JLSM', alg: 'ES256', enc: 'A256GCM' })).toString('base64url');

      const current = Date.now();
      const payload = Buffer.from(
        JSON.stringify({
          iss: 'https://jihyunlab.com',
          iat: Math.floor(current / 1000),
          exp: Math.floor(current / 1000) + 160,
        })
      ).toString('base64url');

      Secure.message.decode(`${header}.${payload}.keys.encryptedData.signature`);
    }).toThrow(NotFoundException);
  });

  test('decode(): exception(NotFoundException - key)', () => {
    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: undefined,
    };

    expect(() => {
      const header = Buffer.from(JSON.stringify({ typ: 'JLSM', alg: 'ES256', enc: 'A256GCM' })).toString('base64url');

      const current = Date.now();
      const payload = Buffer.from(
        JSON.stringify({
          iss: 'https://jihyunlab.com',
          iat: Math.floor(current / 1000),
          exp: Math.floor(current / 1000) + 160,
          jti: Hash.create(HASH.SHA256).update('').hex(),
        })
      ).toString('base64url');

      Secure.message.decode(`${header}.${payload}.keys.encryptedData.signature`);
    }).toThrow(NotFoundException);
  });

  test('decode(): exception(NotFoundException - keys)', () => {
    expect(() => {
      const header = Buffer.from(JSON.stringify({ typ: 'JLSM', alg: 'ES256', enc: 'A256GCM' })).toString('base64url');

      const current = Date.now();
      const payload = Buffer.from(
        JSON.stringify({
          iss: 'https://jihyunlab.com',
          iat: Math.floor(current / 1000),
          exp: Math.floor(current / 1000) + 160,
          jti: Hash.create(HASH.SHA256).update('').hex(),
        })
      ).toString('base64url');

      const keys = Buffer.from(JSON.stringify([])).toString('base64url');

      Secure.message.decode(`${header}.${payload}.${keys}.encryptedData.signature`);
    }).toThrow(NotFoundException);
  });

  test('decode(): exception(SignatureException)', () => {
    expect(() => {
      const header = Buffer.from(JSON.stringify({ typ: 'JLSM', alg: 'ES256', enc: 'A256GCM' })).toString('base64url');

      const current = Date.now();
      const payload = Buffer.from(
        JSON.stringify({
          iss: 'https://jihyunlab.com',
          iat: Math.floor(current / 1000),
          exp: Math.floor(current / 1000) + 160,
          jti: Hash.create(HASH.SHA256).update('').hex(),
        })
      ).toString('base64url');

      const keys = Buffer.from(
        JSON.stringify([
          {
            kty: 'EC',
            crv: 'P-256',
            use: 'sig',
            x: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU',
            y: 'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0',
          },
        ])
      ).toString('base64url');

      Secure.message.decode(
        `${header}.${payload}.${keys}.encryptedData.${Buffer.from('signature').toString('base64url')}`
      );
    }).toThrow(SignatureException);
  });
});
