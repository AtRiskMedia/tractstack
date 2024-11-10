// @ts-check
import { defineConfig } from "astro/config";
import TractStackTheme from "tractstack";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [
    TractStackTheme({
      config: {
        website: "https://my.tractstack.com",
        title: "Tract Stack",
        description: "no-code website builder and content marketing platform",
      },
      overrides: {
        components: {
          CodeHook: "./src/custom/CodeHook.astro",
          HeaderWidget: "./src/custom/HeaderWidget.astro",
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
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "ui-core": ["@headlessui/react", "@heroicons/react"],
            nivo: ["@nivo/core", "@nivo/line", "@nivo/pie", "lodash-es"],
            markdown: [
              "debug",
              "mdast-util-from-markdown",
              "mdast-util-to-hast",
              "mdast-util-to-markdown",
              "hast-util-to-html",
            ],
          },
        },
      },
    },
    ssr: {
      noExternal: ["@headlessui/*"],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@headlessui/react",
        "@heroicons/react",
        "@nivo/core",
        "@nivo/line",
        "@nivo/pie",
        "lodash-es",
        "debug",
        "mdast-util-from-markdown",
        "mdast-util-to-hast",
        "mdast-util-to-markdown",
        "hast-util-to-html",
      ],
    },
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
});
