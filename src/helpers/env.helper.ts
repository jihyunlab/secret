import { DotenvParseOutput, parse } from 'dotenv';
import { LocationHelper } from './location.helper';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

export const EnvHelper = {
  async read(path: string) {
    const location = LocationHelper.toAbsolute(path);

    if (!LocationHelper.isExist(location)) {
      throw new Error('file does not exist.');
    }

    if (LocationHelper.isDirectory(location)) {
      throw new Error('the input path is a directory.');
    }

    return parse(readFileSync(path));
  },

  async write(path: string, env: DotenvParseOutput) {
    const location = LocationHelper.toAbsolute(path);

    if (LocationHelper.isDirectory(location)) {
      throw new Error('the input path is a directory.');
    }

    let text = '';
    const keys = Object.keys(env);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = env[key];

      text = text + `${key}=${value}\n`;
    }

    mkdirSync(LocationHelper.toDirectory(location, true), { recursive: true });
    writeFileSync(location, text);
  },
};
