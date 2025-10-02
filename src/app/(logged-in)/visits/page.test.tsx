import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchVisits } from "./actions";
import { VISITS_PER_PAGE } from "./const";
import VisitsPage from "./page";

const mockVisits = [
	{
		id: 10,
		title: "Routine Check-up",
		content: "General wellness check.",
		createdAt: new Date("2024-01-10T10:00:00Z"),
		updatedAt: new Date("2024-01-10T10:00:00Z"),
		userId: 1,
	},
	{
		id: 11,
		title: "Lab Results Review",
		content: "Discuss lab findings.",
		createdAt: new Date("2024-02-05T15:30:00Z"),
		updatedAt: new Date("2024-02-05T15:30:00Z"),
		userId: 2,
	},
];

vi.mock("./actions", () => ({
	fetchVisits: vi.fn(),
}));

const fetchVisitsMock = vi.mocked(fetchVisits);

const renderVisitsPage = async (
	params: Record<string, string | string[] | undefined> = {},
) => {
	const page = await VisitsPage({
		searchParams: Promise.resolve(params),
	});

	return render(page);
};

describe("VisitsPage", () => {
	beforeEach(() => {
		fetchVisitsMock.mockReset();
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it("renders the empty state when no visits are returned", async () => {
		fetchVisitsMock.mockResolvedValue({ visits: [], totalVisits: 0 });

		await renderVisitsPage({ page: "not-a-number" });

		expect(fetchVisitsMock).toHaveBeenCalledWith({
			skip: 0,
			take: VISITS_PER_PAGE,
		});

		expect(screen.getByText(/no visits yet/i)).toBeInTheDocument();

		const pagination = screen.getByRole("navigation", { name: /pagination/i });
		const pageLinks = within(pagination).getAllByRole("link", {
			name: /^\d+$/,
		});
		expect(pageLinks).toHaveLength(1);
		expect(pageLinks[0]).toHaveTextContent("1");
		expect(pageLinks[0]).toHaveAttribute("aria-current", "page");
		expect(
			screen.queryByLabelText(/go to previous page/i),
		).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/go to next page/i)).not.toBeInTheDocument();
	});

	it("renders visit previews and passes pagination details", async () => {
		fetchVisitsMock.mockResolvedValue({ visits: mockVisits, totalVisits: 6 });

		await renderVisitsPage({ page: "2" });

		expect(fetchVisitsMock).toHaveBeenCalledWith({
			skip: VISITS_PER_PAGE,
			take: VISITS_PER_PAGE,
		});

		const firstVisitLink = screen.getByRole("link", {
			name: /routine check-up/i,
		});
		expect(firstVisitLink).toHaveAttribute("href", "/visits/10");
		expect(firstVisitLink).toHaveTextContent("General wellness check.");

		const secondVisitLink = screen.getByRole("link", {
			name: /lab results review/i,
		});
		expect(secondVisitLink).toHaveAttribute("href", "/visits/11");
		expect(secondVisitLink).toHaveTextContent("Discuss lab findings.");

		const pagination = screen.getByRole("navigation", { name: /pagination/i });
		const pageLinks = within(pagination).getAllByRole("link", {
			name: /^\d+$/,
		});
		expect(pageLinks).toHaveLength(2);
		expect(pageLinks[0]).toHaveAttribute("href", "/visits?page=1");
		expect(pageLinks[1]).toHaveAttribute("href", "/visits?page=2");

		const previousLink = screen.getByLabelText(/go to previous page/i);
		expect(previousLink).toHaveAttribute("href", "/visits?page=1");
		expect(screen.queryByLabelText(/go to next page/i)).not.toBeInTheDocument();

		const activePageLink = screen.getByRole("link", { name: "2" });
		expect(activePageLink).toHaveAttribute("aria-current", "page");
	});
});
