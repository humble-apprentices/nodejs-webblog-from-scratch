
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// mjs写法里无法获取__dirname, __filename
export const getPath = (url) => {
  const __filename = fileURLToPath(url);
  const __dirname = dirname(__filename);
  return {
    __dirname,
    __filename,
  };
};
