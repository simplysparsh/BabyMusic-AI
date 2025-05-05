// @ts-ignore: Deno environment compatibility
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
// @ts-ignore: Deno environment compatibility
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore: Deno environment compatibility
import Stripe from 'https://esm.sh/stripe@14.1.0?target=deno' // Ensure correct Deno target

// Ensure STRIPE_SECRET_KEY is set in Supabase secrets
const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  // @ts-ignore: Deno compatibility
  httpClient: Stripe.createFetchHttpClient(), 
  apiVersion: '2023-10-16', // Use a fixed API version
})

// Ensure SITE_URL is set in Supabase secrets (e.g., http://localhost:5173 or your deployed URL)
const siteUrl = Deno.env.get('SITE_URL')!

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get user data
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error('User authentication error:', userError)
      throw new Error('User not authenticated')
    }

    // Get priceId from request body
    const { priceId } = await req.json()
    if (!priceId) {
      throw new Error('Missing priceId in request body')
    }

    console.log(`Creating checkout session for user ${user.id} with price ${priceId}`)

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`, // Redirect to dashboard on success
      cancel_url: `${siteUrl}/premium?checkout=cancel`, // Redirect back to premium page on cancellation
      // IMPORTANT: Store Supabase user ID for linking in webhook
      client_reference_id: user.id, 
      // Optional: Pre-fill email
      // customer_email: user.email,
      // Optional: If you already manage Stripe customers, you can link them
      // customer: stripeCustomerId, // You'd need to fetch/create this first
    })

    if (!session.url) {
       console.error('Stripe session creation failed: No session URL returned.')
       throw new Error('Could not create checkout session.')
    }

    console.log(`Stripe session created: ${session.id} for user ${user.id}`)

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, // Use 400 for client-side errors, 500 for server-side
      }
    )
  }
})

/* 
Test command (replace with actual token, priceId, and local function URL):
curl -X POST 'http://localhost:54321/functions/v1/create-stripe-checkout' \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -d '{"priceId": "YOUR_STRIPE_PRICE_ID"}' 
*/ 