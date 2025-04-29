CREATE OR REPLACE FUNCTION public.update_user_streak (user_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today DATE := CURRENT_DATE;
  last_active DATE;
  current_streak_val INT;
BEGIN
  -- Get current values for the user
  SELECT
    p.current_streak,
    p.last_active_date
  INTO
    current_streak_val,
    last_active
  FROM public.profiles p
  WHERE p.id = user_id_input;

  -- If profile not found, exit (shouldn't happen in normal flow)
  IF NOT FOUND THEN
    RAISE WARNING 'Profile not found for user_id: % in update_user_streak', user_id_input;
    RETURN;
  END IF;

  -- Initialize streak if null (shouldn't happen with default 0, but good practice)
  IF current_streak_val IS NULL THEN
    current_streak_val := 0;
  END IF;

  -- Check if already active today
  IF last_active = today THEN
    -- Already active today, do nothing to streak, just ensure date is set
    -- (This check prevents multiple increments on the same day)
    UPDATE public.profiles
    SET last_active_date = today
    WHERE id = user_id_input;
    RETURN;
  END IF;

  -- Check if the streak continues from yesterday
  IF last_active = today - INTERVAL '1 day' THEN
    -- Streak continues, increment
    current_streak_val := current_streak_val + 1;
  ELSE
    -- Streak is broken or new, reset to 1
    current_streak_val := 1;
  END IF;

  -- Update the profile with new streak and today's date
  UPDATE public.profiles
  SET
    current_streak = current_streak_val,
    last_active_date = today
  WHERE id = user_id_input;

END;
$$;

COMMENT ON FUNCTION public.update_user_streak(uuid) IS 'Updates the user daily streak count based on activity. Sets last_active_date to today and increments/resets current_streak.';

-- Grant execute permission (adjust role as needed, e.g., authenticated)
GRANT EXECUTE ON FUNCTION public.update_user_streak(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_streak(uuid) TO service_role; -- Needed if called from triggers/other functions 