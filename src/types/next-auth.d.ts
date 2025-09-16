import 'next-auth';
import 'next-auth/jwt';

// By declaring an interface with the same name, we can "augment" or extend the default types.

declare module 'next-auth' {
  /**
   * Extends the built-in session type to include our custom properties.
   */
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT type to include our custom properties.
   */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}