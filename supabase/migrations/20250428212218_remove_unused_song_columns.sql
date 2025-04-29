-- Migration to remove unused columns from the songs table (Idempotent)

DO $$
BEGIN
    -- Drop the generated_lyrics column if it exists
    ALTER TABLE songs
    DROP COLUMN IF EXISTS generated_lyrics;

    -- Drop the instrument column if it exists
    ALTER TABLE songs
    DROP COLUMN IF EXISTS instrument;

    -- Drop the lyrics column if it exists
    ALTER TABLE songs
    DROP COLUMN IF EXISTS lyrics;
END $$; 