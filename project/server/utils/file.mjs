import { readFileSync, writeFileSync } from "node:fs";

export const mReadFile = (path) => {
  return JSON.parse(readFileSync(path).toString());
}

export const mWriteFile = (path, content) => {
  writeFileSync(path, JSON.stringify(content));
}