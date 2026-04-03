-- URL Shortener Database Schema for Supabase

-- Create the shortened_urls table
CREATE TABLE IF NOT EXISTS shortened_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on short_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_short_code ON shortened_urls(short_code);

-- Enable Row Level Security (RLS)
ALTER TABLE shortened_urls ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all shortened URLs
CREATE POLICY "Public URLs are viewable by everyone"
ON shortened_urls FOR SELECT
TO public
USING (true);

-- Allow public insert access
CREATE POLICY "Anyone can create shortened URLs"
ON shortened_urls FOR INSERT
TO public
WITH CHECK (true);

-- Allow public update access (for incrementing clicks)
CREATE POLICY "Anyone can update shortened URLs"
ON shortened_urls FOR UPDATE
TO public
USING (true);
