"use server";

import { headers } from "next/headers";
import z from "zod";
import { auth } from "@/auth";

export const loginWithCredentials = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const loginSchema = z.object({
		email: z.email(),
		password: z.string().min(4),
	});

	const loginValidation = loginSchema.safeParse({
		email,
		password,
	});

	if (!loginValidation.success) {
		return {
			error: loginValidation.error.issues[0]?.message ?? "An error occurred",
		};
	}

	try {
		await auth.api.signInEmail({
			body: {
				email: loginValidation.data.email,
				password: loginValidation.data.password,
			},
			headers: await headers(),
		});
	} catch (error: unknown) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			error.code === "INVALID_EMAIL_OR_PASSWORD"
		) {
			return {
				error: "Incorrect email or password",
			};
		}

		return {
			error: "Incorrect email or password",
		};
	}
};
