import { google } from 'googleapis'
import { supabase } from './supabase'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
)

export async function getAuthenticatedClient(userEmail: string) {
  // Get refresh token from DB
  const { data, error } = await supabase
    .from('users')
    .select('refresh_token')
    .eq('email', userEmail)
    .single()

  if (error || !data?.refresh_token) {
    throw new Error('Refresh token not found')
  }

  oauth2Client.setCredentials({
    refresh_token: data.refresh_token,
  })

  // Refresh access token
  const { credentials } = await oauth2Client.refreshAccessToken()
  oauth2Client.setCredentials(credentials)

  return oauth2Client
}

export const calendar = google.calendar({ version: 'v3' })
