import bcrypt from "bcrypt";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import db from "@/lib/drizzle";
import { accounts, sessions, users, verifications } from "@/lib/db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			users,
			session: sessions,
			account: accounts,
			verification: verifications,
			user: users,
		},
	}),
	appName: "Health Card",
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [nextCookies()],
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		minPasswordLength: 4,
		password: {
			hash: async (password) => bcrypt.hash(password, 10),
			verify: async ({ hash, password }) => bcrypt.compare(password, hash),
		},
	},
	user: {
		modelName: "users",
		additionalFields: {
			password: {
				type: "string",
				required: false,
				input: false,
			},
		},
	},
	account: {
		modelName: "account",
	},
	session: {
		modelName: "session",
	},
	verification: {
		modelName: "verification",
	},
	advanced: {
		database: {
			generateId: ({ model }) => {
				if (model === "user" || model === "users") {
					return false;
				}

				return crypto.randomUUID();
			},
		},
	},
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession["user"];
