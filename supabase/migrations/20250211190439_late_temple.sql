DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preset_songs_generated'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preset_songs_generated boolean DEFAULT false;
  END IF;
END $$;