import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

type Database = PostgresJsDatabase<typeof schema>;

export const createDatabase = (url: string) => {
	const client = postgres(url);

	return {
		client,
		db: drizzle({ client, schema }),
	};
};

const drizzleClientSingleton = (): Database => {
	if (!connectionString) {
		// Allow builds/tests without a DB; fail fast on actual DB usage.
		return new Proxy({} as Database, {
			get(_target, prop) {
				if (prop === "_") {
					return undefined;
				}
				throw new Error("DATABASE_URL is not set");
			},
		});
	}

	return createDatabase(connectionString).db;
};

const globalForDrizzle = globalThis as unknown as {
	drizzleGlobal?: ReturnType<typeof drizzleClientSingleton>;
};

const db = globalForDrizzle.drizzleGlobal ?? drizzleClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalForDrizzle.drizzleGlobal = db;
