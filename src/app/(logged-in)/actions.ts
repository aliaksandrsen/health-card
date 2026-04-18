"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSession } from "@/lib/auth/get-session";
import { getRecentVisits as getRecentVisitsForUser } from "@/lib/db/visits";
import { PREVIEW_COUNT } from "./const";

export const signOutAction = async () => {
	await auth.api.signOut({
		headers: await headers(),
	});
	redirect("/login");
};

export const getRecentVisits = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const userId = Number(session.user.id);

	return getRecentVisitsForUser(userId, PREVIEW_COUNT);
};
