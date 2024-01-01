import { Asymmetric, HASH, Hash, Helper } from '@jihyunlab/crypto';
import { Crypto } from '../../src/index';
import { Key } from '../helpers/key.helper';
import {
  ExpiredException,
  IllegalArgumentException,
  NotFoundException,
  NotSupportedException,
  SignatureException,
} from '../helpers/exception.helper';
import { randomBytes } from 'crypto';

const json = {
  // JLSM Header: JWT(RFC 7519) Header
  header: {
    typ: 'JLSM',
    alg: 'ES256',
    enc: 'A256GCM',
  },
  // JLSM Payload: JWT(RFC 7519) Payload
  payload: {
    iss: 'https://jihyunlab.com',
    iat: 0,
    exp: 0,
    jti: '',
  },
  // JLSM Keys: JWK(RFC 7517) Keys
  keys: [],

  // JLSM Encrypted Data: Protected by JLSE(JihyunLab Secure Encryption)

  // JLSM Signature: Protected by JLSS(JihyunLab Secure Signature)

  /*
  BASE64URL(UTF8(JLSM Header))
  || '.' || BASE64URL(UTF8(JLSM Payload))
  || '.' || BASE64URL(UTF8(JLSM Keys))
  || '.' || BASE64URL(UTF8(JLSM Encrypted Data))
  || '.' || BASE64URL(UTF8(JLSM Signature))
  */
};

export const Message = {
  encode: (message: Buffer, key?: string | Buffer) => {
    const jlsm = JSON.parse(JSON.stringify(json));

    let hash = HASH.SHA256;
    let hashLen = 256;

    if (jlsm['header']['alg'] === 'ES256') {
      hash = HASH.SHA256;
      hashLen = 256;
    }

    // JLSM Header
    const header = Buffer.from(JSON.stringify(jlsm['header'])).toString('base64url');

    // JLSM Payload
    const current = Date.now();

    jlsm['payload']['iat'] = Math.floor(current / 1000);
    jlsm['payload']['exp'] = jlsm['payload']['iat'] + 3 * 60;
    jlsm['payload']['jti'] = Hash.create(hash)
      .update(Buffer.concat([Buffer.from(current.toString()), randomBytes(Math.floor(hashLen / 8))]))
      .hex();

    const payload = Buffer.from(JSON.stringify(jlsm['payload'])).toString('base64url');

    // Load Key
    let loadedKey: string | Buffer | null;

    if (key) {
      loadedKey = key;
    } else {
      loadedKey = Key.load();
    }

    if (!loadedKey) {
      throw new NotFoundException(
        'the key cannot be found in system environment variables. input the key or add the JIHYUNLAB_SECRET_KEY environment variable.'
      );
    }

    const hashedLoadedKey = Hash.create(hash)
      .update(Buffer.from(loadedKey) || '')
      .buffer();

    // JLSM Keys
    let keyPair = Helper.keyPair.generate.p256();

    if (jlsm['header']['alg'] === 'ES256') {
      keyPair = Helper.keyPair.generate.p256();
    }

    const publicKey = keyPair.publicKey.export({ format: 'jwk' });
    jlsm['keys'].push(publicKey);

    const keys = Buffer.from(JSON.stringify(jlsm['keys'])).toString('base64url');

    // JLSM Encryption
    let buffer = Buffer.from(`${header}.${payload}.${keys}`, 'ascii');
    let hashedBuffer = Hash.create(hash).update(buffer).buffer();

    const secret = Key.generate(
      Hash.create(hash)
        .update(Buffer.concat([hashedBuffer, hashedLoadedKey]))
        .buffer(),
      jlsm['payload']['jti'],
      hash
    );

    const encryptedData = Crypto.encrypt.buffer(message, secret).toString('base64url');

    // JLSM Signature
    buffer = Buffer.from(`${header}.${payload}.${keys}.${encryptedData}`, 'ascii');
    hashedBuffer = Hash.create(hash).update(buffer).buffer();

    const signatureTo = Helper.key.pbkdf2(
      Hash.create(hash)
        .update(Buffer.concat([hashedBuffer, hashedLoadedKey]))
        .buffer(),
      jlsm['payload']['jti'],
      1024,
      Math.floor(hashLen / 8),
      hash
    );

    const signer = Asymmetric.create.signer({ key: keyPair.privateKey, dsaEncoding: 'ieee-p1363' });
    const signature = signer.sign(signatureTo).toString('base64url');

    return `${header}.${payload}.${keys}.${encryptedData}.${signature}`;
  },

  decode: (message: string, key?: string | Buffer) => {
    if (message.length === 0) {
      throw new IllegalArgumentException('there is no message to decode.');
    }

    const token = message.split('.');

    if (token.length !== 5) {
      throw new IllegalArgumentException('the structure of the message is incorrect.');
    }

    const header = token[0];
    const payload = token[1];
    const keys = token[2];
    const encryptedData = token[3];
    const signature = token[4];

    // JLSM Header
    const jsonHeader = JSON.parse(Buffer.from(header, 'base64url').toString());

    let hash = HASH.SHA256;
    let hashLen = 256;

    if (jsonHeader['typ'] !== 'JLSM') {
      throw new NotSupportedException(`${jsonHeader['typ']} is an unsupported message type.`);
    }

    if (jsonHeader['alg'] === 'ES256') {
      hash = HASH.SHA256;
      hashLen = 256;
    } else {
      throw new NotSupportedException(`${jsonHeader['alg']} is an unsupported algorithm.`);
    }

    if (jsonHeader['enc'] !== 'A256GCM') {
      throw new NotSupportedException(`${jsonHeader['enc']} is an unsupported encryption algorithm.`);
    }

    // JLSM Payload
    const jsonPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
    const current = Date.now();

    if (Math.floor(current / 1000) > jsonPayload['exp']) {
      throw new ExpiredException('this message has expired.');
    }

    if (!jsonPayload['jti'] || jsonPayload['jti'].length === 0) {
      throw new NotFoundException('jti not found.');
    }

    // Load Key
    let loadedKey: string | Buffer | null;

    if (key) {
      loadedKey = key;
    } else {
      loadedKey = Key.load();
    }

    if (!loadedKey) {
      throw new NotFoundException(
        'the key cannot be found in system environment variables. input the key or add the JIHYUNLAB_SECRET_KEY environment variable.'
      );
    }

    const hashedLoadedKey = Hash.create(hash)
      .update(Buffer.from(loadedKey) || '')
      .buffer();

    // JLSM Keys
    const jsonKeys = JSON.parse(Buffer.from(keys, 'base64url').toString());

    if (!jsonKeys || jsonKeys.length === 0) {
      throw new NotFoundException('keys not found.');
    }

    const publicKey = Helper.keyPair.generate.publicKey({ key: jsonKeys[0], format: 'jwk' });

    // JLSM Signature
    let buffer = Buffer.from(`${header}.${payload}.${keys}.${encryptedData}`, 'ascii');
    let hashedBuffer = Hash.create(hash).update(buffer).buffer();

    const signatureTo = Helper.key.pbkdf2(
      Hash.create(hash)
        .update(Buffer.concat([hashedBuffer, hashedLoadedKey]))
        .buffer(),
      jsonPayload['jti'],
      1024,
      Math.floor(hashLen / 8),
      hash
    );

    const verifier = Asymmetric.create.verifier({ key: publicKey, dsaEncoding: 'ieee-p1363' });
    const verified = verifier.verify(signatureTo, Buffer.from(signature, 'base64url'));

    if (!verified) {
      throw new SignatureException('signature verification failed.');
    }

    // JLSM Decryption
    buffer = Buffer.from(`${header}.${payload}.${keys}`, 'ascii');
    hashedBuffer = Hash.create(hash).update(buffer).buffer();

    const secret = Key.generate(
      Hash.create(hash)
        .update(Buffer.concat([hashedBuffer, hashedLoadedKey]))
        .buffer(),
      jsonPayload['jti'],
      hash
    );

    return Crypto.decrypt.buffer(Buffer.from(encryptedData, 'base64url'), secret);
  },
};
