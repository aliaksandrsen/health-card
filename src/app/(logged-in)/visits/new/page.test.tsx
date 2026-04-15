import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockedCreateVisit } = vi.hoisted(() => ({
	mockedCreateVisit: vi.fn(),
}));

vi.mock("../actions", () => ({
	createVisit: mockedCreateVisit,
}));

type RenderOptions = {
	state?: {
		errors: {
			title?: string;
			content?: string;
			form?: string;
		};
	};
	isPending?: boolean;
};

async function renderPage(options: RenderOptions = {}) {
	vi.resetModules();

	vi.doMock("react", async () => {
		const actual = await vi.importActual<typeof import("react")>("react");

		if (!options.state && options.isPending === undefined) {
			return actual;
		}

		return {
			...actual,
			useActionState: vi.fn(() => [
				options.state ?? { errors: {} },
				vi.fn(),
				options.isPending ?? false,
			]),
		};
	});

	const { default: NewVisit } = await import("./page");

	return render(<NewVisit />);
}

describe("NewVisit page", () => {
	afterEach(() => {
		cleanup();
		vi.doUnmock("react");
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("renders a form to create a visit", async () => {
		await renderPage();

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

	it("renders field and form errors with accessible attributes", async () => {
		await renderPage({
			state: {
				errors: {
					title: "Title is required",
					content: "Content is required",
					form: "Unable to create visit",
				},
			},
		});

		const titleInput = screen.getByLabelText(/title/i);
		expect(titleInput).toHaveAttribute("aria-invalid", "true");
		expect(titleInput).toHaveAttribute("aria-describedby", "title-error");
		expect(screen.getByText("Title is required")).toHaveAttribute(
			"id",
			"title-error",
		);

		const contentTextarea = screen.getByLabelText(/content/i);
		expect(contentTextarea).toHaveAttribute("aria-invalid", "true");
		expect(contentTextarea).toHaveAttribute(
			"aria-describedby",
			"content-error",
		);
		expect(screen.getByText("Content is required")).toHaveAttribute(
			"id",
			"content-error",
		);

		expect(screen.getByText("Unable to create visit")).toBeInTheDocument();
		expect(screen.getAllByRole("alert")).toHaveLength(3);
	});

	it("disables submit button while the action is pending", async () => {
		await renderPage({ isPending: true });

		expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled();
	});

	it("submits the form data via createVisit action", async () => {
		const user = userEvent.setup();
		await renderPage();
		mockedCreateVisit.mockResolvedValueOnce({ errors: {} });

		await user.type(screen.getByLabelText(/title/i), "Follow-up");
		await user.type(screen.getByLabelText(/content/i), "Discuss lab results");
		await user.click(screen.getByRole("button", { name: /create visit/i }));

		expect(mockedCreateVisit).toHaveBeenCalledTimes(1);
		const [prevState, submittedFormData] =
			mockedCreateVisit.mock.calls[0] ?? [];

		expect(prevState).toEqual({ errors: {} });
		expect(submittedFormData).toBeInstanceOf(FormData);
		expect(submittedFormData?.get("title")).toBe("Follow-up");
		expect(submittedFormData?.get("content")).toBe("Discuss lab results");
	});
});
