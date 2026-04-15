import { eq } from "drizzle-orm";
import db from "@/lib/drizzle";
import { users, type User } from "@/lib/db/schema";

export class DuplicateEmailError extends Error {
	constructor() {
		super("Duplicate email");
		this.name = "DuplicateEmailError";
	}
}

const isUniqueViolation = (error: unknown) => {
	if (typeof error !== "object" || error === null || !("code" in error)) {
		return false;
	}

	return error.code === "23505";
};

type CreateUserInput = {
	email: string;
	name: string;
	password: string;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	return user ?? null;
};

export const createUser = async ({
	email,
	name,
	password,
}: CreateUserInput): Promise<User> => {
	try {
		const [user] = await db
			.insert(users)
			.values({
				email,
				name,
				password,
			})
			.returning();

		return user;
	} catch (error) {
		if (isUniqueViolation(error)) {
			throw new DuplicateEmailError();
		}

		throw error;
	}
};
