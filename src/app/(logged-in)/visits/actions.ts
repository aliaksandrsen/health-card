"use server";

import { redirect } from "next/navigation";
import z from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

type FetchVisitsInput = {
	skip: number;
	take: number;
};

export const fetchVisits = async ({ skip, take }: FetchVisitsInput) => {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	const userId = +session.user.id;

	const [visits, totalVisits] = await Promise.all([
		prisma.visit.findMany({
			skip,
			take,
			orderBy: { createdAt: "desc" },
			where: { userId },
		}),
		prisma.visit.count({
			where: { userId },
		}),
	]);

	return { visits, totalVisits };
};

export const getVisit = async (visitId: number) => {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	const userId = +session.user.id;

	return prisma.visit.findFirst({
		where: { id: visitId, userId },
	});
};

const createVisitSchema = z.object({
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
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	const validatedFields = createVisitSchema.safeParse({
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
	const userId = +session.user.id;

	try {
		await prisma.visit.create({
			data: {
				title,
				content,
				userId,
			},
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

export const deleteVisit = async (visitId: number) => {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	const userId = +session.user.id;

	await prisma.visit.delete({
		where: {
			id: visitId,
			userId,
		},
	});

	redirect("/visits");
};
