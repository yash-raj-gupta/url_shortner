-- URL Shortener Database Schema Update for Supabase
-- Run this in Supabase SQL Editor

-- 1. Add user_id column to existing table
ALTER TABLE shortened_urls ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 2. Create index for user lookups
CREATE INDEX idx_user_id ON shortened_urls(user_id);

-- 3. Enable RLS if not already enabled
ALTER TABLE shortened_urls ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies (if any)
DROP POLICY IF EXISTS "Public URLs are viewable by everyone" ON shortened_urls;
DROP POLICY IF EXISTS "Anyone can create shortened URLs" ON shortened_urls;
DROP POLICY IF EXISTS "Anyone can update shortened URLs" ON shortened_urls;

-- 5. Create new RLS policies

-- Allow public read access (for redirects)
CREATE POLICY "Public URLs are viewable by everyone"
ON shortened_urls FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert their own URLs
CREATE POLICY "Users can create URLs"
ON shortened_urls FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow anonymous users to create URLs (user_id will be NULL)
CREATE POLICY "Anonymous can create URLs"
ON shortened_urls FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Allow authenticated users to update their own URLs
CREATE POLICY "Users can update their URLs"
ON shortened_urls FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Allow anonymous updates for click tracking (on URLs with no user_id)
CREATE POLICY "Anonymous can update for clicks"
ON shortened_urls FOR UPDATE
TO anon
USING (user_id IS NULL);

-- Allow authenticated users to delete their own URLs
CREATE POLICY "Users can delete their URLs"
ON shortened_urls FOR DELETE
TO authenticated
USING (user_id = auth.uid());
