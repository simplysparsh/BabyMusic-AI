-- Add stripe_customer_id column idempotently
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                WHERE table_schema='public' AND table_name='profiles' AND column_name='stripe_customer_id') THEN
    ALTER TABLE public.profiles ADD COLUMN stripe_customer_id TEXT;
  END IF;
END;
$$;

-- Add unique constraint idempotently
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM pg_constraint 
                WHERE conname = 'profiles_stripe_customer_id_key' AND conrelid = 'public.profiles'::regclass) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_stripe_customer_id_key UNIQUE (stripe_customer_id);
  END IF;
END;
$$;

-- Add a comment for clarity (COMMENT ON is idempotent by itself)
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stores the Stripe Customer ID (cus_...) associated with this user profile.';
