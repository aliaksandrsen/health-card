import { afterEach, describe, expect, it, vi } from "vitest";
import db, { createDatabase } from "./drizzle";

describe("drizzle", () => {
	const originalDatabaseUrl = process.env.DATABASE_URL;

	afterEach(() => {
		if (originalDatabaseUrl === undefined) {
			delete process.env.DATABASE_URL;
		} else {
			process.env.DATABASE_URL = originalDatabaseUrl;
		}
		delete (globalThis as { drizzleGlobal?: unknown }).drizzleGlobal;
		vi.resetModules();
	});

	it("allows inspecting metadata like _ without throwing when DATABASE_URL is not set", () => {
		expect((db as unknown as { _: unknown })._).toBeUndefined();
	});

	it("throws an error when accessing query methods without DATABASE_URL set", () => {
		expect(() => (db as unknown as { select: () => unknown }).select).toThrow(
			"DATABASE_URL is not set",
		);
	});

	it("creates a database instance using createDatabase", () => {
		const instance = createDatabase(
			"postgresql://user:password@localhost:5432/testdb",
		);
		expect(instance).toBeDefined();
		expect(instance.db).toBeDefined();
		expect(instance.client).toBeDefined();
	});

	it("initializes default db client when DATABASE_URL is set", async () => {
		process.env.DATABASE_URL =
			"postgresql://user:password@localhost:5432/testdb";
		delete (globalThis as { drizzleGlobal?: unknown }).drizzleGlobal;
		vi.resetModules();

		const { default: configuredDb } = await import("./drizzle");
		expect(configuredDb).toBeDefined();
		expect(typeof configuredDb.select).toBe("function");
	});
});
