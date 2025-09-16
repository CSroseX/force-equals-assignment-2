# Next.js Scheduler - Google Calendar Integration

A Next.js application for Sellers and Buyers to manage appointments via Google Calendar.

## Features

- Seller Dashboard: Integrate Google account, expose calendar availability
- Buyer Booking: Search sellers, view available slots, book appointments
- Appointments View: See scheduled appointments
- Google Calendar Integration: Events created on both calendars

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API and Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (for local) and your Vercel URL
   - Scopes: Include `openid`, `email`, `profile`, `https://www.googleapis.com/auth/calendar.events`, `https://www.googleapis.com/auth/calendar.readonly`

### 2. Supabase Setup

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to SQL Editor and run the schema from `db/schema.sql`
4. Get your project URL and anon key from Settings > API

### 3. Environment Variables

Update `.env.local` with your values:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Locally

```bash
npm run dev
```

### 6. Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Usage

- Sellers: Sign in with Google, grant calendar permissions
- Buyers: Sign in, search sellers, book appointments
- Both: View appointments in the Appointments tab
