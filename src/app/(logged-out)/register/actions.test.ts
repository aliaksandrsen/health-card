import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerUser } from "./actions";

const { headersMock, signUpEmailMock } = vi.hoisted(() => ({
	headersMock: vi.fn(),
	signUpEmailMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
	headers: headersMock,
}));

vi.mock("@/auth", () => ({
	auth: {
		api: {
			signUpEmail: signUpEmailMock,
		},
	},
}));

describe("registerUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns validation error when input is invalid", async () => {
		const result = await registerUser({
			email: "invalid",
			name: "A",
			password: "123",
			passwordConfirm: "456",
		});

		expect(result?.error).toBeDefined();
		expect(signUpEmailMock).not.toHaveBeenCalled();
	});

	it("calls auth.api.signUpEmail with validated user data", async () => {
		const fakeHeaders = new Headers();
		headersMock.mockResolvedValueOnce(fakeHeaders);
		signUpEmailMock.mockResolvedValueOnce(undefined);

		const result = await registerUser({
			email: "new@example.com",
			name: "Alice",
			password: "password123",
			passwordConfirm: "password123",
		});

		expect(result).toBeUndefined();
		expect(signUpEmailMock).toHaveBeenCalledWith({
			body: {
				name: "Alice",
				email: "new@example.com",
				password: "password123",
			},
			headers: fakeHeaders,
		});
	});

	it("returns duplicate email error when USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL is thrown", async () => {
		headersMock.mockResolvedValueOnce(new Headers());
		signUpEmailMock.mockRejectedValueOnce({
			code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
		});

		const result = await registerUser({
			email: "existing@example.com",
			name: "Alice",
			password: "password123",
			passwordConfirm: "password123",
		});

		expect(result).toEqual({
			error: "An account is already registered with this email address",
		});
	});

	it("returns generic error when an unexpected exception occurs", async () => {
		headersMock.mockResolvedValueOnce(new Headers());
		signUpEmailMock.mockRejectedValueOnce(new Error("Unknown error"));

		const result = await registerUser({
			email: "existing@example.com",
			name: "Alice",
			password: "password123",
			passwordConfirm: "password123",
		});

		expect(result).toEqual({
			error: "An error occurred.",
		});
	});
});
