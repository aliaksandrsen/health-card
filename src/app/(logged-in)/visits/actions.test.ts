import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createVisit,
	deleteVisit,
	fetchVisits,
	getVisit,
	updateVisit,
} from "./actions";

const {
	redirectMock,
	getSessionMock,
	listVisitsMock,
	getVisitByIdMock,
	createVisitRecordMock,
	updateVisitRecordMock,
	deleteVisitRecordMock,
} = vi.hoisted(() => ({
	redirectMock: vi.fn(),
	getSessionMock: vi.fn(),
	listVisitsMock: vi.fn(),
	getVisitByIdMock: vi.fn(),
	createVisitRecordMock: vi.fn(),
	updateVisitRecordMock: vi.fn(),
	deleteVisitRecordMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	redirect: redirectMock,
}));

vi.mock("@/lib/auth/get-session", () => ({
	getSession: getSessionMock,
}));

vi.mock("@/lib/db/visits", () => ({
	listVisits: listVisitsMock,
	getVisitById: getVisitByIdMock,
	createVisit: createVisitRecordMock,
	updateVisit: updateVisitRecordMock,
	deleteVisit: deleteVisitRecordMock,
}));

const makeFormData = (fields: Record<string, string>) => {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}
	return formData;
};

describe("visits actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("fetchVisits redirects unauthenticated users and lists visits for authenticated users", async () => {
		getSessionMock.mockResolvedValueOnce(null);
		redirectMock.mockImplementationOnce(() => {
			throw new Error("NEXT_REDIRECT");
		});

		await expect(fetchVisits({ skip: 0, take: 4 })).rejects.toThrow(
			"NEXT_REDIRECT",
		);
		expect(redirectMock).toHaveBeenCalledWith("/login");

		getSessionMock.mockResolvedValueOnce({ user: { id: "3" } });
		listVisitsMock.mockResolvedValueOnce({ totalVisits: 1, visits: [] });

		const result = await fetchVisits({ skip: 4, take: 4 });
		expect(listVisitsMock).toHaveBeenCalledWith({
			skip: 4,
			take: 4,
			userId: 3,
		});
		expect(result).toEqual({ totalVisits: 1, visits: [] });
	});

	it("getVisit redirects unauthenticated users and fetches visit by id for authenticated users", async () => {
		getSessionMock.mockResolvedValueOnce(null);
		redirectMock.mockImplementationOnce(() => {
			throw new Error("NEXT_REDIRECT");
		});

		await expect(getVisit(12)).rejects.toThrow("NEXT_REDIRECT");
		expect(redirectMock).toHaveBeenCalledWith("/login");

		getSessionMock.mockResolvedValueOnce({ user: { id: "3" } });
		getVisitByIdMock.mockResolvedValueOnce({ id: 12, title: "Dental" });

		const result = await getVisit(12);
		expect(getVisitByIdMock).toHaveBeenCalledWith(12, 3);
		expect(result).toEqual({ id: 12, title: "Dental" });
	});

	it("createVisit validates input, handles DB errors, and redirects on success", async () => {
		getSessionMock.mockResolvedValue({ user: { id: "5" } });

		const invalidResult = await createVisit(
			{},
			makeFormData({ title: "", content: "" }),
		);
		expect(invalidResult.errors).toEqual({
			title: "Title is required",
			content: "Content is required",
		});

		createVisitRecordMock.mockRejectedValueOnce(new Error("DB error"));
		const errorResult = await createVisit(
			{},
			makeFormData({ title: "Cardiology", content: "Checkup notes" }),
		);
		expect(errorResult.errors).toEqual({
			form: "Unable to create the visit right now. Please try again.",
		});

		createVisitRecordMock.mockResolvedValueOnce({ id: 1 });
		await createVisit(
			{},
			makeFormData({ title: "Cardiology", content: "Checkup notes" }),
		);
		expect(createVisitRecordMock).toHaveBeenCalledWith({
			title: "Cardiology",
			content: "Checkup notes",
			userId: 5,
		});
		expect(redirectMock).toHaveBeenCalledWith("/visits");
	});

	it("updateVisit validates input, handles missing visit or DB error, and redirects on success", async () => {
		getSessionMock.mockResolvedValue({ user: { id: "5" } });

		const invalidResult = await updateVisit(
			9,
			{},
			makeFormData({ title: "", content: "" }),
		);
		expect(invalidResult.errors).toEqual({
			title: "Title is required",
			content: "Content is required",
		});

		updateVisitRecordMock.mockResolvedValueOnce(false);
		const notFoundResult = await updateVisit(
			9,
			{},
			makeFormData({ title: "Updated", content: "Updated notes" }),
		);
		expect(notFoundResult.errors).toEqual({
			form: "Visit not found.",
		});

		updateVisitRecordMock.mockRejectedValueOnce(new Error("DB down"));
		const dbErrorResult = await updateVisit(
			9,
			{},
			makeFormData({ title: "Updated", content: "Updated notes" }),
		);
		expect(dbErrorResult.errors).toEqual({
			form: "Unable to update the visit right now. Please try again.",
		});

		updateVisitRecordMock.mockResolvedValueOnce(true);
		await updateVisit(
			9,
			{},
			makeFormData({ title: "Updated", content: "Updated notes" }),
		);
		expect(updateVisitRecordMock).toHaveBeenCalledWith(9, {
			title: "Updated",
			content: "Updated notes",
			userId: 5,
		});
		expect(redirectMock).toHaveBeenCalledWith("/visits/9");
	});

	it("deleteVisit deletes visit for authenticated user and redirects", async () => {
		getSessionMock.mockResolvedValueOnce(null);
		redirectMock.mockImplementationOnce(() => {
			throw new Error("NEXT_REDIRECT");
		});
		await expect(deleteVisit(15)).rejects.toThrow("NEXT_REDIRECT");

		getSessionMock.mockResolvedValueOnce({ user: { id: "5" } });
		deleteVisitRecordMock.mockResolvedValueOnce(true);

		await deleteVisit(15);
		expect(deleteVisitRecordMock).toHaveBeenCalledWith(15, 5);
		expect(redirectMock).toHaveBeenCalledWith("/visits");
	});
});
