/*
  # Allow NULL Values for Gender in Profiles Table

  1. Changes
    - Remove NOT NULL constraint from gender column
    - Update gender_check constraint to allow NULL values
  
  2. Reason
    - Allow users to skip providing gender information
*/

-- First, drop the existing gender_check constraint
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS gender_check;

-- Re-add the constraint to allow NULL values
ALTER TABLE profiles
ADD CONSTRAINT gender_check CHECK (gender IS NULL OR gender IN ('boy', 'girl', 'other'));

-- Remove the NOT NULL constraint from the gender column
ALTER TABLE profiles
ALTER COLUMN gender DROP NOT NULL; 