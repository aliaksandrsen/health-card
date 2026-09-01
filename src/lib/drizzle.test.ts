import { describe, expect, it } from "vitest";
import db, { createDatabase } from "./drizzle";

describe("drizzle", () => {
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
});
