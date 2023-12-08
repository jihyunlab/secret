#!/usr/bin/env node
import { Command } from 'commander';
import { Crypto } from '../src/index';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { isAbsolute, join, parse } from 'path';
import { setMaxListeners } from 'events';

setMaxListeners(36);

const program = new Command('secret')
  .description('JihyunLab secret cli')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(help):')
  .addHelpText('after', '  secret encrypt -h')
  .addHelpText('after', '  secret decrypt -h')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(text):')
  .addHelpText('after', '  secret encrypt -k key -t text')
  .addHelpText('after', '  secret decrypt -k key -t text')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(file):')
  .addHelpText('after', '  secret encrypt -k key -f file.txt')
  .addHelpText('after', '  secret decrypt -k key -f file.txt')
  .addHelpText('after', '  secret encrypt -f file.txt -o file_enc.txt -b')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(dir):')
  .addHelpText('after', '  secret encrypt -k key -d dir')
  .addHelpText('after', '  secret decrypt -k key -d dir')
  .addHelpText('after', '  secret encrypt -d dir -o dir_enc -b')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(.env):')
  .addHelpText('after', '  secret encrypt -k key -e -f .env')
  .addHelpText('after', '  secret encrypt -k key -e -d dir')
  .addHelpText('after', '  secret encrypt -e -d dir -o dir_enc -b')
  .version('1.0.0');

function parseOptions(json: Object): {
  key?: string;
  mode?: string;
  input?: string;
  out?: string;
  bak?: boolean;
  errorMessage?: string;
} {
  const options = JSON.parse(JSON.stringify(json));

  const key = options['key'];

  let mode = '';
  let input = '';
  let exclusiveOptionCount = 0;

  if (options['text']) {
    mode = 'text';
    input = options['text'];
    exclusiveOptionCount++;
  }

  if (options['env']) {
    mode = 'env';
    input = options['env'];
    exclusiveOptionCount++;
  }

  if (options['file']) {
    mode = 'file';
    input = options['file'];
    exclusiveOptionCount++;
  }

  if (options['dir']) {
    mode = 'dir';
    input = options['dir'];
    exclusiveOptionCount++;
  }

  if (exclusiveOptionCount !== 1) {
    return { errorMessage: 'must use only one of the -t, -e, -f, and -d options.' };
  }

  if (!input) {
    return { errorMessage: 'the object to be encrypted does not exist.' };
  }

  let out: string | undefined = undefined;

  if (options['out']) {
    out = options['out'];
  }

  let bak = false;

  if (options['bak']) {
    bak = true;
  }

  return { key: key, mode: mode, input: input, out: out, bak: bak };
}

function searchDirectory(directory: string): {
  directories?: string[];
  files?: string[];
  errorMessage?: string;
} {
  const directories: string[] = [];
  const files: string[] = [];

  readdirSync(directory, { withFileTypes: true }).forEach((file) => {
    const path = `${directory}/${file.name}`;

    if (file.isDirectory()) {
      directories.push(path);
      const result = searchDirectory(path);

      if (result.directories) {
        directories.push(...result.directories);
      }

      if (result.files) {
        files.push(...result.files);
      }
    } else {
      files.push(path);
    }
  });

  return { directories: directories, files: files };
}

program
  .command('encrypt')
  .alias('e')
  .argument('<target>', 'Text, file, or directory.')
  .option(
    '-k, --key <key>',
    'Encryption key.\nIf this option is not present, the value of the system environment variable JIHYUNLAB_SECRET_KEY is used.'
  )
  .option('-t, --text', 'Encrypt text.')
  .option('-f, --file', 'Encrypt file.')
  .option('-d, --dir', 'Encrypt directory.')
  .option(
    '-e, --env',
    'Encrypts only files whose file names begin with .env.\nEncrypts only the values of environment variables defined in the .env file.\nWhen used with the --dir option, only the .env files in the directory are encrypted and no other files are encrypted.'
  )
  .option(
    '-o, --out <file or dir>',
    'Set the output location for encrypted files or directories.\nIf this option is not present, the original file or directory will be overwritten with the encrypted file.\nWhether the output destination is a file or a directory is determined by the --file, and --dir options.'
  )
  .option(
    '-b, --bak',
    'Create a backup file for the original file and proceed with encryption.\nThe backup file has the extension .bak.'
  )
  .action((json: Object) => {
    const options = parseOptions(json);

    if (options.errorMessage) {
      console.log(options.errorMessage);
      return;
    }

    if (!options['mode'] || !options['input']) {
      return;
    }

    let out: string | undefined;

    if (options['out']) {
      if (isAbsolute(options['out'])) {
        out = options['out'];
      } else {
        out = join(process.cwd(), options['out']);
      }

      mkdirSync(parse(out).dir, { recursive: true });
    }

    if (options['mode'] === 'text') {
      const encrypted = Crypto.encrypt.string(options['input'], options['key'], undefined, undefined);

      if (out) {
        writeFileSync(out, encrypted);
      }

      if (options['bak']) {
        console.log('warning: the -b option cannot be used when encrypting text.');
      }

      console.log(`encrypted text: ${encrypted}`);
      return;
    } else if (options['mode'] === 'file') {
      let input;

      if (isAbsolute(options['input'])) {
        input = options['input'];
      } else {
        input = join(process.cwd(), options['input']);
      }

      const buffer = readFileSync(input);

      if (options['bak']) {
        writeFileSync(`${input}.bak`, buffer);
      }

      const encrypted = Crypto.encrypt.buffer(buffer, options['key']);

      if (out) {
        writeFileSync(out, encrypted);
      } else {
        writeFileSync(input, encrypted);
      }

      console.log(`encrypted file: ${input}`);
      return;
    } else if (options['mode'] === 'dir') {
      let input;

      if (isAbsolute(options['input'])) {
        input = options['input'];
      } else {
        input = join(process.cwd(), options['input']);
      }

      const result = searchDirectory(parse(input).dir);
      // console.log(JSON.stringify(result));
      console.log(process.cwd(), options['input'], input, parse(input).dir);
      return;
    }

    return;
  });

program
  .command('decrypt')
  .alias('d')
  .argument('<target>', 'Text, file, or directory.')
  .option(
    '-k, --key <key>',
    'Decryption key.\nIf this option is not present, the value of the system environment variable JIHYUNLAB_SECRET_KEY is used.'
  )
  .option('-t, --text', 'Decrypt text.')
  .option('-f, --file', 'Decrypt file.')
  .option('-d, --dir', 'Decrypt directory.')
  .option(
    '-e, --env',
    'Decrypts only files whose file names begin with .env.\nDecrypts only the values of environment variables defined in the .env file.\nWhen used with the --dir option, only the .env files in the directory are decrypted and no other files are decrypted.'
  )
  .option(
    '-o, --out <file or dir>',
    'Set the output location for decrypted files or directories.\nIf this option is not present, the original file or directory will be overwritten with the decrypted file.\nWhether the output destination is a file or a directory is determined by the --file, and --dir options.'
  )
  .option(
    '-b, --bak',
    'Create a backup file for the original file and proceed with decryption.\nThe backup file has the extension .bak.'
  )
  .action((json: Object) => {
    const options = parseOptions(json);

    if (options.errorMessage) {
      console.log(options.errorMessage);
      return;
    }

    if (!options['mode'] || !options['input']) {
      return;
    }

    let out: string | undefined;

    if (options['out']) {
      if (isAbsolute(options['out'])) {
        out = options['out'];
      } else {
        out = join(process.cwd(), options['out']);
      }

      mkdirSync(parse(out).dir, { recursive: true });
    }

    if (options['mode'] === 'text') {
      const decrypted = Crypto.decrypt.string(options['input'], options['key'], undefined, undefined);

      if (out) {
        writeFileSync(out, decrypted);
      }

      if (options['bak']) {
        console.log('warning: the -b option cannot be used when decrypting text.');
      }

      console.log(`decrypted text: ${decrypted}`);
      return;
    } else if (options['mode'] === 'file') {
      let input;

      if (isAbsolute(options['input'])) {
        input = options['input'];
      } else {
        input = join(process.cwd(), options['input']);
      }

      const buffer = readFileSync(input);

      if (options['bak']) {
        writeFileSync(`${input}.bak`, buffer);
      }

      const decrypted = Crypto.decrypt.buffer(buffer, options['key']);

      if (out) {
        writeFileSync(out, decrypted);
      } else {
        writeFileSync(input, decrypted);
      }

      console.log(`decrypted file: ${input}`);
      return;
    }

    return;
  });

program.parse();
