# @jihyunlab/secret

[![Version](https://img.shields.io/npm/v/@jihyunlab/secret.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/secret?activeTab=versions) [![Downloads](https://img.shields.io/npm/dt/@jihyunlab/secret.svg?style=flat-square)](https://www.npmjs.com/org/jihyunlab) [![Last commit](https://img.shields.io/github/last-commit/jihyunlab/secret.svg?style=flat-square)](https://github.com/jihyunlab/secret/graphs/commit-activity) [![License](https://img.shields.io/github/license/jihyunlab/secret.svg?style=flat-square)](https://github.com/jihyunlab/secret/blob/master/LICENSE) [![Linter](https://img.shields.io/badge/linter-eslint-blue?style=flat-square)](https://eslint.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)\
[![Build](https://github.com/jihyunlab/secret/actions/workflows/build.yml/badge.svg)](https://github.com/jihyunlab/secret/actions/workflows/build.yml) [![Lint](https://github.com/jihyunlab/secret/actions/workflows/lint.yml/badge.svg)](https://github.com/jihyunlab/secret/actions/workflows/lint.yml) [![codecov](https://codecov.io/gh/jihyunlab/secret/graph/badge.svg?token=K2536J64LQ)](https://codecov.io/gh/jihyunlab/secret)

@jihyunlab/secret provides functionality in Node.js applications to decrypt .env files encrypted with [@jihyunlab/secret-cli](https://www.npmjs.com/package/@jihyunlab/secret-cli).

The encryption function is implemented with [@jihyunlab/crypto](https://www.npmjs.com/package/@jihyunlab/crypto) and provides encryption for AES 256 GCM.

## Installation

```bash
npm i @jihyunlab/secret
```

## Usage

Decrypt the .env key value by directly entering the separately managed encryption key.

```
import { CIPHER, Env } from '@jihyunlab/secret';

const cipher = await Env.createCipher(CIPHER.AES_256_GCM, 'YourSecretKey');
const value = await cipher.decrypt(process.env.ENV_KEY);
```

## Encryption key

If you register JIHYUNLAB_SECRET_KEY in system or user environment variables, it will be used as the encryption key during encryption.

```bash
export JIHYUNLAB_SECRET_KEY=YourSecretKey
```

You can decrypt the .env key value using the encryption key registered in the environment variables.

```
import { Env } from '@jihyunlab/secret';

const cipher = await Env.createCipher();
const value = await cipher.decrypt(process.env.ENV_KEY);
```

## Credits

Authored and maintained by JihyunLab <<info@jihyunlab.com>>

## License

Open source [licensed as MIT](https://github.com/jihyunlab/secret/blob/master/LICENSE).
