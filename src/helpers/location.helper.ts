import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

export const Location = {
  isAbsolute(location: string) {
    return path.isAbsolute(location);
  },

  toAbsolute(location: string) {
    let absolute: string;

    if (this.isAbsolute(location)) {
      absolute = location;
    } else {
      absolute = path.join(process.cwd(), location);
    }

    return path.normalize(absolute);
  },

  toRelative(location: string) {
    const absolute = this.toAbsolute(location);
    const relative = path.relative(process.cwd(), absolute);

    return path.normalize(relative);
  },

  isExist(location: string) {
    return fs.existsSync(location);
  },

  isDirectory(location: string) {
    if (!this.isExist(location)) {
      return undefined;
    }

    return fs.lstatSync(location).isDirectory();
  },

  toDirectory(location: string, file = false) {
    let dirname: string;

    if (file) {
      dirname = this.toAbsolute(path.dirname(location));
    } else {
      dirname = this.toAbsolute(location);
    }

    return path.normalize(dirname);
  },

  searchDirectory(location: string, ignores?: string): { dirs: string[]; files: string[]; ignores: string[] } {
    const dirs: string[] = [];
    const files: string[] = [];
    const igs: string[] = [];

    const ig = ignore();

    if (ignores) {
      ig.add(ignores);
    }

    const locationDirectory = this.toAbsolute(location);

    fs.readdirSync(locationDirectory, { withFileTypes: true }).forEach((file) => {
      const locationFile = path.join(locationDirectory, file.name);

      if (file.isDirectory()) {
        if (!ig.ignores(this.toRelative(locationFile))) {
          dirs.push(locationFile);
        } else {
          igs.push(locationFile);
        }

        const result = this.searchDirectory(locationFile);

        if (result.dirs) {
          for (let i = 0; i < result.dirs.length; i++) {
            const dir = result.dirs[i];

            if (!ig.ignores(this.toRelative(dir))) {
              dirs.push(dir);
            } else {
              igs.push(dir);
            }
          }
        }

        if (result.files) {
          for (let i = 0; i < result.files.length; i++) {
            const file = result.files[i];

            if (!ig.ignores(this.toRelative(file))) {
              files.push(file);
            } else {
              igs.push(file);
            }
          }
        }

        if (result.ignores) {
          igs.push(...result.ignores);
        }
      } else {
        if (!ig.ignores(this.toRelative(locationFile))) {
          files.push(locationFile);
        } else {
          igs.push(locationFile);
        }
      }
    });

    return { dirs: dirs, files: files, ignores: igs };
  },
};
