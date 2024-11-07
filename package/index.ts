import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the schema for the theme configuration
const schema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

// Export the theme definition
export default defineTheme({
  name: "tractstack",
  schema,
  setup: ({ addPage }) => {
    const pagePath = join(__dirname, "src/pages/index.astro");
    return {
      components: {
        Layout: join(__dirname, "src/layouts/Layout.astro"),
      }
    };
  }
});
