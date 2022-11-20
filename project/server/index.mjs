// import Koa from 'koa';
import { join } from "node:path";
import Koa from '../../my-koa/application.mjs';
import { auth } from './middleware/auth.mjs';
import { logger } from "./middleware/logger.mjs";
import { staticServer } from './middleware/static.mjs';
import router from "./router/index.mjs";
import { getPath } from "./utils/path.mjs";

const { __dirname } = getPath(import.meta.url);

const app = new Koa();
app.use(logger)
app.use(staticServer(join(__dirname, '../www/')));
app.use(auth);

app.use(router.routes());

app.listen(3000, "0.0.0.0", () => {
  console.log("App running at:");
  console.log("Local:   http://localhost:3000");
})