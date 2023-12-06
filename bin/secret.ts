#!/usr/bin/env node
import { Command } from 'commander';
import { Crypto } from '../src/index';
import { mkdirSync, writeFileSync } from 'fs';
import { isAbsolute, join, parse } from 'path';
import { setMaxListeners } from 'events';

setMaxListeners(36);

const program = new Command('secret')
  .description('JihyunLab secret cli')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(help):')
  .addHelpText('after', '  secret help encrypt')
  .addHelpText('after', '  secret help decrypt')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(text):')
  .addHelpText('after', '  secret encrypt -k key -t text')
  .addHelpText('after', '  secret decrypt -k key -t text')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(.env):')
  .addHelpText('after', '  secret encrypt -k key -e .env')
  .addHelpText('after', '  secret decrypt -k key -e .env')
  .addHelpText('after', '  secret encrypt -k key -e .env -o .env_enc -b')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(file):')
  .addHelpText('after', '  secret encrypt -k key -f text.txt')
  .addHelpText('after', '  secret decrypt -k key -f text.txt')
  .addHelpText('after', '  secret encrypt -k key -f text.txt -o text_enc.txt -b')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage examples(dir):')
  .addHelpText('after', '  secret encrypt -k key -d dir')
  .addHelpText('after', '  secret decrypt -k key -d dir')
  .addHelpText('after', '  secret encrypt -k key -d dir -o dir_enc -b')
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

program
  .command('encrypt')
  .option(
    '-k, --key <key>',
    'encryption key.\nif this option is not present, the value of the system environment variable JIHYUNLAB_SECRET_KEY is used'
  )
  .option('-t, --text <string>', 'text to encrypt')
  .option('-e, --env <file>', 'location to the .env file to encrypt')
  .option('-f, --file <file>', 'location of files to encrypt')
  .option('-d, --dir <dir>', 'directory location to encrypt')
  .option(
    '-o, --out <file or dir>',
    'encrypted output file or directory location.\nwhether the output destination is a file or a directory is determined by the --env, --file, and --dir options.\nif this option is not present, the original file or directory will be overwritten with the encrypted file'
  )
  .option(
    '-b, --bak',
    'create a backup file for the original file and proceed with encryption.\nthe backup file has the extension .bak'
  )
  .action((json) => {
    const options = parseOptions(json);

    if (options.errorMessage) {
      console.log(options.errorMessage);
      return;
    }

    if (!options['key'] || !options['mode'] || !options['input']) {
      return;
    }

    let out: string | undefined;

    if (options['out']) {
      if (isAbsolute(options['out'])) {
        out = options['out'];
      } else {
        out = join(process.cwd(), options['out']);
      }

      mkdirSync(parse(parse(out).dir).base, { recursive: true });
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
    }

    return;
  });

program
  .command('decrypt')
  .option(
    '-k, --key <key>',
    'decryption key.\nif this option is not present, the value of the system environment variable JIHYUNLAB_SECRET_KEY is used'
  )
  .option('-t, --text <string>', 'text to decrypt')
  .option('-e, --env <file>', 'location to the .env file to decrypt')
  .option('-f, --file <file>', 'location of files to decrypt')
  .option('-d, --dir <dir>', 'directory location to decrypt')
  .option(
    '-o, --out <file or dir>',
    'decrypted output file or directory location.\nwhether the output destination is a file or a directory is determined by the --env, --file, and --dir options.\nif this option is not present, the original file or directory will be overwritten with the decrypted file'
  )
  .option(
    '-b, --bak',
    'create a backup file for the original file and proceed with decryption.\nthe backup file has the extension .bak'
  )
  .action((json) => {
    const options = parseOptions(json);

    if (options.errorMessage) {
      console.log(options.errorMessage);
      return;
    }

    if (!options['key'] || !options['mode'] || !options['input']) {
      return;
    }

    let out: string | undefined;

    if (options['out']) {
      if (isAbsolute(options['out'])) {
        out = options['out'];
      } else {
        out = join(process.cwd(), options['out']);
      }

      mkdirSync(parse(parse(out).dir).base, { recursive: true });
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
    }

    return;
  });

program.parse();
