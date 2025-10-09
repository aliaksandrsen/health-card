import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyVisitsFallback } from "./EmptyVisitsFallback";

describe("EmptyVisitsFallback", () => {
	it("shows the empty state message", () => {
		render(<EmptyVisitsFallback />);

		const title = screen.getByText("No visits yet");
		const description = screen.getByText(
			/keep track of appointments, symptoms, and treatment notes in one place/i,
		);

		expect(title).toBeInTheDocument();
		expect(description).toBeInTheDocument();
	});

	it("links to the new visit form", () => {
		render(<EmptyVisitsFallback />);

		const links = screen.getAllByRole("link", {
			name: /schedule your first visit/i,
		});

		expect(links.length).toBeGreaterThan(0);
		links.forEach((link) => {
			expect(link).toHaveAttribute("href", "/visits/new");
		});
	});
});
