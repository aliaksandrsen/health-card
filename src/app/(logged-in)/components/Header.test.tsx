import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "./Header";

const mockUser = {
	id: "user-1",
	email: "john.doe@example.com",
	name: "John Doe",
};

describe("Header", () => {
	it("renders navigation links and the current user information", () => {
		render(<Header user={mockUser} />);

		const homeLink = screen.getByRole("link", { name: /health card/i });
		expect(homeLink).toHaveAttribute("href", "/");

		const visitsLink = screen.getByRole("link", { name: "Visits" });
		expect(visitsLink).toHaveAttribute("href", "/visits");

		const newVisitLink = screen.getByRole("link", { name: "New Visit" });
		expect(newVisitLink).toHaveAttribute("href", "/visits/new");

		expect(screen.getByText(mockUser.name)).toBeInTheDocument();
		expect(screen.getByText(mockUser.email)).toBeInTheDocument();

		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("type", "submit");
	});
});
