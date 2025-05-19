-- Add has_installed_pwa boolean column to profiles table, idempotently
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='has_installed_pwa'
  ) THEN
    ALTER TABLE profiles ADD COLUMN has_installed_pwa boolean DEFAULT false;
  END IF;
END $$;
