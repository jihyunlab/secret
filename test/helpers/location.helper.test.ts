import { LocationHelper } from '../../src/index';
import { join } from 'path';
import { mkdirSync, rmSync, writeFileSync } from 'fs';

describe('Location', () => {
  const base = 'test-location';

  const textString = 'Welcome to JihyunLab.';

  const dir = join(base, 'dir');
  const subDir = join(dir, 'sub-dir');
  const subSubDir = join(subDir, 'sub-sub-dir');

  const file = join(dir, 'file.txt');
  const subDirFile = join(subDir, 'sub_dir_file.txt');
  const subSubDirFile = join(subSubDir, 'sub_sub_dir_file.txt');

  beforeAll(() => {
    mkdirSync(base, { recursive: true });
    mkdirSync(dir, { recursive: true });
    mkdirSync(subDir, { recursive: true });
    mkdirSync(subSubDir, { recursive: true });

    writeFileSync(file, textString);
    writeFileSync(subDirFile, textString);
    writeFileSync(subSubDirFile, textString);
  });

  afterAll(() => {
    rmSync(subSubDir, { recursive: true, force: true });
    rmSync(subDir, { recursive: true, force: true });
    rmSync(dir, { recursive: true, force: true });
    rmSync(base, { recursive: true, force: true });
  });

  test('toRelative()', () => {
    const location = LocationHelper.toRelative(dir);
    expect(location).toBe(dir);
  });

  test('isDirectory(): dir', () => {
    const isDirectory = LocationHelper.isDirectory(dir);
    expect(isDirectory).toBe(true);
  });

  test('isDirectory(): file', () => {
    const isDirectory = LocationHelper.isDirectory(file);
    expect(isDirectory).toBe(false);
  });

  test('isDirectory(): not exist', () => {
    const isDirectory = LocationHelper.isDirectory('temp');
    expect(isDirectory).toBe(undefined);
  });

  test('toDirectory(): dir', () => {
    const directory = LocationHelper.toDirectory(dir);
    expect(directory).toBe(LocationHelper.toAbsolute(dir));
  });

  test('toDirectory(): file', () => {
    const directory = LocationHelper.toDirectory(file, true);
    expect(directory).toBe(LocationHelper.toAbsolute(dir));
  });

  test('searchDirectory()', () => {
    const result = LocationHelper.searchDirectory(dir);

    expect(result.dirs).toEqual(
      expect.arrayContaining([LocationHelper.toAbsolute(subDir), LocationHelper.toAbsolute(subSubDir)])
    );
    expect(result.files).toEqual(
      expect.arrayContaining([
        LocationHelper.toAbsolute(file),
        LocationHelper.toAbsolute(subSubDirFile),
        LocationHelper.toAbsolute(subDirFile),
      ])
    );
    expect(result.ignores).toEqual(expect.arrayContaining([]));
  });

  test('searchDirectory(): ignore dir', () => {
    const result = LocationHelper.searchDirectory(dir, LocationHelper.toBasename(dir));

    expect(result.dirs).toEqual(expect.arrayContaining([]));
    expect(result.files).toEqual(expect.arrayContaining([]));
    expect(result.ignores).toEqual(
      expect.arrayContaining([
        LocationHelper.toAbsolute(file),
        LocationHelper.toAbsolute(subDir),
        LocationHelper.toAbsolute(subSubDir),
        LocationHelper.toAbsolute(subSubDirFile),
        LocationHelper.toAbsolute(subDirFile),
      ])
    );
  });

  test('searchDirectory(): ignore file', () => {
    const result = LocationHelper.searchDirectory(dir, LocationHelper.toBasename(file));

    expect(result.dirs).toEqual(
      expect.arrayContaining([LocationHelper.toAbsolute(subDir), LocationHelper.toAbsolute(subSubDir)])
    );
    expect(result.files).toEqual(
      expect.arrayContaining([LocationHelper.toAbsolute(subSubDirFile), LocationHelper.toAbsolute(subDirFile)])
    );
    expect(result.ignores).toEqual(expect.arrayContaining([LocationHelper.toAbsolute(file)]));
  });

  test('searchDirectory(): ignore sub dir', () => {
    const result = LocationHelper.searchDirectory(dir, LocationHelper.toBasename(subDir));

    expect(result.dirs).toEqual(expect.arrayContaining([]));
    expect(result.files).toEqual(expect.arrayContaining([LocationHelper.toAbsolute(file)]));
    expect(result.ignores).toEqual(
      expect.arrayContaining([
        LocationHelper.toAbsolute(subDir),
        LocationHelper.toAbsolute(subSubDir),
        LocationHelper.toAbsolute(subSubDirFile),
        LocationHelper.toAbsolute(subDirFile),
      ])
    );
  });

  test('searchDirectory(): ignore sub dir file', () => {
    const result = LocationHelper.searchDirectory(dir, LocationHelper.toBasename(subDirFile));

    expect(result.dirs).toEqual(
      expect.arrayContaining([LocationHelper.toAbsolute(subDir), LocationHelper.toAbsolute(subSubDir)])
    );
    expect(result.files).toEqual(
      expect.arrayContaining([LocationHelper.toAbsolute(file), LocationHelper.toAbsolute(subSubDirFile)])
    );
    expect(result.ignores).toEqual(expect.arrayContaining([LocationHelper.toAbsolute(subDirFile)]));
  });

  test('searchDirectory(): ignore sub sub dir', () => {
    const result = LocationHelper.searchDirectory(dir, LocationHelper.toBasename(subSubDir));

    expect(result.dirs).toEqual(expect.arrayContaining([LocationHelper.toAbsolute(subDir)]));
    expect(result.files).toEqual(
      expect.arrayContaining([LocationHelper.toAbsolute(file), LocationHelper.toAbsolute(subDirFile)])
    );
    expect(result.ignores).toEqual(
      expect.arrayContaining([LocationHelper.toAbsolute(subSubDir), LocationHelper.toAbsolute(subSubDirFile)])
    );
  });

  test('searchDirectory(): ignore sub sub dir file', () => {
    const result = LocationHelper.searchDirectory(dir, LocationHelper.toBasename(subSubDirFile));

    expect(result.dirs).toEqual(
      expect.arrayContaining([LocationHelper.toAbsolute(subDir), LocationHelper.toAbsolute(subSubDir)])
    );
    expect(result.files).toEqual(
      expect.arrayContaining([LocationHelper.toAbsolute(file), LocationHelper.toAbsolute(subDirFile)])
    );
    expect(result.ignores).toEqual(expect.arrayContaining([LocationHelper.toAbsolute(subSubDirFile)]));
  });
});
