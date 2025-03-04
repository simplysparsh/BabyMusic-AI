/*
  # Add Gender to Profiles Table

  1. Changes
    - Add gender column to profiles table
    - Add CHECK constraint to ensure gender is 'boy', 'girl', or 'other'
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add gender column to profiles table if it doesn't exist
DO $$ 
BEGIN
  -- Add gender if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender text;
    
    -- Add CHECK constraint to ensure valid values
    ALTER TABLE profiles ADD CONSTRAINT gender_check CHECK (gender IN ('boy', 'girl', 'other'));
  END IF;
END $$; 