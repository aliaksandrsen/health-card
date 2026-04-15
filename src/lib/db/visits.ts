import { and, count, desc, eq } from "drizzle-orm";
import db from "@/lib/drizzle";
import { visits, type Visit } from "@/lib/db/schema";

type ListVisitsInput = {
	skip: number;
	take: number;
	userId: number;
};

type MutateVisitInput = {
	content: string;
	title: string;
	userId: number;
};

export const getRecentVisits = async (
	userId: number,
	take: number,
): Promise<Visit[]> => {
	return db
		.select()
		.from(visits)
		.where(eq(visits.userId, userId))
		.orderBy(desc(visits.createdAt))
		.limit(take);
};

export const listVisits = async ({
	skip,
	take,
	userId,
}: ListVisitsInput): Promise<{ totalVisits: number; visits: Visit[] }> => {
	const [visitRows, totalRows] = await Promise.all([
		db
			.select()
			.from(visits)
			.where(eq(visits.userId, userId))
			.orderBy(desc(visits.createdAt))
			.offset(skip)
			.limit(take),
		db.select({ value: count() }).from(visits).where(eq(visits.userId, userId)),
	]);

	return {
		totalVisits: totalRows[0]?.value ?? 0,
		visits: visitRows,
	};
};

export const getVisitById = async (
	visitId: number,
	userId: number,
): Promise<Visit | null> => {
	const [visit] = await db
		.select()
		.from(visits)
		.where(and(eq(visits.id, visitId), eq(visits.userId, userId)))
		.limit(1);

	return visit ?? null;
};

export const createVisit = async ({
	content,
	title,
	userId,
}: MutateVisitInput): Promise<Visit> => {
	const [visit] = await db
		.insert(visits)
		.values({
			content,
			title,
			userId,
		})
		.returning();

	return visit;
};

export const updateVisit = async (
	visitId: number,
	{ content, title, userId }: MutateVisitInput,
): Promise<boolean> => {
	const [visit] = await db
		.update(visits)
		.set({
			content,
			title,
		})
		.where(and(eq(visits.id, visitId), eq(visits.userId, userId)))
		.returning({ id: visits.id });

	return Boolean(visit);
};

export const deleteVisit = async (
	visitId: number,
	userId: number,
): Promise<boolean> => {
	const [visit] = await db
		.delete(visits)
		.where(and(eq(visits.id, visitId), eq(visits.userId, userId)))
		.returning({ id: visits.id });

	return Boolean(visit);
};
