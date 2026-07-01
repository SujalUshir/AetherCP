-- schema.sql
-- AetherCP Supabase cloud backup table schema
-- Run this in your Supabase SQL Editor to initialize the database table and RLS policies.

CREATE TABLE IF NOT EXISTS public.user_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  data JSONB NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if any
DROP POLICY IF EXISTS "Users can read their own user data." ON public.user_data;
DROP POLICY IF EXISTS "Users can insert their own user data." ON public.user_data;
DROP POLICY IF EXISTS "Users can update their own user data." ON public.user_data;

-- Authenticated users can only read their own row
CREATE POLICY "Users can read their own user data."
  ON public.user_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can only insert their own row
CREATE POLICY "Users can insert their own user data."
  ON public.user_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can only update their own row
CREATE POLICY "Users can update their own user data."
  ON public.user_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
