import { Key } from '../../src/helpers/key.helper';

describe('Key', () => {
  test('load(): exception(not found)', () => {
    const key = process.env.JIHYUNLAB_SECRET_KEY;

    expect(() => {
      process.env.JIHYUNLAB_SECRET_KEY = '';
      Key.generate();
    }).toThrow(Error);

    process.env.JIHYUNLAB_SECRET_KEY = key;
  });
});
