import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import NextAuth, { type User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'name' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error('Incorrect credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password as string,
          user.password ?? '',
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
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
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, id: token.id ?? user?.id };
    },
    async session({ session, token }) {
      // Ensure required fields on session.user per module augmentation
      const user = {
        id: (token.id as string) ?? '',
        name: session.user?.name ?? '',
        email: session.user?.email ?? '',
        image: session.user?.image ?? null,
      };
      return { ...session, user };
    },
  },
});
