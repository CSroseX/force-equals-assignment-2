// ✅ Correct import for Auth.js v5
import NextAuth from 'next-auth';
// ✅ Import necessary types for callbacks
import { type Account, type Session, type NextAuthConfig } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https.www.googleapis.com/auth/calendar.events https.www.googleapis.com/auth/calendar.readonly',
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    // ✅ Replaced 'any' with specific types for full type safety
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    // ✅ Replaced 'any' with specific types
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.userId = token.sub; // Add user ID to the session
      return session;
    },
  },
};

// ✅ Updated to the modern Auth.js v5 syntax for exporting handlers
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);