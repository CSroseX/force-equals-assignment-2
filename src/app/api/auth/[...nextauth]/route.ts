import NextAuth from 'next-auth';
import { type Account, type Session } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

// Define extended types
interface ExtendedSession extends Session {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
}

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
}

export const authOptions = {
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
      const extendedToken = token as ExtendedJWT;
      if (account) {
        extendedToken.accessToken = account.access_token;
        extendedToken.refreshToken = account.refresh_token;
      }
      return extendedToken;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const extendedToken = token as ExtendedJWT;
      const extendedSession = session as ExtendedSession;
      
      extendedSession.accessToken = extendedToken.accessToken;
      extendedSession.refreshToken = extendedToken.refreshToken;
      extendedSession.userId = extendedToken.sub;
      
      return extendedSession;
    },
  },
};

const nextAuth = NextAuth(authOptions);
export const { handlers, auth, signIn, signOut } = nextAuth;
export const { GET, POST } = handlers;