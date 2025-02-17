-- Delete the test user and all associated data
DO $$ 
BEGIN
  -- First delete song variations for this user's songs
  DELETE FROM public.song_variations
  WHERE song_id IN (
    SELECT s.id 
    FROM public.songs s
    WHERE s.user_id IN (
      SELECT id 
      FROM auth.users 
      WHERE email = 'test@test.com'
    )
  );

  -- Then delete songs
  DELETE FROM public.songs 
  WHERE user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'test@test.com'
  );

  -- Then delete profile
  DELETE FROM public.profiles
  WHERE id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'test@test.com'
  );

  -- Finally delete the user
  DELETE FROM auth.users
  WHERE email = 'test@test.com';
END $$;