import { z } from "zod";

const pluginConfigSchema = z.object({
  cacheDir: z.string(),
  maxAge: z.number().min(1),
  // Upper bound for any single resize dimension. Caps how large a canvas sharp
  // will allocate per request (memory-exhaustion guard).
  maxDimension: z.number().min(1),
  paths: z.array(z.string().startsWith("/")).min(1),
});
export type PluginConfig = z.infer<typeof pluginConfigSchema>;

export { pluginConfigSchema };
