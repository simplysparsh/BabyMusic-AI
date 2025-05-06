-- Function to reset generation count if baby_name changes
CREATE OR REPLACE FUNCTION public.reset_generation_count_on_baby_name_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if baby_name is being updated and its value is actually changing
  -- Also ensures baby_name is not null, although the table constraint should handle that.
  -- We only reset if the user is NOT premium.
  IF NEW.baby_name IS DISTINCT FROM OLD.baby_name AND OLD.is_premium IS FALSE THEN
    -- Reset generation_count to 0 for the updated row
    NEW.generation_count = 0;

    -- Log the action (optional, but helpful for debugging)
    RAISE LOG 'Reset generation count for non-premium profile % due to baby name change from "%" to "%".', NEW.id, OLD.baby_name, NEW.baby_name;
  END IF;

  -- Return the modified row to be inserted/updated
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the authenticated role (or the role that performs updates)
-- Adjust 'authenticated' if your app uses a different role for profile updates.
GRANT EXECUTE ON FUNCTION public.reset_generation_count_on_baby_name_change() TO authenticated;

-- Trigger to execute the function before updating the profiles table
-- Drop trigger first if it exists to make the script idempotent
DROP TRIGGER IF EXISTS trg_reset_generation_count_on_baby_name_change ON public.profiles;

-- Create the trigger
CREATE TRIGGER trg_reset_generation_count_on_baby_name_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.reset_generation_count_on_baby_name_change();

-- Optional: Comment explaining the trigger
COMMENT ON TRIGGER trg_reset_generation_count_on_baby_name_change ON public.profiles
  IS 'Resets the generation_count to 0 for non-premium users whenever the baby_name is updated.';
