"use server";

import { hash } from "bcrypt";
import { z } from "zod";
import { passwordMatchSchema } from "@/app/validation/passwordMatchSchema";
import { createUser, DuplicateEmailError } from "@/lib/db/users";

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

		const hashedPassword = await hash(password, 10);

		await createUser({
			name: newUserValues.data.name,
			email: newUserValues.data.email,
			password: hashedPassword,
		});
	} catch (e: unknown) {
		if (e instanceof DuplicateEmailError) {
			return {
				error: "An account is already registered with this email address",
			};
		}
		return {
			error: "An error occurred.",
		};
	}
};
