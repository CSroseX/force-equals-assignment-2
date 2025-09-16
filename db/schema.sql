-- Users table to store sellers and buyers
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('seller', 'buyer')) NOT NULL,
  refresh_token TEXT, -- encrypted refresh token
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) NOT NULL,
  buyer_id UUID REFERENCES users(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  title TEXT DEFAULT 'Appointment',
  description TEXT,
  event_id TEXT, -- Google Calendar event ID
  meet_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index on email for quick lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Indexes for appointments
CREATE INDEX IF NOT EXISTS idx_appointments_seller_id ON appointments(seller_id);
CREATE INDEX IF NOT EXISTS idx_appointments_buyer_id ON appointments(buyer_id);

-- Seller availability table to store manual availability JSON
CREATE TABLE IF NOT EXISTS seller_availability (
  seller_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  availability JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
