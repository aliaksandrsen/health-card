"use server";

import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import prisma from "@/lib/prisma";
import { PREVIEW_COUNT } from "./const";

export const signOutAction = async () => {
	await signOut({ redirectTo: "/login" });
};

export const getRecentVisits = async () => {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	const userId = +session.user.id;

	return prisma.visit.findMany({
		orderBy: { createdAt: "desc" },
		take: PREVIEW_COUNT,
		where: { userId },
	});
};
