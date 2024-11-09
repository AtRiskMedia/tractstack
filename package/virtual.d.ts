// package/virtual.d.ts
/// <reference types="astro/client" />

declare module "astro-theme-provider" {
  import { z } from "astro/zod";

  export interface ThemeConfig<T extends z.ZodType> {
    name: string;
    schema: T;
  }

  export default function defineTheme<T extends z.ZodType>(config: ThemeConfig<T>): ThemeConfig<T>;
}

declare module "virtual:theme-config" {
  const config: {
    title: string;
    description?: string;
  };
  export default config;
}

declare module "tractstack:components" {
  import type { AstroComponent } from "astro";

  const CodeHook: AstroComponent<{
    target: string;
    resources?: any[] | null;
    options?: any | null;
  }>;

  const HeaderWidget: AstroComponent<{
    slug: string;
    resources?: any[] | null;
  }>;
  export { CodeHook, HeaderWidget };
}

declare module "astro:assets" {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  export function getImage(options: any): Promise<any>;
}

declare namespace App {
  interface Locals {
    user?: {
      isAuthenticated: boolean;
    };
  }
}
