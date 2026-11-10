import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createVisit,
	deleteVisit,
	getRecentVisits,
	getVisitById,
	listVisits,
	updateVisit,
} from "./visits";

const { selectMock, insertMock, updateMock, deleteMock } = vi.hoisted(() => ({
	selectMock: vi.fn(),
	insertMock: vi.fn(),
	updateMock: vi.fn(),
	deleteMock: vi.fn(),
}));

vi.mock("@/lib/drizzle", () => ({
	default: {
		select: selectMock,
		insert: insertMock,
		update: updateMock,
		delete: deleteMock,
	},
}));

const sampleVisit = {
	id: 10,
	title: "Annual Physical",
	content: "All vitals normal.",
	userId: 1,
	createdAt: new Date("2025-01-10T10:00:00Z"),
	updatedAt: new Date("2025-01-10T10:00:00Z"),
};

describe("visits db helpers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("fetches recent visits for a user", async () => {
		const limitMock = vi.fn().mockResolvedValueOnce([sampleVisit]);
		const orderByMock = vi.fn().mockReturnValue({ limit: limitMock });
		const whereMock = vi.fn().mockReturnValue({ orderBy: orderByMock });
		const fromMock = vi.fn().mockReturnValue({ where: whereMock });
		selectMock.mockReturnValueOnce({ from: fromMock });

		const result = await getRecentVisits(1, 6);

		expect(limitMock).toHaveBeenCalledWith(6);
		expect(result).toEqual([sampleVisit]);
	});

	it("lists paginated visits and total count for a user", async () => {
		const limitMock = vi.fn().mockResolvedValueOnce([sampleVisit]);
		const offsetMock = vi.fn().mockReturnValue({ limit: limitMock });
		const orderByMock = vi.fn().mockReturnValue({ offset: offsetMock });
		const whereRowsMock = vi.fn().mockReturnValue({ orderBy: orderByMock });
		const fromRowsMock = vi.fn().mockReturnValue({ where: whereRowsMock });

		const whereCountMock = vi.fn().mockResolvedValueOnce([{ value: 5 }]);
		const fromCountMock = vi.fn().mockReturnValue({ where: whereCountMock });

		selectMock
			.mockReturnValueOnce({ from: fromRowsMock })
			.mockReturnValueOnce({ from: fromCountMock });

		const result = await listVisits({ skip: 0, take: 4, userId: 1 });

		expect(offsetMock).toHaveBeenCalledWith(0);
		expect(limitMock).toHaveBeenCalledWith(4);
		expect(result).toEqual({
			totalVisits: 5,
			visits: [sampleVisit],
		});
	});

	it("defaults totalVisits to 0 when count query returns empty rows", async () => {
		const limitMock = vi.fn().mockResolvedValueOnce([]);
		const offsetMock = vi.fn().mockReturnValue({ limit: limitMock });
		const orderByMock = vi.fn().mockReturnValue({ offset: offsetMock });
		const whereRowsMock = vi.fn().mockReturnValue({ orderBy: orderByMock });
		const fromRowsMock = vi.fn().mockReturnValue({ where: whereRowsMock });

		const whereCountMock = vi.fn().mockResolvedValueOnce([]);
		const fromCountMock = vi.fn().mockReturnValue({ where: whereCountMock });

		selectMock
			.mockReturnValueOnce({ from: fromRowsMock })
			.mockReturnValueOnce({ from: fromCountMock });

		const result = await listVisits({ skip: 0, take: 4, userId: 1 });

		expect(result).toEqual({
			totalVisits: 0,
			visits: [],
		});
	});

	it("gets a visit by id when found and null when missing", async () => {
		const limitFoundMock = vi.fn().mockResolvedValueOnce([sampleVisit]);
		const whereFoundMock = vi.fn().mockReturnValue({ limit: limitFoundMock });
		const fromFoundMock = vi.fn().mockReturnValue({ where: whereFoundMock });
		selectMock.mockReturnValueOnce({ from: fromFoundMock });

		await expect(getVisitById(10, 1)).resolves.toEqual(sampleVisit);

		const limitEmptyMock = vi.fn().mockResolvedValueOnce([]);
		const whereEmptyMock = vi.fn().mockReturnValue({ limit: limitEmptyMock });
		const fromEmptyMock = vi.fn().mockReturnValue({ where: whereEmptyMock });
		selectMock.mockReturnValueOnce({ from: fromEmptyMock });

		await expect(getVisitById(999, 1)).resolves.toBeNull();
	});

	it("creates a visit record", async () => {
		const returningMock = vi.fn().mockResolvedValueOnce([sampleVisit]);
		const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
		insertMock.mockReturnValueOnce({ values: valuesMock });

		const created = await createVisit({
			title: "Annual Physical",
			content: "All vitals normal.",
			userId: 1,
		});

		expect(valuesMock).toHaveBeenCalledWith({
			title: "Annual Physical",
			content: "All vitals normal.",
			userId: 1,
		});
		expect(created).toEqual(sampleVisit);
	});

	it("updates a visit record and returns boolean status", async () => {
		const returningUpdatedMock = vi.fn().mockResolvedValueOnce([{ id: 10 }]);
		const whereUpdatedMock = vi
			.fn()
			.mockReturnValue({ returning: returningUpdatedMock });
		const setUpdatedMock = vi.fn().mockReturnValue({ where: whereUpdatedMock });
		updateMock.mockReturnValueOnce({ set: setUpdatedMock });

		await expect(
			updateVisit(10, {
				title: "Updated",
				content: "Updated content",
				userId: 1,
			}),
		).resolves.toBe(true);

		const returningMissingMock = vi.fn().mockResolvedValueOnce([]);
		const whereMissingMock = vi
			.fn()
			.mockReturnValue({ returning: returningMissingMock });
		const setMissingMock = vi.fn().mockReturnValue({ where: whereMissingMock });
		updateMock.mockReturnValueOnce({ set: setMissingMock });

		await expect(
			updateVisit(999, {
				title: "Updated",
				content: "Updated content",
				userId: 1,
			}),
		).resolves.toBe(false);
	});

	it("deletes a visit record and returns boolean status", async () => {
		const returningDeletedMock = vi.fn().mockResolvedValueOnce([{ id: 10 }]);
		const whereDeletedMock = vi
			.fn()
			.mockReturnValue({ returning: returningDeletedMock });
		deleteMock.mockReturnValueOnce({ where: whereDeletedMock });

		await expect(deleteVisit(10, 1)).resolves.toBe(true);
	});
});
