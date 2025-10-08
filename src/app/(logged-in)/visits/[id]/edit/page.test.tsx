import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getVisit } from "../../actions";
import EditVisitPage from "./page";

vi.mock("next/navigation", () => ({
	notFound: vi.fn(),
}));

vi.mock("../../actions", () => ({
	getVisit: vi.fn(),
	updateVisit: vi.fn(),
}));

const mockedNotFound = vi.mocked(notFound);
const mockedGetVisit = vi.mocked(getVisit);

const pageProps = (id: string) =>
	({ params: Promise.resolve({ id }) }) as Parameters<typeof EditVisitPage>[0];

const renderEditVisitPage = async (id: string) =>
	render(await EditVisitPage(pageProps(id)));

describe("EditVisitPage", () => {
	beforeEach(() => {
		mockedGetVisit.mockResolvedValue({
			id: 7,
			title: "Annual Checkup",
			content: "Review lab results and adjust medication.",
			userId: 3,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders the edit form when the visit is found", async () => {
		await renderEditVisitPage("7");

		expect(mockedGetVisit).toHaveBeenCalledWith(7);
		const heading = screen.getByText("Edit Visit");
		expect(heading).toBeInTheDocument();
	});

	it("calls notFound when the visit does not exist", async () => {
		mockedGetVisit.mockResolvedValueOnce(null);
		mockedNotFound.mockImplementation(() => {
			throw new Error("Not Found");
		});

		await expect(EditVisitPage(pageProps("404"))).rejects.toThrow("Not Found");
	});
});
