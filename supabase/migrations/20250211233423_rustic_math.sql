/*
  # Fix Profile RLS Policies
  
  1. Changes
    - Drop existing RLS policies for profiles table
    - Add new policies that properly handle profile creation and updates
    - Ensure authenticated users can manage their own profiles
  
  2. Security
    - Maintains data isolation between users
    - Allows profile creation for new users
    - Restricts profile access to owners only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies with proper permissions
CREATE POLICY "Users can manage own profile"
  ON profiles
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow profile creation during signup
CREATE POLICY "Users can create their profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;