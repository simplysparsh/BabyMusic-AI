-- Add a new migration to ensure all songs have proper audio URLs
DO $$ 
BEGIN
  -- First, ensure all songs with variations have their main audio_url set
  UPDATE songs s
  SET audio_url = (
    SELECT audio_url 
    FROM song_variations sv 
    WHERE sv.song_id = s.id 
    ORDER BY sv.created_at ASC 
    LIMIT 1
  )
  WHERE EXISTS (
    SELECT 1 
    FROM song_variations sv 
    WHERE sv.song_id = s.id
  )
  AND (s.audio_url IS NULL OR s.audio_url = '');

  -- Update status for songs with audio URLs
  UPDATE songs
  SET status = 'completed'
  WHERE audio_url IS NOT NULL AND status != 'completed';

  -- Update status for variations
  UPDATE song_variations
  SET status = 'completed'
  WHERE audio_url IS NOT NULL AND status != 'completed';
END $$;