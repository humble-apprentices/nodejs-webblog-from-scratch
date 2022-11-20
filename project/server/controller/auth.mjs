import { join } from "node:path";
import { mReadFile, mWriteFile } from "../utils/file.mjs";
import { getPath } from "../utils/path.mjs";
import { generateUUID } from "../utils/uuid.mjs";

const { __dirname } = getPath(import.meta.url);

const USER_PATH = join(__dirname, "../../database", "user.json");
export function findUserByName(name) {
  //读取用户文件，校验用户密码是否正确
  const users = mReadFile(USER_PATH);
  const user = users.find(function (user) {
    return user.name === name;
  });
  return user;
}

export function registerUser(name, password) {
  const userId = generateUUID();
  const users = mReadFile(USER_PATH);
  const user = {
    userId,
    name,
    password,
  }
  users.push(user);
  mWriteFile(USER_PATH, users);
  return user
}

