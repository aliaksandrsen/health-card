import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

const prismaClientSingleton = () => {
	if (!connectionString) {
		// Allow builds/tests without a DB; fail fast on actual DB usage.
		return new Proxy({} as PrismaClient, {
			get() {
				throw new Error("DATABASE_URL is not set");
			},
		});
	}

	const adapter = new PrismaPg({ connectionString });
	return new PrismaClient({ adapter });
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: solution from docs
declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
