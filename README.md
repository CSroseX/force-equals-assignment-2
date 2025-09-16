# Next.js Scheduler - Google Calendar Integration

A Next.js application that allows Sellers to integrate their Google Calendar for availability and Buyers to book appointments, with events created on both participants' calendars.

## Features

- **Seller Dashboard**: Sign in with Google, integrate calendar availability
- **Buyer Portal**: Search sellers, view available slots, book appointments
- **Appointments Page**: View scheduled appointments for both roles
- **Google Calendar Integration**: Fetch availability, create events with Meet links
- **Database**: Supabase for storing users and appointments

## Tech Stack

- Next.js 15 (TypeScript)
- NextAuth.js for Google OAuth
- Google Calendar API
- Supabase (PostgreSQL)
- Tailwind CSS

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Google Cloud Console:
   - Create a project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (local) and Vercel URL
   - Set scopes: openid, email, profile, https://www.googleapis.com/auth/calendar.events, https://www.googleapis.com/auth/calendar.readonly
4. Set up Supabase:
   - Create a project
   - Run the SQL schema from `db/schema.sql`
   - Get URL and keys
5. Create `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
6. Run locally: `npm run dev`

## Deployment to Vercel

1. Push code to a public GitHub repository
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Update NEXTAUTH_URL to your Vercel domain
5. Update Google OAuth redirect URIs to include Vercel domain
6. Deploy

## Usage

- Visit the homepage and choose Seller or Buyer
- Sign in with Google (grant calendar permissions)
- Sellers: Dashboard shows integration status
- Buyers: Select seller, choose available slot, book appointment
- Appointments: View all your appointments

## Database Schema

See `db/schema.sql` for the PostgreSQL schema.

## API Routes

- `/api/auth/[...nextauth]` - Authentication
- `/api/sellers` - Get sellers
- `/api/buyers` - Save buyer
- `/api/availability/[sellerId]` - Get seller availability
- `/api/book` - Book appointment
- `/api/appointments` - Get user appointments
