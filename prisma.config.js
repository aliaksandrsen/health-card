import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "./prisma/schema.prisma",
	migrations: {
		seed: "npx tsx prisma/seed.ts",
	},
	datasource: {
		// Allow prisma generate to run without a populated env, while migrate commands still require it.
		url: process.env.DATABASE_URL ?? "",
	},
});
