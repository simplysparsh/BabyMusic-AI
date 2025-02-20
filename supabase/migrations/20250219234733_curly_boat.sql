/*
  # Add theme column to songs table

  1. Changes
    - Add theme column to songs table to support theme-based song generation
    - Make theme column nullable since it's only required for theme-based songs
    - Add check constraint to ensure valid theme values

  2. Notes
    - Theme is only required for theme-based songs, not custom songs
    - Themes are predefined in the application code
*/

DO $$ 
BEGIN
  -- Add theme column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'theme'
  ) THEN
    ALTER TABLE songs ADD COLUMN theme text;

    -- Add check constraint for valid themes
    ALTER TABLE songs ADD CONSTRAINT valid_theme CHECK (
      theme IN (
        'pitchDevelopment',
        'cognitiveSpeech',
        'sleepRegulation',
        'socialEngagement',
        'musicalDevelopment',
        'indianClassical',
        'westernClassical',
        'custom'
      ) OR theme IS NULL
    );
  END IF;
END $$;