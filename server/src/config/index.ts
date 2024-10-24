import { pluginConfigSchema } from "./schema";

export default {
  default: ({ env }: { env: any }) => ({
    cacheDir: env("STRAPI_PLUGIN_LOCAL_IMAGE_SHARP_CACHE_DIR", ""),
    maxAge: 3600,
    paths: ["/uploads"],
  }),
  validator(config: unknown) {
    pluginConfigSchema.parse(config);
  },
};
