export default () => ({
  "local-image-format": {
    enabled: true,
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
