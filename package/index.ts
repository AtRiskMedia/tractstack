import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";

// Define the schema for the theme configuration
const schema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

// Export the theme definition
export default defineTheme({
  name: "tractstack",
  schema,
});
