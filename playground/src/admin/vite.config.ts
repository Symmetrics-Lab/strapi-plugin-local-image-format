import { mergeConfig } from 'vite';

export default (config: any) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    publicDir: false,
  });
};
