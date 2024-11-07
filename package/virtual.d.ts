/// <reference types="astro/client" />

declare module 'virtual:theme-config' {
  const config: {
    title: string;
    description?: string;
  };
  export default config;
}

declare module 'tractstack:components' {
  export * from './src/components';
}

declare module 'tractstack:layouts' {
  export * from './src/layouts';
}

declare module 'tractstack:assets' {
  export * from './src/assets';
}
