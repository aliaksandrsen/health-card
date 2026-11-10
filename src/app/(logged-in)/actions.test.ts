import { beforeEach, describe, expect, it, vi } from "vitest";
import { getRecentVisits, signOutAction } from "./actions";

const {
	headersMock,
	redirectMock,
	signOutMock,
	getSessionMock,
	getRecentVisitsForUserMock,
} = vi.hoisted(() => ({
	headersMock: vi.fn(),
	redirectMock: vi.fn(),
	signOutMock: vi.fn(),
	getSessionMock: vi.fn(),
	getRecentVisitsForUserMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
	headers: headersMock,
}));

vi.mock("next/navigation", () => ({
	redirect: redirectMock,
}));

vi.mock("@/auth", () => ({
	auth: {
		api: {
			signOut: signOutMock,
		},
	},
}));

vi.mock("@/lib/auth/get-session", () => ({
	getSession: getSessionMock,
}));

vi.mock("@/lib/db/visits", () => ({
	getRecentVisits: getRecentVisitsForUserMock,
}));

describe("logged-in root actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("signs out user with request headers and redirects to /login", async () => {
		const fakeHeaders = new Headers();
		headersMock.mockResolvedValueOnce(fakeHeaders);
		signOutMock.mockResolvedValueOnce(undefined);

		await signOutAction();

		expect(signOutMock).toHaveBeenCalledWith({ headers: fakeHeaders });
		expect(redirectMock).toHaveBeenCalledWith("/login");
	});

	it("redirects to /login when session is missing in getRecentVisits", async () => {
		getSessionMock.mockResolvedValueOnce(null);
		redirectMock.mockImplementationOnce(() => {
			throw new Error("NEXT_REDIRECT");
		});

		await expect(getRecentVisits()).rejects.toThrow("NEXT_REDIRECT");
		expect(redirectMock).toHaveBeenCalledWith("/login");
		expect(getRecentVisitsForUserMock).not.toHaveBeenCalled();
	});

	it("returns recent visits for the authenticated user", async () => {
		getSessionMock.mockResolvedValueOnce({
			user: { id: "7" },
		});
		const visits = [{ id: 1, title: "Checkup" }];
		getRecentVisitsForUserMock.mockResolvedValueOnce(visits);

		const result = await getRecentVisits();

		expect(getRecentVisitsForUserMock).toHaveBeenCalledWith(7, 6);
		expect(result).toEqual(visits);
	});
});
