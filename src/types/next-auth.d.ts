// src/types/next-auth.d.ts

import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    userId?: string // ✅ Add this line
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
  }
}