import * as fs from 'fs';
import * as path from 'path';

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

  isExist(location: string) {
    return fs.existsSync(location);
  },

  isDir(location: string) {
    if (!this.isExist(location)) {
      return undefined;
    }

    return fs.lstatSync(location).isDirectory();
  },

  toDir(location: string, file = false) {
    let dirname: string;

    if (file) {
      dirname = this.toAbsolute(path.dirname(location));
    } else {
      dirname = this.toAbsolute(location);
    }

    return path.normalize(dirname);
  },

  /*

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

  */
};
