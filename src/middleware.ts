import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(_req) {
    // Add custom middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/seller/:path*', '/buyer/:path*', '/appointments/:path*'],
}
