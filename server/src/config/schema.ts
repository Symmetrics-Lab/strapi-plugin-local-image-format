import { z } from "zod";

const pluginConfigSchema = z.object({
  cacheDir: z.string(),
  maxAge: z.number().min(1),
  paths: z.array(z.string()),
});
export type PluginConfig = z.infer<typeof pluginConfigSchema>;

export { pluginConfigSchema };
