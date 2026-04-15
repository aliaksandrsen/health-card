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
			get() {
				throw new Error("DATABASE_URL is not set");
			},
		});
	}

	return createDatabase(connectionString).db;
};

declare const globalThis: {
	drizzleGlobal: ReturnType<typeof drizzleClientSingleton>;
} & typeof global;

const db = globalThis.drizzleGlobal ?? drizzleClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.drizzleGlobal = db;
