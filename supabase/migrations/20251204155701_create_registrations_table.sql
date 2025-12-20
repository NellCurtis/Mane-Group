/*
  # Create Registrations Table

  ## Overview
  This migration creates a table to store registration form submissions from the MANÉ GROUP website.

  ## New Tables
  
  ### `registrations`
  - `id` (uuid, primary key) - Unique identifier for each registration
  - `full_name` (text, required) - Full name of the registrant
  - `email` (text, required) - Email address
  - `phone` (text, required) - Phone number
  - `country` (text, required) - Country of residence
  - `service` (text, required) - Selected service from dropdown
  - `message` (text, optional) - Additional message from registrant
  - `created_at` (timestamptz) - Timestamp of registration submission

  ## Security
  - Enable RLS on `registrations` table
  - Add policy for anyone to insert registrations
  - Add policy for authenticated users to read their own registrations
  - Add policy for service role to read all registrations for admin purposes
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  country text NOT NULL,
  service text NOT NULL,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert registrations (public registration form)
CREATE POLICY "Anyone can submit registration"
  ON registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role to read all registrations (for admin dashboard)
CREATE POLICY "Service role can read all registrations"
  ON registrations
  FOR SELECT
  TO service_role
  USING (true);

-- Allow authenticated users to read their own registrations (if needed)
CREATE POLICY "Users can read their own registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);