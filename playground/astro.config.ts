import { defineConfig } from "astro/config";
import TractStackTheme from "tractstack";

export default defineConfig({
	integrations: [
		TractStackTheme({
			config: {
				title: "Tract Stack",
				description: "no-code website builder and content marketing platform",
			},
			pages: {

			},
			overrides: {
				
			}
		}),
	],
});
