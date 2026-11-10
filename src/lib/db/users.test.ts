import { beforeEach, describe, expect, it, vi } from "vitest";
import { createUser, DuplicateEmailError, findUserByEmail } from "./users";

const { selectMock, insertMock } = vi.hoisted(() => ({
	selectMock: vi.fn(),
	insertMock: vi.fn(),
}));

vi.mock("@/lib/drizzle", () => ({
	default: {
		select: selectMock,
		insert: insertMock,
	},
}));

const sampleUser = {
	id: 1,
	name: "Jane Doe",
	email: "jane@example.com",
	emailVerified: false,
	image: null,
	password: "hashed-password",
	createdAt: new Date("2025-01-01T00:00:00Z"),
	updatedAt: new Date("2025-01-01T00:00:00Z"),
};

describe("users db helpers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("finds a user by email when present", async () => {
		const limitMock = vi.fn().mockResolvedValueOnce([sampleUser]);
		const whereMock = vi.fn().mockReturnValue({ limit: limitMock });
		const fromMock = vi.fn().mockReturnValue({ where: whereMock });
		selectMock.mockReturnValue({ from: fromMock });

		const result = await findUserByEmail("jane@example.com");

		expect(result).toEqual(sampleUser);
		expect(limitMock).toHaveBeenCalledWith(1);
	});

	it("returns null when user is not found by email", async () => {
		const limitMock = vi.fn().mockResolvedValueOnce([]);
		const whereMock = vi.fn().mockReturnValue({ limit: limitMock });
		const fromMock = vi.fn().mockReturnValue({ where: whereMock });
		selectMock.mockReturnValue({ from: fromMock });

		const result = await findUserByEmail("missing@example.com");

		expect(result).toBeNull();
	});

	it("creates and returns a new user", async () => {
		const returningMock = vi.fn().mockResolvedValueOnce([sampleUser]);
		const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
		insertMock.mockReturnValue({ values: valuesMock });

		const result = await createUser({
			email: "jane@example.com",
			name: "Jane Doe",
			password: "hashed-password",
		});

		expect(valuesMock).toHaveBeenCalledWith({
			email: "jane@example.com",
			name: "Jane Doe",
			password: "hashed-password",
		});
		expect(result).toEqual(sampleUser);
	});

	it("throws DuplicateEmailError on PostgreSQL unique violation (23505)", async () => {
		const returningMock = vi.fn().mockRejectedValueOnce({ code: "23505" });
		const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
		insertMock.mockReturnValue({ values: valuesMock });

		await expect(
			createUser({
				email: "jane@example.com",
				name: "Jane Doe",
				password: "hashed-password",
			}),
		).rejects.toThrow(DuplicateEmailError);
	});

	it("rethrows non-unique database errors", async () => {
		const dbError = new Error("Connection lost");
		const returningMock = vi.fn().mockRejectedValueOnce(dbError);
		const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
		insertMock.mockReturnValue({ values: valuesMock });

		await expect(
			createUser({
				email: "jane@example.com",
				name: "Jane Doe",
				password: "hashed-password",
			}),
		).rejects.toThrow("Connection lost");
	});
});
