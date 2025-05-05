# Monetization Strategy: BabyMusic AI

This document outlines the freemium monetization strategy implemented for BabyMusic AI, focusing on driving premium subscriptions.

## 1. Goal

Maximize premium user adoption by providing a valuable free tier with strategic limitations that encourage upgrades.

## 2. Model: Freemium

Users can experience core functionality for free, but require a premium subscription for unlimited usage and enhanced features.

## 3. Tier Comparison

| Feature             | Free Tier                                     | Premium Tier                       | Notes                                                                 |
| :------------------ | :-------------------------------------------- | :--------------------------------- | :-------------------------------------------------------------------- |
| **Generations**     | 2 Custom Songs (Lifetime Limit)               | Unlimited                          | Strictly limits free creation after initial trial.                    |
| **Plays**           | 25 Total Plays / Month                        | Unlimited                          | Prevents indefinite use of presets/limited custom songs.              |
| **Themes**          | 4 Core Themes (Pitch, Cognitive, Sleep, Social) | All 6 Themes (+ Indian, Western) | Key feature differentiation.                                          |
| **Download Songs**  | No                                            | Yes                                | Core value proposition for premium.                                   |
| **Favorite Songs**  | No                                            | Yes (Custom Songs Only)            | Organizational tool for users generating many songs.                  |
| **Audio Quality**   | Standard                                      | Standard                           | Kept consistent across tiers for simplicity.                          |
| **Song Duration**   | Standard                                      | Standard                           | Kept consistent across tiers for simplicity.                          |
| **Other (Premium)** | N/A                                           | Advanced Customization (Future), Early Access (Future), Priority Support (Future) | Potential future value adds.                                           |

## 4. Frontend Implementation Details (Summary)

-   **State:** `authStore` holds `isPremium`, `generationCount`, `monthlyPlaysCount`. Manual mapping handles `snake_case` from DB to `camelCase` state.
-   **Gating:** Premium features (Themes, Download, Favorite) are gated in relevant components (`ThemeSelector`, `SongItem`, `PresetSongCard`) by checking `isPremium`.
-   **Limit Checks:** Client-side checks prevent generation (`MusicGenerator`) and playback (`audioStore`) beyond limits for free users.
-   **UI Indicators:**
    -   Disabled premium buttons show greyed-out icons.
    -   Consolidated hint banners (in `ThemeSelector`, `SongList`) link to `/premium` page.
    -   Play limit reached state disables play buttons and shows specific status.
-   **Upgrade Flow:**
    -   Dedicated `/premium` page created (`PremiumPage.tsx`) showing benefits/pricing.
    -   Routing handled manually in `App.tsx`.
    -   Upgrade links added to `ProfileModal`, `ThemeSelector` hint, `SongList` banner, and landing page `Hero`.

## 5. Backend Implementation Details

### 5.1 Database Schema (`supabase/migrations`)

-   Migrations should be created using `supabase migration new <name>` and applied via `supabase db push`.
-   SQL statements should use `IF NOT EXISTS` for idempotency.
-   **`profiles` table:**
    -   `is_premium BOOLEAN DEFAULT false` (Already existed)
    -   `generation_count INTEGER DEFAULT 0` (Added)
    -   `monthly_plays_count INTEGER DEFAULT 0` (Added)
    -   `play_count_reset_at TIMESTAMPTZ` (Added)
-   **`songs` table:**
    -   `is_favorite BOOLEAN DEFAULT false` (Added - simpler than join table as songs are per-user)

### 5.2 Server-Side Logic (Supabase Functions / Backend)

-   **Generation Check:** Supabase Edge Function `check-generation-allowance` (Implemented & Deployed):
    -   Location: `supabase/functions/check-generation-allowance`
    -   Handles authentication and generation limit check.
    -   Increments `generation_count` for free users if allowed.
    -   Returns `{ allowed: boolean }` response.
    -   **Note:** Does *not* perform song creation or external API calls.
-   **Client-Side Logic:** The frontend (`src/store/song/actions.ts`) calls `check-generation-allowance`. If allowed, it proceeds to use the client-side `SongService` (which uses `src/lib/piapi.ts`) to create the DB record and initiate the external PIAPI call. This maintains API key exposure on the client but simplifies backend implementation.
-   **Play Count:** Supabase Edge Function `increment-play-count` (Implemented & Deployed):
    -   Location: `supabase/functions/increment-play-count`
    -   Trigger: HTTP POST request.
    -   Auth: Requires Supabase JWT in Authorization header.
    -   Logic:
        1. Authenticates the user.
        2. Fetches user's profile (`monthly_plays_count`, `play_count_reset_at`) using Admin client.
        3. Checks if `play_count_reset_at` is older than 1 month.
        4. If yes, sets count to 1 and updates `play_count_reset_at` to now.
        5. If no, increments `monthly_plays_count`.
        6. Updates the profile record (incl. `last_active_date`).
    -   Called securely from client (`authStore.incrementPlayCount` placeholder).
-   **Favorite Toggle:** Supabase Edge Function `toggle-favorite` (Implemented & Deployed):
    -   Located at `supabase/functions/toggle-favorite`.
    -   Accepts `song_id` in JSON body.
    -   Authenticates user via Authorization header.
    -   Verifies user owns the song.
    -   Updates `is_favorite` on the specific song record WHERE `user_id` matches.
    -   Called from client (`SongItem.handleToggleFavorite` placeholder).

### 5.3 Stripe Integration (Implemented)

Stripe is used to handle premium subscriptions.

-   **Database (`profiles` table):**
    -   Added `stripe_customer_id TEXT UNIQUE` to store the mapping between Supabase users and Stripe customers (migration required).
-   **Supabase Function (`create-stripe-checkout`):**
    -   Location: `supabase/functions/create-stripe-checkout`
    -   Trigger: HTTP POST request from the frontend (`PremiumPage.tsx`).
    -   Auth: Requires Supabase JWT.
    -   Logic: Creates a Stripe Checkout session for a given Price ID, associating it with the Supabase user ID (`client_reference_id`), and returns the session URL for redirection.
-   **Supabase Function (`stripe-webhook`):**
    -   Location: `supabase/functions/stripe-webhook`
    -   Trigger: Events from Stripe (configured in Stripe dashboard).
    -   Auth: **No JWT verification** (uses Stripe signature verification via `STRIPE_WEBHOOK_SIGNING_SECRET`).
    -   Logic: Handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` events. Updates the user's `is_premium` status and stores/updates `stripe_customer_id` in the `profiles` table.
-   **Supabase Function (`create-customer-portal-session`):**
    -   Location: `supabase/functions/create-customer-portal-session`
    -   Trigger: HTTP POST request from the frontend (`ProfileModal.tsx`).
    -   Auth: Requires Supabase JWT.
    -   Logic: Retrieves the user's `stripe_customer_id` from `profiles`, creates a Stripe Billing Portal session, and returns the session URL for redirection, allowing users to manage their subscription.

## 6. Manual Work

-   **Manual Stripe Configuration:**
    -   Set up Products and Prices in the Stripe Dashboard (Test and Live modes).
    -   Configure and save the Customer Portal settings in the Stripe Dashboard.
    -   Create the Webhook Endpoint in Stripe, pointing to the deployed `stripe-webhook` function, listening for required events (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`), and obtain the Signing Secret.
-   **Supabase Secrets:** Ensure `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SIGNING_SECRET`, and `SITE_URL` are correctly set in Supabase project settings for the relevant environment (Test/Live).
-   **End-to-End Testing:** Thoroughly test the entire flow in Stripe Test Mode: sign up, upgrade via checkout, verify webhook updates `is_premium` and `stripe_customer_id`, access customer portal, manage subscription (e.g., cancel), verify webhook updates status again.
-   **Connect Frontend<>Backend (Non-Stripe):** Replace remaining TODOs for calling `incrementPlayCount` and `toggleFavoriteSong` backend functions if not already done.
-   **Fetch Favorites:** Update song loading logic to fetch `is_favorite` status if not already done.
-   **Tooltips:** Consider adding Tooltip component for UI clarity.
-   **Error Handling:** Refine limit error display.
-   **(Security Note):** Re-evaluate moving PIAPI call to backend in the future to protect API key. 