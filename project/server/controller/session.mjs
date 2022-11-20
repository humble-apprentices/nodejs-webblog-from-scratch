import { join } from "node:path";
import { mReadFile, mWriteFile } from "../utils/file.mjs";
import { getPath } from "../utils/path.mjs";

const { __dirname } = getPath(import.meta.url);

const SESSION_PATH = join(__dirname, "../../database", "session.json");

/**
 * 创建session
 * @param {*} param
 * @returns
 */
export function createSession(userId) {
  const session = {
    userId: userId,
    expiredTime: Date.now() + 60 * 60 * 24 * 1000,
  };
  const sessions = mReadFile(SESSION_PATH);
  sessions.push(session);
  const nowTime = Date.now();
  mWriteFile(SESSION_PATH, sessions.filter(item => item.expiredTime >= nowTime));
  return session;
}

/**
 * session是否有效
 * @param {*} param
 * @returns
 */
export function sessionIsEfective({ userId }) {
  const sessions = mReadFile(SESSION_PATH);
  const session = sessions.find((item) => {
    return item.userId === userId
  });
  if (!session) return false;
  return session.expiredTime >= Date.now();
}
