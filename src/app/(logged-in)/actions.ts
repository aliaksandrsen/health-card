"use server";

import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getRecentVisits as getRecentVisitsForUser } from "@/lib/db/visits";
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

	return getRecentVisitsForUser(userId, PREVIEW_COUNT);
};
