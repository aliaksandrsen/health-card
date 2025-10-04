import bcrypt from "bcrypt";
import NextAuth, { type User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { authConfig } from "../auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	providers: [
		CredentialsProvider({
			authorize: async (credentials) => {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Invalid credentials");
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email as string },
				});

				if (!user) {
					throw new Error("Incorrect credentials");
				}

				const isCorrectPassword = await bcrypt.compare(
					credentials.password as string,
					user.password ?? "",
				);

				if (!isCorrectPassword) {
					throw new Error("Invalid credentials");
				}

				const authUser: NextAuthUser = {
					id: user.id.toString(),
					name: user.name,
					email: user.email,
				};
				return authUser;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			// User is available during sign-in
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id as string;

			return session;
		},
		...authConfig.callbacks,
	},
});
