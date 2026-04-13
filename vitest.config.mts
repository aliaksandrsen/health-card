import react from "@vitejs/plugin-react";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		tsconfigPaths: true,
	},

	test: {
		environment: "jsdom",
		setupFiles: "./vitest.setup.ts",
		server: {
			deps: {
				inline: ["next"],
			},
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov"],
			exclude: [
				...coverageConfigDefaults.exclude,
				"**/*.test.ts",
				"**/*.test.tsx",
			],
		},
	},
});
