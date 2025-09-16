import NextAuth from 'next-auth';
import { type NextAuthConfig, type Account, type Session } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.userId = token.sub; // Add user ID to the session
      return session;
    },
  },
};

const { handlers } = NextAuth(authOptions);

// Explicitly export the GET and POST methods from the handlers object
export const { GET, POST } = handlers;