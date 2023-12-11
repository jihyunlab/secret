#!/usr/bin/env node
import { Command } from 'commander';
import { Text } from './cryptos/text.crypto';
import { File } from './cryptos/file.crypto';
import { Directory } from './cryptos/directory.crypto';
import { Env } from './cryptos/env.crypto';
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
  .addHelpText('after', '  secret encrypt -k key -e .env')
  .addHelpText('after', '  secret encrypt -k key -e dir')
  .addHelpText('after', '  secret encrypt -e dir -o dir_enc -b')
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
  let exclusiveOptionCount = 0;

  if (options['text']) {
    mode = 'text';
    exclusiveOptionCount++;
  }

  if (options['file']) {
    mode = 'file';
    exclusiveOptionCount++;
  }

  if (options['dir']) {
    mode = 'dir';
    exclusiveOptionCount++;
  }

  if (options['env']) {
    mode = 'env';
    exclusiveOptionCount++;
  }

  if (exclusiveOptionCount !== 1) {
    return { errorMessage: 'must use only one of the -t, -f, -d and -e options.' };
  }

  let out: string | undefined = undefined;

  if (options['out']) {
    out = options['out'];
  }

  let bak = false;

  if (options['bak']) {
    bak = true;
  }

  return { key: key, mode: mode, out: out, bak: bak };
}

program
  .command('encrypt')
  .alias('e')
  .argument('<target>', 'text, file, or directory.')
  .option(
    '-k, --key <key>',
    'encryption key.\nif this option is not present, the value of the system environment variable JIHYUNLAB_SECRET_KEY is used.'
  )
  .option('-t, --text', 'encrypt text.')
  .option('-f, --file', 'encrypt file.')
  .option('-d, --dir', 'encrypt directory.')
  .option(
    '-e, --env',
    'encrypts the .env file or .env files within a directory.\ndoes not encrypt entire files. only the values of environment variables defined in the .env file are encrypted.\nwhen you encrypt a directory, only the .env files in that directory are encrypted. no other files are encrypted.'
  )
  .option(
    '-o, --out <file or dir>',
    'set the output location for encrypted files or directories.\nif this option is not present, the original file or directory will be overwritten with the encrypted file.\nwhether the output destination is a file or a directory is determined by the --file, and --dir options.'
  )
  .option(
    '-b, --bak',
    'create a backup file for the original file and proceed with encryption.\nthe backup file has the extension .bak.'
  )
  .action((arg: string, json: Object) => {
    const target = arg;

    if (!target) {
      console.log('the target to be encrypted does not exist.');
      return;
    }

    const options = parseOptions(json);

    if (options.errorMessage) {
      console.log(options.errorMessage);
      return;
    }

    if (!options['mode']) {
      return;
    }

    if (options['mode'] === 'text') {
      if (options['out']) {
        console.log('warning: the -o option cannot be used when encrypting text.');
      }

      if (options['bak']) {
        console.log('warning: the -b option cannot be used when encrypting text.');
      }

      Text.encrypt(target, options['key']);
      return;
    } else if (options['mode'] === 'file') {
      File.encrypt(target, options['out'], options['bak'], options['key']);
      return;
    } else if (options['mode'] === 'dir') {
      Directory.encrypt(target, options['out'], options['bak'], options['key']);
      return;
    } else if (options['mode'] === 'env') {
      Env.encrypt(target, options['out'], options['bak'], options['key']);
      return;
    }

    return;
  });

program
  .command('decrypt')
  .alias('d')
  .argument('<target>', 'text, file, or directory.')
  .option(
    '-k, --key <key>',
    'decryption key.\nif this option is not present, the value of the system environment variable JIHYUNLAB_SECRET_KEY is used.'
  )
  .option('-t, --text', 'decrypt text.')
  .option('-f, --file', 'decrypt file.')
  .option('-d, --dir', 'decrypt directory.')
  .option(
    '-e, --env',
    'decrypts the .env file or .env files within a directory.\ndoes not decrypt entire files. only the values of environment variables defined in the .env file are decrypted.\nwhen you decrypt a directory, only the .env files in that directory are decrypted. no other files are decrypted.'
  )
  .option(
    '-o, --out <file or dir>',
    'set the output location for decrypted files or directories.\nif this option is not present, the original file or directory will be overwritten with the decrypted file.\nwhether the output destination is a file or a directory is determined by the --file, and --dir options.'
  )
  .option(
    '-b, --bak',
    'create a backup file for the original file and proceed with decryption.\nthe backup file has the extension .bak.'
  )
  .action((arg: string, json: Object) => {
    const target = arg;

    if (!target) {
      console.log('the target to be decrypted does not exist.');
      return;
    }

    const options = parseOptions(json);

    if (options.errorMessage) {
      console.log(options.errorMessage);
      return;
    }

    if (!options['mode']) {
      return;
    }

    if (options['mode'] === 'text') {
      if (options['out']) {
        console.log('warning: the -o option cannot be used when decrypting text.');
      }

      if (options['bak']) {
        console.log('warning: the -b option cannot be used when decrypting text.');
      }

      Text.decrypt(target, options['key']);
      return;
    } else if (options['mode'] === 'file') {
      File.decrypt(target, options['out'], options['bak'], options['key']);
      return;
    } else if (options['mode'] === 'dir') {
      Directory.decrypt(target, options['out'], options['bak'], options['key']);
      return;
    } else if (options['mode'] === 'env') {
      Env.decrypt(target, options['out'], options['bak'], options['key']);
      return;
    }
  });

program.parse();
