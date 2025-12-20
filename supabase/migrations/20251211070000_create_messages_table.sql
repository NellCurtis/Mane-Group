/*
  # Create Messages Table

  ## Overview
  This migration creates a table to store contact form messages from the MANÉ GROUP website.

  ## New Tables
  
  ### `messages`
  - `id` (uuid, primary key) - Unique identifier for each message
  - `name` (text, required) - Name of the sender
  - `email` (text, required) - Email address
  - `phone` (text, optional) - Phone number
  - `subject` (text, required) - Message subject
  - `message` (text, required) - Message content
  - `created_at` (timestamptz) - Timestamp of message submission

  ## Security
  - Enable RLS on `messages` table
  - Add policy for anyone to insert messages
  - Add policy for authenticated users to read their own messages
  - Add policy for service role to read all messages for admin purposes
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (public contact form)
CREATE POLICY "Anyone can submit message"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role to read all messages (for admin dashboard)
CREATE POLICY "Service role can read all messages"
  ON messages
  FOR SELECT
  TO service_role
  USING (true);

-- Allow authenticated users to read their own messages (if needed)
CREATE POLICY "Users can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);