import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createVisit } from "../actions";
import NewVisit from "./page";

vi.mock("../actions", () => ({
	createVisit: vi.fn(),
}));

const mockedCreateVisit = vi.mocked(createVisit);

describe("NewVisit page", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it("renders a form to create a visit", () => {
		render(<NewVisit />);

		expect(screen.getByText("Create New Visit")).toBeInTheDocument();

		const titleInput = screen.getByLabelText(/title/i);
		expect(titleInput).toBeRequired();
		expect(titleInput).toHaveAttribute("name", "title");
		expect(titleInput).toHaveAttribute(
			"placeholder",
			"Enter your visit title ...",
		);

		const contentTextarea = screen.getByLabelText(/content/i);
		expect(contentTextarea).toBeRequired();
		expect(contentTextarea).toHaveAttribute("name", "content");
		expect(contentTextarea).toHaveAttribute(
			"placeholder",
			"Write your visits content here ...",
		);

		const submitButton = screen.getByRole("button", { name: /create visit/i });
		expect(submitButton).toHaveAttribute("type", "submit");
	});

	it("submits the form data via createVisit action", async () => {
		const user = userEvent.setup();
		render(<NewVisit />);

		await user.type(screen.getByLabelText(/title/i), "Follow-up");
		await user.type(screen.getByLabelText(/content/i), "Discuss lab results");

		await user.click(screen.getByRole("button", { name: /create visit/i }));

		expect(mockedCreateVisit).toHaveBeenCalledTimes(1);
		const submittedFormData = mockedCreateVisit.mock.calls[0]?.[0];

		expect(submittedFormData).toBeInstanceOf(FormData);
		expect(submittedFormData?.get("title")).toBe("Follow-up");
		expect(submittedFormData?.get("content")).toBe("Discuss lab results");
	});
});
