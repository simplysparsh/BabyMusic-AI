-- Delete the test user and all associated data
DO $$ 
BEGIN
  -- First delete song variations for this user's songs
  DELETE FROM public.song_variations
  WHERE song_id IN (
    SELECT s.id 
    FROM public.songs s
    WHERE s.user_id = '3a8b4aea-8542-46b6-b97a-bbb2a2e042fa'
  );

  -- Then delete songs
  DELETE FROM public.songs 
  WHERE user_id = '3a8b4aea-8542-46b6-b97a-bbb2a2e042fa';

  -- Then delete profile
  DELETE FROM public.profiles
  WHERE id = '3a8b4aea-8542-46b6-b97a-bbb2a2e042fa';

  -- Finally delete the user
  DELETE FROM auth.users
  WHERE id = '3a8b4aea-8542-46b6-b97a-bbb2a2e042fa';
END $$;