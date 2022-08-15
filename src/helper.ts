import { sep } from "node:path";

type Seperator = "/" | "\\";

export function makeBasePath(
  filepath: string,
  seperator: Seperator = sep as Seperator
) {
  if (seperator !== "/" && seperator !== "\\") {
    throw new Error("Not a valid terminal seperator");
  }
  if (filepath.at(-1) === seperator) {
    return filepath + "**";
  }

  return filepath + seperator + "**";
}
