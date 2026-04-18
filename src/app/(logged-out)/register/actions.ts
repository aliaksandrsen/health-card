"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";
import { passwordMatchSchema } from "@/app/validation/passwordMatchSchema";

const newUserSchema = z
	.object({
		email: z.email(),
		name: z.string().min(2).max(20),
	})
	.and(passwordMatchSchema);

export const registerUser = async ({
	email,
	name,
	password,
	passwordConfirm,
}: {
	email: string;
	name: string;
	password: string;
	passwordConfirm: string;
}) => {
	try {
		const newUserValues = newUserSchema.safeParse({
			email,
			name,
			password,
			passwordConfirm,
		});

		if (!newUserValues.success) {
			return {
				error: newUserValues.error.issues[0]?.message ?? "An error occurred",
			};
		}

		await auth.api.signUpEmail({
			body: {
				name: newUserValues.data.name,
				email: newUserValues.data.email,
				password: newUserValues.data.password,
			},
			headers: await headers(),
		});
	} catch (error: unknown) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
		) {
			return {
				error: "An account is already registered with this email address",
			};
		}

		return {
			error: "An error occurred.",
		};
	}
};
