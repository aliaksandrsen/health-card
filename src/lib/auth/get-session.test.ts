import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSession, requireUser } from "./get-session";

const { getSessionMock, headersMock } = vi.hoisted(() => ({
	getSessionMock: vi.fn(),
	headersMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
	headers: headersMock,
}));

vi.mock("@/auth", () => ({
	auth: {
		api: {
			getSession: getSessionMock,
		},
	},
}));

describe("get-session", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("passes request headers to auth.api.getSession", async () => {
		const fakeHeaders = new Headers({ cookie: "session=abc" });
		headersMock.mockResolvedValueOnce(fakeHeaders);
		getSessionMock.mockResolvedValueOnce({
			user: { id: "1", email: "user@example.com", name: "User" },
		});

		const session = await getSession();

		expect(headersMock).toHaveBeenCalledTimes(1);
		expect(getSessionMock).toHaveBeenCalledWith({ headers: fakeHeaders });
		expect(session).toEqual({
			user: { id: "1", email: "user@example.com", name: "User" },
		});
	});

	it("returns the authenticated user from requireUser when session exists", async () => {
		headersMock.mockResolvedValueOnce(new Headers());
		getSessionMock.mockResolvedValueOnce({
			user: { id: "2", email: "doc@example.com", name: "Doctor" },
		});

		const user = await requireUser();

		expect(user).toEqual({ id: "2", email: "doc@example.com", name: "Doctor" });
	});

	it("returns null from requireUser when session is missing", async () => {
		headersMock.mockResolvedValueOnce(new Headers());
		getSessionMock.mockResolvedValueOnce(null);

		const user = await requireUser();

		expect(user).toBeNull();
	});
});
