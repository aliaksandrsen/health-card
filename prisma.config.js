import dotenv from "dotenv";

dotenv.config();

const config = {
	schema: "./prisma/schema.prisma",
	migrations: {
		seed: "npx tsx prisma/seed.ts",
	},
};

export default config;
