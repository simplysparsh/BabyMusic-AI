// @ts-ignore: Deno environment compatibility
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
// @ts-ignore: Deno environment compatibility
import Stripe from 'https://esm.sh/stripe@14.1.0?target=deno'
// @ts-ignore: Deno environment compatibility
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  // @ts-ignore: Deno compatibility
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2023-10-16',
})

// Get the Supabase admin client for updating DB
// Requires SUPABASE_SERVICE_ROLE_KEY env var
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const relevantEvents = new Set([
  'checkout.session.completed',
  // 'customer.subscription.created', // Often covered by checkout.session.completed
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text() // Read body as text for signature verification

  // Ensure STRIPE_WEBHOOK_SIGNING_SECRET is set in Supabase secrets
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')

  let event: Stripe.Event

  try {
    if (!signature || !webhookSecret) {
      throw new Error('Missing Stripe signature or webhook secret')
    }
    event = await stripe.webhooks.constructEventAsync(
      body, 
      signature, 
      webhookSecret,
      undefined,
      // @ts-ignore Deno CryptoProvider
      Stripe.createSubtleCryptoProvider()
    )
    console.log(`Webhook received: ${event.id}, Type: ${event.type}`) 
  } catch (err) {
    console.error(`Error verifying webhook signature: ${err.message}`)
    return new Response(err.message, { status: 400 })
  }

  // Only process relevant events
  if (relevantEvents.has(event.type)) {
    try {
      let userId: string | null = null
      let subscriptionStatus: string | null = null
      let isPremiumStatus: boolean = false

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session
          // Check payment status (might be 'paid', 'unpaid', or 'no_payment_required')
          if (session.payment_status === 'paid') {
            userId = session.client_reference_id // Get Supabase user ID we stored
            const stripeCustomerId = session.customer as string; // Get Stripe Customer ID
            
            if (!userId) {
              console.error('CRITICAL: checkout.session.completed event received without client_reference_id!');
              // Potentially throw an error or handle this case where linking fails
              break; // Skip processing this event if user ID is missing
            }
            if (!stripeCustomerId) {
               console.error('CRITICAL: checkout.session.completed event received without customer ID!');
               // Potentially throw an error or handle this case where customer ID is missing
               break; // Skip processing this event if customer ID is missing
            }
            
            subscriptionStatus = 'active' // Assume active on successful checkout
            isPremiumStatus = true
            console.log(`Checkout session completed for user ${userId}. Stripe Customer ID: ${stripeCustomerId}`);
            
            // --- Update DB with BOTH is_premium and stripe_customer_id --- 
            console.log(`Updating profile for user ${userId}: set is_premium = true, stripe_customer_id = ${stripeCustomerId}`)
            const { error: updateError } = await supabaseAdmin
              .from('profiles')
              .update({ 
                is_premium: true, 
                stripe_customer_id: stripeCustomerId 
              })
              .eq('user_id', userId)
            
            if (updateError) {
              console.error(`Failed to update profile for user ${userId} after checkout:`, updateError)
              throw new Error(`Database update failed for user ${userId} after checkout.`); // Throw to return 500
            }
            console.log(`Successfully updated profile for user ${userId} after checkout.`)
            // --- End DB Update --- 
            
            // Set userId to null AFTER processing to prevent default update block from running again
            userId = null; 
          }
          break
        }
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription
          // Use metadata OR customer ID lookup if client_reference_id isn't on subscription
          // Here we assume we need to map customer ID back to user ID if client_reference_id isn't directly available
          // IMPORTANT: For simplicity, we'll rely on client_reference_id if possible, 
          // otherwise you might need to store stripe_customer_id on your Supabase profile table.
          // Let's check metadata first if we set it during creation (we didn't in the checkout func, but you could)
          // userId = subscription.metadata?.supabaseUserId; 
          
          // More commonly, you might fetch the customer, check their metadata, or lookup based on email/customer_id
          // For now, we'll just log and rely on checkout event or manual mapping if needed
          console.log(`Subscription updated: ${subscription.id}, Status: ${subscription.status}`)
          subscriptionStatus = subscription.status // e.g., 'active', 'trialing', 'past_due', 'canceled'
          // Determine isPremium based on status
          isPremiumStatus = subscriptionStatus ? ['active', 'trialing'].includes(subscriptionStatus) : false;
          
          // Find associated Supabase user ID - THIS IS THE TRICKY PART without storing stripe_customer_id
          // Option 1: If you added client_reference_id to the subscription metadata (requires extra step at creation)
          // userId = subscription.metadata.client_reference_id;

          // Option 2: Look up user by Stripe Customer ID (Requires storing stripe_customer_id in your 'profiles' table)
          const customerId = subscription.customer; 
          if (typeof customerId === 'string') {
             const { data: profile, error } = await supabaseAdmin
               .from('profiles')
               .select('user_id')
               // @ts-ignore: Linter struggles with type guard inference for .eq()
               .eq('stripe_customer_id', customerId)
               .single()
             if (error) console.error('Error fetching profile by stripe customer id:', error)
             if (profile) userId = profile.user_id;
          } else {
             console.warn('Could not determine user ID from subscription update event: Customer ID not found or not a string.')
          } 
          break
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription
          // Similar logic as updated to find the userId
          console.log(`Subscription deleted: ${subscription.id}`)
          subscriptionStatus = subscription.status // Should be 'canceled' or similar
          isPremiumStatus = false // Subscription deleted means no longer premium

          const customerId = subscription.customer;
          if (typeof customerId === 'string') {
             const { data: profile, error } = await supabaseAdmin
               .from('profiles')
               .select('user_id')
               // @ts-ignore: Linter struggles with type guard inference for .eq()
               .eq('stripe_customer_id', customerId)
               .single()
             if (error) console.error('Error fetching profile by stripe customer id:', error)
             if (profile) userId = profile.user_id;
          } else {
             console.warn('Could not determine user ID from subscription delete event: Customer ID not found or not a string.')
          } 
          break
        }
        default:
          console.warn(`Unhandled relevant event type: ${event.type}`)
          // Optional: return 200 even for unhandled relevant events if desired
          // return new Response(JSON.stringify({ received: true }), { status: 200 })
      }

      // If we identified a user and have a status change, update the DB
      if (userId) {
        console.log(`Updating profile for user ${userId}: set is_premium = ${isPremiumStatus}`) 
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ is_premium: isPremiumStatus })
          .eq('user_id', userId)

        if (updateError) {
          console.error(`Failed to update profile for user ${userId}:`, updateError)
          // Decide if this should be a 500 error back to Stripe or just logged
          throw new Error(`Database update failed for user ${userId}`); // Throw to return 500
        }
        console.log(`Successfully updated is_premium for user ${userId} to ${isPremiumStatus}`) 
      } else if (event.type !== 'checkout.session.completed') {
        // Only warn if we couldn't find user for subscription events (checkout uses client_reference_id)
         console.warn(`Could not find user ID for event type ${event.type}. DB update skipped.`)
      }

    } catch (err) {
      console.error('Error processing webhook event:', err)
      return new Response(
        JSON.stringify({ error: 'Webhook handler failed', details: err.message }),
        { status: 500 } // Use 500 for internal server errors
      )
    }
  } else {
      console.log(`Ignoring irrelevant event type: ${event.type}`) 
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), { status: 200 })
})

/* 
Important Considerations:
1. Store `stripe_customer_id`: The most reliable way to link subscription updates/deletions back to your Supabase user is to store the Stripe Customer ID (`cus_...`) in your `profiles` table. You can get this from the `checkout.session.completed` event (`session.customer`) and update your profile then.
2. Idempotency: Webhooks can sometimes be delivered more than once. Ensure your update logic handles this gracefully (e.g., updating `is_premium` is generally idempotent).
3. Security: Ensure `STRIPE_WEBHOOK_SIGNING_SECRET` is kept secret and verification is strictly enforced.
4. Error Handling: Decide how to handle failures (e.g., DB update fails). Returning a 500 tells Stripe to retry the webhook.
*/ 