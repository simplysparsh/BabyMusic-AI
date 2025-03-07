/*
  # Drop Automatic Profile Creation Trigger
  
  This migration removes the automatic trigger that creates profiles when users are created.
  This allows the application code to have full control over profile creation.
*/

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Keep the function for reference, but it won't be used automatically
-- We could drop it, but keeping it allows us to manually invoke it if needed
-- DROP FUNCTION IF EXISTS public.handle_new_user();

-- Add a comment to the function to indicate it's no longer used automatically
COMMENT ON FUNCTION public.handle_new_user() IS 'This function was previously used by a trigger to automatically create profiles. It is now kept for reference but not used automatically.'; 