import { handlers } from '@/auth';
export const { GET, POST } = handlers;

// declare module 'next-auth' {
//   interface Session {
//     user: { id: string; name: string; email: string };
//     // user: { id: string };
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string;
//   }
// }
