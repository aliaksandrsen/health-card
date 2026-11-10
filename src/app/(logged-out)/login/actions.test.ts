import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginWithCredentials } from "./actions";

const { headersMock, signInEmailMock } = vi.hoisted(() => ({
	headersMock: vi.fn(),
	signInEmailMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
	headers: headersMock,
}));

vi.mock("@/auth", () => ({
	auth: {
		api: {
			signInEmail: signInEmailMock,
		},
	},
}));

describe("loginWithCredentials", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns validation error when email or password is invalid", async () => {
		const result = await loginWithCredentials({
			email: "not-an-email",
			password: "123",
		});

		expect(result?.error).toBeDefined();
		expect(signInEmailMock).not.toHaveBeenCalled();
	});

	it("calls auth.api.signInEmail with validated credentials", async () => {
		const fakeHeaders = new Headers();
		headersMock.mockResolvedValueOnce(fakeHeaders);
		signInEmailMock.mockResolvedValueOnce(undefined);

		const result = await loginWithCredentials({
			email: "user@example.com",
			password: "password123",
		});

		expect(result).toBeUndefined();
		expect(signInEmailMock).toHaveBeenCalledWith({
			body: {
				email: "user@example.com",
				password: "password123",
			},
			headers: fakeHeaders,
		});
	});

	it("returns error message when signInEmail throws INVALID_EMAIL_OR_PASSWORD or generic error", async () => {
		headersMock.mockResolvedValue(new Headers());
		signInEmailMock.mockRejectedValueOnce({
			code: "INVALID_EMAIL_OR_PASSWORD",
		});

		await expect(
			loginWithCredentials({
				email: "user@example.com",
				password: "wrongpassword",
			}),
		).resolves.toEqual({
			error: "Incorrect email or password",
		});

		signInEmailMock.mockRejectedValueOnce(new Error("Unexpected failure"));

		await expect(
			loginWithCredentials({
				email: "user@example.com",
				password: "wrongpassword",
			}),
		).resolves.toEqual({
			error: "Incorrect email or password",
		});
	});
});
