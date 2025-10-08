import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { updateVisit } from "../../actions";
import EditVisitForm from "./EditVisitForm";

vi.mock("../../actions", () => ({
	updateVisit: vi.fn(),
}));

const mockedUpdateVisit = vi.mocked(updateVisit);

const visit = {
	id: 12,
	title: "Initial title",
	content: "Initial content",
};

describe("EditVisitForm", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it("prefills the form with the visit values", () => {
		render(<EditVisitForm visit={visit} />);

		const titleInput = screen.getByLabelText(/title/i);
		const contentTextarea = screen.getByLabelText(/content/i);
		const submitButton = screen.getByRole("button", { name: /save changes/i });

		expect(titleInput).toHaveValue("Initial title");
		expect(contentTextarea).toHaveValue("Initial content");
		expect(submitButton).toHaveAttribute("type", "submit");
	});

	it("submits updated values via the updateVisit action", async () => {
		const user = userEvent.setup();
		render(<EditVisitForm visit={visit} />);
		mockedUpdateVisit.mockResolvedValueOnce({ errors: {} });

		const titleInput = screen.getByLabelText(/title/i);
		const contentTextarea = screen.getByLabelText(/content/i);
		const submitButton = screen.getByRole("button", { name: /save changes/i });

		await user.clear(titleInput);
		await user.type(titleInput, "Updated title");
		await user.clear(contentTextarea);
		await user.type(contentTextarea, "Updated content");
		await user.click(submitButton);

		expect(mockedUpdateVisit).toHaveBeenCalledTimes(1);
		const [visitId, prevState, formData] = mockedUpdateVisit.mock.calls[0] ?? [];
		expect(visitId).toBe(12);
		expect(prevState).toEqual({ errors: {} });
		expect(formData).toBeInstanceOf(FormData);
		expect(formData?.get("title")).toBe("Updated title");
		expect(formData?.get("content")).toBe("Updated content");
	});

	it("shows validation errors returned by the action", async () => {
		const user = userEvent.setup();
		render(<EditVisitForm visit={visit} />);
		mockedUpdateVisit.mockResolvedValueOnce({
			errors: { title: "Title is required" },
		});

		const submitButton = screen.getByRole("button", { name: /save changes/i });
		await user.click(submitButton);

		const errorAlert = await screen.findByText("Title is required");
		expect(errorAlert).toBeInTheDocument();
	});
});
