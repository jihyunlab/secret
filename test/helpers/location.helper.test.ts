/**
 * @jest-environment node
 */
import { LocationHelper } from '../../src/helpers/location.helper';

describe('Location helper', () => {
  test(`Positive: isAbsolute()`, async () => {
    const isAbsolute = LocationHelper.isAbsolute(
      `${process.cwd()}/test/helpers/location.helper.test.ts`
    );

    expect(isAbsolute).toBe(true);
  });

  test(`Positive: isAbsolute()`, async () => {
    const isAbsolute = LocationHelper.isAbsolute(`./location.helper.test.ts`);

    expect(isAbsolute).toBe(false);
  });

  test(`Positive: toAbsolute()`, async () => {
    const location = LocationHelper.toAbsolute(
      `${process.cwd()}/test/helpers/location.helper.test.ts`
    );
    const isAbsolute = LocationHelper.isAbsolute(location);

    expect(isAbsolute).toBe(true);
  });

  test(`Positive: toAbsolute()`, async () => {
    const location = LocationHelper.toAbsolute(`./location.helper.test.ts`);
    const isAbsolute = LocationHelper.isAbsolute(location);

    expect(isAbsolute).toBe(true);
  });

  test(`Positive: toRelative()`, async () => {
    const location = LocationHelper.toRelative(
      `${process.cwd()}/test/helpers/location.helper.test.ts`
    );

    expect(location).not.toBe(
      `${process.cwd()}/test/helpers/location.helper.test.ts`
    );
  });

  test(`Positive: toBasename()`, async () => {
    const location = LocationHelper.toBasename(
      `${process.cwd()}/test/helpers/location.helper.test.ts`
    );

    expect(location).toBe('location.helper.test.ts');
  });

  test(`Positive: isExist()`, async () => {
    const isExist = LocationHelper.isExist(
      `${process.cwd()}/test/helpers/location.helper.test.ts`
    );

    expect(isExist).toBe(true);
  });

  test(`Positive: isDirectory() - directory`, async () => {
    const isDirectory = LocationHelper.isDirectory(
      `${process.cwd()}/test/helpers`
    );

    expect(isDirectory).toBe(true);
  });

  test(`Positive: isDirectory() - file`, async () => {
    const isDirectory = LocationHelper.isDirectory(
      `${process.cwd()}/test/helpers/location.helper.test.ts`
    );

    expect(isDirectory).toBe(false);
  });

  test(`Positive: isDirectory() - undefined`, async () => {
    const isDirectory = LocationHelper.isDirectory(
      `${process.cwd()}/test/helpers/undefined`
    );

    expect(isDirectory).toBe(false);
  });

  test(`Positive: toDirectory() - directory`, async () => {
    const location = LocationHelper.toDirectory(
      `${process.cwd()}/test/helpers`
    );
    const isDirectory = LocationHelper.isDirectory(location);

    expect(isDirectory).toBe(true);
  });

  test(`Positive: toDirectory() - file`, async () => {
    const location = LocationHelper.toDirectory(
      `${process.cwd()}/test/helpers/location.helper.test.ts`,
      true
    );
    const isDirectory = LocationHelper.isDirectory(location);

    expect(isDirectory).toBe(true);
  });
});
