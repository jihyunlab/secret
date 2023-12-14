# @jihyunlab/secret

[![Version](https://img.shields.io/npm/v/@jihyunlab/secret.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/secret?activeTab=versions) [![Downloads](https://img.shields.io/npm/dt/@jihyunlab/secret.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/secret) [![Last commit](https://img.shields.io/github/last-commit/jihyunlab/secret.svg?style=flat-square)](https://github.com/jihyunlab/secret/graphs/commit-activity) [![License](https://img.shields.io/github/license/jihyunlab/secret.svg?style=flat-square)](https://github.com/jihyunlab/secret/blob/master/LICENSE)

@jihyunlab/secret provides text and file encryption functions that can be easily used without separate implementation.\
@jihyunlab/secret provides an encryption function using AES-256-GCM and securely manages the encryption key by using environment variables as the encryption key.
Additionally, you can install the command line interface tool [@jihyunlab/secret-cli](https://www.npmjs.com/package/@jihyunlab/secret-cli) library.

## Requirements

Node.js

## Setup

```bash
npm i @jihyunlab/secret
```

## Encryption key

If you register JIHYUNLAB_SECRET_KEY in a system or user environment variable, that environment variable will be used as the encryption key during encryption.

```bash
export JIHYUNLAB_SECRET_KEY=YourKey
```

## Text encryption

Text encryption encrypts the input text and returns an encrypted hex string.

```javascript
import { Text } from '@jihyunlab/secret';

const encrypted = Text.encrypt('string');
const decrypted = Text.decrypt(encrypted);
```

Instead of using an encryption key from an environment variable, you can input the key directly.

```javascript
const encrypted = Text.encrypt('string', 'your key');
const decrypted = Text.decrypt(encrypted, 'your key');
```

## File encryption

File encryption encrypts the input file and returns an encrypted buffer object.

```javascript
import { File } from '@jihyunlab/secret';

const encrypted = File.encrypt('file');
const decrypted = File.decrypt('file_enc');
```

File encryption and decryption results can be immediately exported to another file.

```javascript
const encrypted = File.encrypt('file', 'file_enc');
const decrypted = File.decrypt('file_enc', 'file_dec');
```

Instead of using an encryption key from an environment variable, you can input the key directly.

```javascript
const encrypted = File.encrypt('file', 'file_enc', 'your key');
const decrypted = File.decrypt('file_enc', 'file_dec', 'your key');
```

If you want to mix text and file encryption features, please see below.

```javascript
import { Text, File } from '@jihyunlab/secret';
import { writeFileSync } from 'fs';

const encrypted = Text.encrypt('string');
writeFileSync('file_enc', Buffer.from(encrypted, 'hex'));

const decrypted = File.decrypt('file_enc');
decrypted.toString('utf8');
```

## Encrypted .env

You can decrypt and use .env encrypted with [@jihyunlab/secret-cli](https://www.npmjs.com/package/@jihyunlab/secret-cli) in a simple way.

```.env
TEXT=d879f8dfb00b7f9d73bf755569726ed296332765988e28dda664350291f4ca382cff501e82
```

```javascript
import { Env } from '@jihyunlab/secret';
import { config } from 'dotenv';

Env.load(config());
console.log(process.env.TEXT);
```

If you use a library other than dotenv, you can still decrypt the contents of environment variables.

```javascript
const text = Text.decrypt(process.env.TEXT || '');
console.log(text);
```

## Credits

Authored and maintained by JihyunLab <<info@jihyunlab.com>>

## License

Open source [licensed as MIT](https://github.com/jihyunlab/secret/blob/master/LICENSE).
