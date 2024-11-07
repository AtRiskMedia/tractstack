// package/virtual.d.ts
/// <reference types="astro/client" />

declare module "virtual:theme-config" {
  const config: {
    title: string;
    description?: string;
  };
  export default config;
}

// If you need to use these later for external consumption
declare module "tractstack/components" {
  export * from "./src/components";
}

declare module "tractstack/layouts" {
  export * from "./src/layouts";
}
