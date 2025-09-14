import CredentialsProvider from 'next-auth/providers/credentials';
import { type NextAuthOptions, type User as NextAuthUser } from 'next-auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'name' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          const created = await prisma.user.create({
            data: {
              name: credentials.name ?? credentials.email,
              email: credentials.email,
              password: await bcrypt.hash(credentials.password, 10),
            },
          });
          const authUser: NextAuthUser = {
            id: created.id.toString(),
            name: created.name ?? undefined,
            email: created.email,
          };
          return authUser;
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password ?? ''
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        const authUser: NextAuthUser = {
          id: user.id.toString(),
          name: user.name ?? undefined,
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
      return { ...session, user: { ...session.user, id: token.id } };
    },
  },
} satisfies NextAuthOptions;
