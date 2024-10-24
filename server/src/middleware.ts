import { createReadStream, existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Core } from "@strapi/strapi";
import getEtag from "etag";
import { IPX } from "ipx";
import { Context, Next } from "koa";
import { hash } from "ohash";
import qs from "qs";
import { decode } from "ufo";
import { PluginConfig } from "./config/schema";

function createMiddleware(ipx: IPX, strapi: Core.Strapi) {
  const config: PluginConfig = strapi.config.get("plugin::local-image-sharp");

  return async function ipxMiddleware(ctx: Context, next: Next) {
    let path: string = "";
    config.paths.forEach((target) => {
      if (ctx.req?.url?.includes(target)) {
        path = ctx.req.url.split(target).join("");
      }
    });

    if (!path) {
      const statusCode = 500;
      const statusMessage = "No path found";
      strapi.log.debug(statusMessage);
      ctx.status = statusCode;
      return;
    }

    const [url, query] = path.split("?");
    const [firstSegment = "", ...idSegments] = url
      .substr(1 /* leading slash */)
      .split("/");
    const allowedTypes = [
      "JPEG",
      "PNG",
      "GIF",
      "SVG",
      "TIFF",
      "ICO",
      "DVU",
      "JPG",
      "WEBP",
      "AVIF",
    ];
    let id: string;
    let modifiers: Record<string, any>;

    let tempFilePath: string | undefined;
    let tempTypePath: string | undefined;
    let tempEtagPath: string | undefined;

    // extract modifiers from query string
    if (!idSegments.length && firstSegment) {
      id = firstSegment;
      modifiers = qs.parse(query);
    } else {
      // extract modifiers from url segments
      id = decode(idSegments.join("/")); // decode is a shortend version of decodeURIComponent
      modifiers = Object.create(null);
      if (firstSegment !== "_") {
        for (const p of firstSegment.split(",")) {
          const [key, value = ""] = p.split("_");
          modifiers[key] = decode(value);
        }
      }
    }

    // if no id or no modifiers or not allowed type, skip
    if (
      !id ||
      !Object.keys(modifiers).length ||
      !allowedTypes.includes(id.split(".").pop()?.toUpperCase() || "")
    ) {
      await next();
      return;
    }

    const objectHash = hash({ id, modifiers });

    // If cache enabled, check if file exists
    if (config.cacheDir) {
      tempFilePath = join(config.cacheDir, `${objectHash}.raw`);
      tempTypePath = join(config.cacheDir, `${objectHash}.mime`);
      tempEtagPath = join(config.cacheDir, `${objectHash}.etag`);

      if (existsSync(tempFilePath)) {
        try {
          const [type, etag] = await Promise.all([
            readFile(tempTypePath, "utf-8"),
            readFile(tempEtagPath, "utf-8"),
          ]);
          const stream = createReadStream(tempFilePath);

          ctx.set("ETag", etag);
          if (etag && ctx.req.headers["if-none-match"] === etag) {
            ctx.status = 304;
            return;
          }

          // Cache-Control
          if (config.maxAge) {
            ctx.set(
              "Cache-Control",
              `max-age=${+config.maxAge}, public, s-maxage=${+config.maxAge}`
            );
          }

          // Mime
          if (type) {
            ctx.set("Content-Type", type);
          }
          ctx.body = stream;
          return;
        } catch {
          // file not found, continue to generate fresh image
        }
      }
    }

    // Create request
    const img = ipx(id, modifiers);
    // Get image meta from source
    try {
      const src = await img.getSourceMeta();

      // Caching headers
      if (src.mtime) {
        if (ctx.req.headers["if-modified-since"]) {
          if (new Date(ctx.req.headers["if-modified-since"]) >= src.mtime) {
            ctx.status = 304;
            return;
          }
        }
        ctx.set("Last-Modified", `${+src.mtime}`);
      }

      const maxAge = src.maxAge ?? config.maxAge;

      if (maxAge) {
        ctx.set(
          "Cache-Control",
          `max-age=${+maxAge}, public, s-maxage=${+maxAge}`
        );
      }

      // Get converted image
      const { data, format } = await img.process();

      // ETag
      const etag = getEtag(data);

      // If cache enabled, write image to temp dir
      if (tempTypePath && tempFilePath && tempEtagPath) {
        Promise.all([
          writeFile(tempTypePath, `image/${format}`, "utf-8"),
          writeFile(tempEtagPath, etag, "utf-8"),
          writeFile(tempFilePath, data),
        ]).catch(() => {
          // console.error(error);
        });
      }

      ctx.set("ETag", etag);
      if (etag && ctx.req.headers["if-none-match"] === etag) {
        ctx.status = 304;
        return;
      }

      // Mime
      if (format) {
        ctx.set("Content-Type", `image/${format}`);
      }

      ctx.body = data;
    } catch (error: any) {
      const statusCode = parseInt(error.statusCode, 10) || 500;
      const statusMessage = error.message
        ? `IPX Error (${error.message})`
        : `IPX Error (${statusCode})`;
      strapi.log.debug(statusMessage);
      // console.error(error);

      ctx.status = statusCode;
    }
  };
}

export { createMiddleware };
