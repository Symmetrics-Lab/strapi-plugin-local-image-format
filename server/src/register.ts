import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import Router from "@koa/router";
import { Core } from "@strapi/strapi";
import { createIPX, ipxFSStorage } from "ipx";
import { PluginConfig } from "./config/schema";
import { createMiddleware } from "./middleware";

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  const config = strapi.config.get("plugin::local-image-sharp") as PluginConfig;
  const srcDir = strapi.dirs?.static?.public;

  strapi.log.info(`Using Local Image Sharp plugin`);
  strapi.log.info(`- Source directory: ${srcDir}`);
  if (config.cacheDir) {
    const currentDirectory = cwd();
    config.cacheDir = resolve(currentDirectory, config.cacheDir);
    if (config.cacheDir.startsWith(srcDir)) {
      throw new Error("Cache directory cannot be inside source directory");
    }
    // check if directory exists
    if (!existsSync(config.cacheDir)) {
      mkdirSync(config.cacheDir, { recursive: true });
    }
    strapi.log.info(`- Cache directory: ${config.cacheDir}`);
  }

  const router = new Router();
  config.paths.forEach((path) => {
    const ipx = createIPX({
      storage: ipxFSStorage({ dir: srcDir + path }),
    });

    router.get(`${path}/(.*)`, createMiddleware(ipx, strapi));
  });

  strapi.server.use(router.routes() as any); // TODO: fix types
};

export default register;
