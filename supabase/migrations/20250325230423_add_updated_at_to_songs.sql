-- Add updated_at column to songs table and update existing records
-- Migration file: 20250325230423_add_updated_at_to_songs.sql

-- Make migration idempotent by checking if column exists before adding it
DO $$
BEGIN
    -- Check if updated_at column already exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'songs' 
        AND column_name = 'updated_at'
    ) THEN
        -- Add the updated_at column with default value of current timestamp
        ALTER TABLE public.songs ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        
        -- Update all existing records to set updated_at equal to created_at if it exists
        UPDATE public.songs SET updated_at = created_at WHERE created_at IS NOT NULL;
        
        -- Add a comment to explain the purpose of this column
        COMMENT ON COLUMN public.songs.updated_at IS 'Timestamp indicating when the song record was last updated';
    END IF;
END
$$;

-- Check if function exists before creating it
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Make trigger creation idempotent
DO $$
BEGIN
    -- Check if trigger already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_songs_updated_at' 
        AND tgrelid = 'public.songs'::regclass
    ) THEN
        -- Create the trigger if it doesn't exist
        CREATE TRIGGER update_songs_updated_at
        BEFORE UPDATE ON public.songs
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$; 