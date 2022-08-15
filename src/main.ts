import glob, { IOptions } from "glob";
import { makeBasePath } from "./helper";

type Options = Pick<IOptions, "dot">;

type Args = Options & {
  /**
   * If not defined, will default to the cwd
   * @default process.cwd()
   */
  basePath?: string;
};

export function getAllFiles(args: Args = {}): Promise<string[]> {
  const { basePath, dot } = args;

  const path = basePath || process.cwd();
  const globPath = makeBasePath(path);

  return new Promise((resolve, rej) => {
    glob(globPath, { dot, nodir: true }, (_err, files) => {
      if (_err) {
        return rej(_err);
      }

      return resolve(files);
    });
  });
}

export function getAllFilesSync(args: Args = {}): string[] {
  const { basePath, dot } = args;
  const path = basePath || process.cwd();

  const globPath = makeBasePath(path);

  const files = glob.sync(globPath, { dot, nodir: true });

  return files;
}
