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

  const brandColors: {
    readonly "brand-1": string;
    readonly "brand-2": string;
    readonly "brand-3": string;
    readonly "brand-4": string;
    readonly "brand-5": string;
    readonly "brand-6": string;
    readonly "brand-7": string;
    readonly "brand-8": string;
  };

  export { CodeHook, HeaderWidget, brandColors };
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
