export default () => ({
  "local-image-sharp": {
    enabled: true,
    resolve: "./node_modules/strapi-plugin-local-image-sharp",
    config: {
      paths: ["/uploads"],
      cacheDir: ".image-cache", // Can be set with env var STRAPI_PLUGIN_LOCAL_IMAGE_SHARP_CACHE_DIR
      maxAge: 31536000, // 1 year
    },
  },
  upload: {
    config: {
      provider: "local",
      sizeLimit: 10 * 1024 * 1024, // 10mb
      providerOptions: {},
    },
  },
});
