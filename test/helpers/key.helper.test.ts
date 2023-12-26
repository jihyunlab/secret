import { Key } from '../../src/helpers/key.helper';

describe('Key', () => {
  const processEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: '',
    };
  });

  afterEach(() => {
    process.env = processEnv;
  });

  test('load(): exception(not found)', () => {
    expect(() => {
      Key.generate();
    }).toThrow(Error);
  });
});
