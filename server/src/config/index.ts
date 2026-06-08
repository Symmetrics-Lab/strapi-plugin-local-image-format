import { pluginConfigSchema } from "./schema";

export default {
  // TODO: fix types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ env }: { env: any }) => ({
    cacheDir: env("STRAPI_PLUGIN_LOCAL_IMAGE_SHARP_CACHE_DIR", ""),
    maxAge: 3600,
    maxDimension: 4000,
    paths: ["/uploads"],
  }),
  validator(config: unknown) {
    pluginConfigSchema.parse(config);
  },
};
