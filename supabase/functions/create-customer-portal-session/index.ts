// @ts-ignore: Deno environment compatibility
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
// @ts-ignore: Deno environment compatibility
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore: Deno environment compatibility
import Stripe from 'https://esm.sh/stripe@14.1.0?target=deno'

// Ensure STRIPE_SECRET_KEY is set in Supabase secrets
const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  // @ts-ignore: Deno compatibility
  httpClient: Stripe.createFetchHttpClient(), 
  apiVersion: '2023-10-16',
})

// Ensure SITE_URL is set in Supabase secrets (used for return URL)
const siteUrl = Deno.env.get('SITE_URL')!

// Get the Supabase admin client for reading profile data (stripe_customer_id)
// Requires SUPABASE_SERVICE_ROLE_KEY env var
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Get User from JWT
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user }, error: userError } = await userSupabaseClient.auth.getUser()
    if (userError || !user) {
      console.error('User authentication error:', userError)
      throw new Error('User not authenticated')
    }

    // 2. Retrieve User's Stripe Customer ID from Profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error(`Error fetching profile for user ${user.id}:`, profileError)
      throw new Error('Could not retrieve profile information.')
    }
    if (!profile?.stripe_customer_id) {
      console.error(`User ${user.id} does not have a Stripe Customer ID.`);
      // This could happen if checkout completed but webhook failed to save ID, or non-premium user somehow calls this
      throw new Error('Subscription information not found.')
    }

    const stripeCustomerId = profile.stripe_customer_id
    console.log(`Creating customer portal session for user ${user.id}, customer ${stripeCustomerId}`)

    // 3. Create a Stripe Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${siteUrl}/dashboard`, // URL user returns to after leaving portal
    });

    if (!portalSession.url) {
      console.error('Stripe portal session creation failed: No session URL returned.');
      throw new Error('Could not create customer portal session.');
    }

    console.log(`Stripe portal session created: ${portalSession.id} for user ${user.id}`);

    // 4. Return the session URL
    return new Response(
      JSON.stringify({ url: portalSession.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating Stripe customer portal session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'User not authenticated' ? 401 : 500, // Use 401 for auth, 500 for others
      }
    )
  }
}) 