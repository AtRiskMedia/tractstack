// package/index.ts
import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";
import { initializeSchema } from "./src/db/schema";
import { createTursoClient } from "./src/db/utils";

const schema = z.object({
  website: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
});

export async function setupTurso(config?: { url?: string; authToken?: string }) {
  console.log("Initializing TractStack database...");
  const client = createTursoClient(config);
  try {
    await initializeSchema(client);
    console.log("TractStack database initialized successfully");
    return true;
  } catch (err) {
    console.error("Failed to initialize TractStack database:", err);
    return false;
  } finally {
    await client.close();
  }
}

const theme = defineTheme({
  name: "tractstack",
  schema,
});

export { initializeSchema };
export default theme;
