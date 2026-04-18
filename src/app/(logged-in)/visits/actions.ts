"use server";

import { redirect } from "next/navigation";
import z from "zod";
import { getSession } from "@/lib/auth/get-session";
import {
	createVisit as createVisitRecord,
	deleteVisit as deleteVisitRecord,
	getVisitById,
	listVisits,
	updateVisit as updateVisitRecord,
} from "@/lib/db/visits";

type FetchVisitsInput = {
	skip: number;
	take: number;
};

export const fetchVisits = async ({ skip, take }: FetchVisitsInput) => {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const userId = Number(session.user.id);

	return listVisits({ skip, take, userId });
};

export const getVisit = async (visitId: number) => {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const userId = Number(session.user.id);

	return getVisitById(visitId, userId);
};

const visitSchema = z.object({
	title: z
		.string("Title should be a string")
		.trim()
		.min(1, "Title is required")
		.max(100, "Title must be 100 characters or less"),
	content: z
		.string("Content should be a string")
		.trim()
		.min(1, "Content is required")
		.max(5000, "Content must be 5000 characters or less"),
});

export type State = {
	errors?: {
		title?: string;
		content?: string;
		form?: string;
	};
};

export const createVisit = async (
	prevState: State,
	formData: FormData,
): Promise<State> => {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const validatedFields = visitSchema.safeParse({
		title: formData.get("title"),
		content: formData.get("content"),
	});

	if (!validatedFields.success) {
		const tree = z.treeifyError(validatedFields.error);
		const errors: State["errors"] = {};
		const titleErrors = tree.properties?.title?.errors;
		const contentErrors = tree.properties?.content?.errors;

		if (titleErrors?.length) {
			errors.title = titleErrors[0];
		}

		if (contentErrors?.length) {
			errors.content = contentErrors[0];
		}

		return { ...prevState, errors };
	}

	const { title, content } = validatedFields.data;
	const userId = Number(session.user.id);

	try {
		await createVisitRecord({
			title,
			content,
			userId,
		});
	} catch {
		return {
			...prevState,
			errors: {
				form: "Unable to create the visit right now. Please try again.",
			},
		};
	}

	redirect("/visits");
};

export const updateVisit = async (
	visitId: number,
	prevState: State,
	formData: FormData,
): Promise<State> => {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const validatedFields = visitSchema.safeParse({
		title: formData.get("title"),
		content: formData.get("content"),
	});

	if (!validatedFields.success) {
		const tree = z.treeifyError(validatedFields.error);
		const errors: State["errors"] = {};
		const titleErrors = tree.properties?.title?.errors;
		const contentErrors = tree.properties?.content?.errors;

		if (titleErrors?.length) {
			errors.title = titleErrors[0];
		}

		if (contentErrors?.length) {
			errors.content = contentErrors[0];
		}

		return { ...prevState, errors };
	}

	const { title, content } = validatedFields.data;
	const userId = Number(session.user.id);

	try {
		const updated = await updateVisitRecord(visitId, {
			title,
			content,
			userId,
		});

		if (!updated) {
			return {
				...prevState,
				errors: {
					form: "Visit not found.",
				},
			};
		}
	} catch {
		return {
			...prevState,
			errors: {
				form: "Unable to update the visit right now. Please try again.",
			},
		};
	}

	redirect(`/visits/${visitId}`);
};

export const deleteVisit = async (visitId: number) => {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const userId = Number(session.user.id);

	await deleteVisitRecord(visitId, userId);

	redirect("/visits");
};
