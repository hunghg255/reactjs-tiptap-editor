import { defineConfig, presetWind3 } from 'unocss';

// unocss >= 66 no longer applies a preset when no config file exists.
// presetWind3 matches the previous default (presetUno) behaviour.
export default defineConfig({
  presets: [presetWind3()],
});
