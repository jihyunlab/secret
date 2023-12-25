import { Location } from '../../src/helpers/location.helper';
import { join } from 'path';
import { mkdirSync, rmSync, writeFileSync } from 'fs';

describe('Location', () => {
  const base = 'test-location';

  const textString = 'Welcome to JihyunLab.';

  const dir = join(base, 'dir');
  const subDir = join(base, 'dir/sub-dir');
  const subSubDir = join(base, 'dir/sub-dir/sub-sub-dir');

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
    const location = Location.toRelative(dir);
    expect(location).toBe(dir);
  });

  test('isDirectory(): dir', () => {
    const isDirectory = Location.isDirectory(dir);
    expect(isDirectory).toBe(true);
  });

  test('isDirectory(): file', () => {
    const isDirectory = Location.isDirectory(file);
    expect(isDirectory).toBe(false);
  });

  test('isDirectory(): not exist', () => {
    const isDirectory = Location.isDirectory('temp');
    expect(isDirectory).toBe(undefined);
  });

  test('toDirectory(): dir', () => {
    const directory = Location.toDirectory(dir);
    expect(directory).toBe(Location.toAbsolute(dir));
  });

  test('toDirectory(): file', () => {
    const directory = Location.toDirectory(file, true);
    expect(directory).toBe(Location.toAbsolute(dir));
  });

  test('searchDirectory()', () => {
    const result = Location.searchDirectory(dir);

    expect(result.dirs).toStrictEqual([Location.toAbsolute(subDir), Location.toAbsolute(subSubDir)]);
    expect(result.files).toStrictEqual([
      Location.toAbsolute(file),
      Location.toAbsolute(subSubDirFile),
      Location.toAbsolute(subDirFile),
    ]);
    expect(result.ignores).toStrictEqual([]);
  });

  test('searchDirectory(): ignore sub dir', () => {
    const result = Location.searchDirectory(dir, Location.toBasename(subDir));

    expect(result.dirs).toStrictEqual([]);
    expect(result.files).toStrictEqual([Location.toAbsolute(file)]);
    expect(result.ignores).toStrictEqual([
      Location.toAbsolute(subDir),
      Location.toAbsolute(subSubDir),
      Location.toAbsolute(subSubDirFile),
      Location.toAbsolute(subDirFile),
    ]);
  });

  test('searchDirectory(): ignore sub dir file', () => {
    const result = Location.searchDirectory(dir, Location.toBasename(subDirFile));

    expect(result.dirs).toStrictEqual([Location.toAbsolute(subDir), Location.toAbsolute(subSubDir)]);
    expect(result.files).toStrictEqual([Location.toAbsolute(file), Location.toAbsolute(subSubDirFile)]);
    expect(result.ignores).toStrictEqual([Location.toAbsolute(subDirFile)]);
  });

  test('searchDirectory(): ignore sub sub dir', () => {
    const result = Location.searchDirectory(dir, Location.toBasename(subSubDir));

    expect(result.dirs).toStrictEqual([Location.toAbsolute(subDir)]);
    expect(result.files).toStrictEqual([Location.toAbsolute(file), Location.toAbsolute(subDirFile)]);
    expect(result.ignores).toStrictEqual([Location.toAbsolute(subSubDir), Location.toAbsolute(subSubDirFile)]);
  });

  test('searchDirectory(): ignore sub sub dir file', () => {
    const result = Location.searchDirectory(dir, Location.toBasename(subSubDirFile));

    expect(result.dirs).toStrictEqual([Location.toAbsolute(subDir), Location.toAbsolute(subSubDir)]);
    expect(result.files).toStrictEqual([Location.toAbsolute(file), Location.toAbsolute(subDirFile)]);
    expect(result.ignores).toStrictEqual([Location.toAbsolute(subSubDirFile)]);
  });
});
