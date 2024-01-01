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
import { randomUUID } from 'crypto';

const json = {
  // JLSM Header: JWT(RFC 7519) Header
  header: {
    typ: 'JLSM',
    alg: 'ES256',
    kid: '',
    enc: 'A256GCM',
  },
  // JLSM Payload: JWT(RFC 7519) Payload
  payload: {
    iss: 'https://jihyunlab.com',
    iat: 0,
    exp: 0,
    jti: '',
  },
  // JLSM Key: JWK(RFC 7517) Key
  key: { keys: [] },

  // JLSM Encrypted Data: Protected by JLSE(JihyunLab Secure Encryption)

  // JLSM Signature: Protected by JLSS(JihyunLab Secure Signature)

  /*
  BASE64URL(UTF8(JLSM Header))
  || '.' || BASE64URL(UTF8(JLSM Payload))
  || '.' || BASE64URL(UTF8(JLSM Key))
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

    jlsm['header']['kid'] = randomUUID();

    // JLSM Header
    const jlsmHeader = Buffer.from(JSON.stringify(jlsm['header'])).toString('base64url');

    // JLSM Payload
    const current = Date.now();

    jlsm['payload']['iat'] = Math.floor(current / 1000);
    jlsm['payload']['exp'] = jlsm['payload']['iat'] + 3 * 60;
    jlsm['payload']['jti'] = randomUUID();

    const jlsmPayload = Buffer.from(JSON.stringify(jlsm['payload'])).toString('base64url');

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

    // JLSM Key
    let keyPair = Helper.keyPair.generate.p256();

    if (jlsm['header']['alg'] === 'ES256') {
      keyPair = Helper.keyPair.generate.p256();
    }

    const publicKey = keyPair.publicKey.export({ format: 'jwk' });
    publicKey['kid'] = jlsm['header']['kid'];
    publicKey['use'] = 'sig';

    jlsm['key']['keys'].push(publicKey);

    const jlsmKey = Buffer.from(JSON.stringify(jlsm['key'])).toString('base64url');

    // JLSM Encryption
    let buffer = Buffer.from(`${jlsmHeader}.${jlsmPayload}.${jlsmKey}`, 'ascii');
    let hashedBuffer = Hash.create(hash).update(buffer).buffer();

    const secret = Key.generate(
      Hash.create(hash)
        .update(Buffer.concat([hashedBuffer, hashedLoadedKey]))
        .buffer(),
      jlsm['payload']['jti'],
      hash
    );

    const jlsmEncryptedData = Crypto.encrypt.buffer(message, secret).toString('base64url');

    // JLSM Signature
    buffer = Buffer.from(`${jlsmHeader}.${jlsmPayload}.${jlsmKey}.${jlsmEncryptedData}`, 'ascii');
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
    const jlsmSignature = signer.sign(signatureTo).toString('base64url');

    return `${jlsmHeader}.${jlsmPayload}.${jlsmKey}.${jlsmEncryptedData}.${jlsmSignature}`;
  },

  decode: (message: string, key?: string | Buffer) => {
    if (message.length === 0) {
      throw new IllegalArgumentException('there is no message to decode.');
    }

    const token = message.split('.');

    if (token.length !== 5) {
      throw new IllegalArgumentException('the structure of the message is incorrect.');
    }

    const jlsmHeader = token[0];
    const jlsmPayload = token[1];
    const jlsmKey = token[2];
    const jlsmEncryptedData = token[3];
    const jlsmSignature = token[4];

    // JLSM Header
    const jsonHeader = JSON.parse(Buffer.from(jlsmHeader, 'base64url').toString());

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

    if (!jsonHeader['kid'] || jsonHeader['kid'].length === 0) {
      throw new NotFoundException('kid not found.');
    }

    // JLSM Payload
    const jsonPayload = JSON.parse(Buffer.from(jlsmPayload, 'base64url').toString());
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

    // JLSM Key
    const jsonKey = JSON.parse(Buffer.from(jlsmKey, 'base64url').toString());

    if (!jsonKey || !jsonKey['keys'] || jsonKey['keys'].length === 0) {
      throw new NotFoundException('key not found.');
    }

    if (jsonKey['keys'][0]['kid'] !== jsonHeader['kid']) {
      throw new NotFoundException('a key matching the kid could not be found.');
    }

    const publicKey = Helper.keyPair.generate.publicKey({ key: jsonKey['keys'][0], format: 'jwk' });

    // JLSM Signature
    let buffer = Buffer.from(`${jlsmHeader}.${jlsmPayload}.${jlsmKey}.${jlsmEncryptedData}`, 'ascii');
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
    const verified = verifier.verify(signatureTo, Buffer.from(jlsmSignature, 'base64url'));

    if (!verified) {
      throw new SignatureException('signature verification failed.');
    }

    // JLSM Decryption
    buffer = Buffer.from(`${jlsmHeader}.${jlsmPayload}.${jlsmKey}`, 'ascii');
    hashedBuffer = Hash.create(hash).update(buffer).buffer();

    const secret = Key.generate(
      Hash.create(hash)
        .update(Buffer.concat([hashedBuffer, hashedLoadedKey]))
        .buffer(),
      jsonPayload['jti'],
      hash
    );

    return Crypto.decrypt.buffer(Buffer.from(jlsmEncryptedData, 'base64url'), secret);
  },
};
