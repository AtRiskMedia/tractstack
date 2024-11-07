import { defineConfig } from "astro/config";
import TractStackTheme from "tractstack";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [
    TractStackTheme({
      config: {
        title: "Tract Stack",
        description: "no-code website builder and content marketing platform",
      },
      overrides: {
        components: {
          CodeHook: "./src/custom/CodeHook.astro",
        },
      },
    }),
    tailwind(),
    react(),
  ],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
