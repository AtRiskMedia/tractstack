import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";

const schema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export default defineTheme({
  name: "tractstack",
  schema,
});
