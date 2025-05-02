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

-   **Generation Check:** Song creation function MUST verify `is_premium` or `generation_count < limit` before calling external APIs. Increment `generation_count` *after* successful API call initiation.
-   **Play Count:** Need an Edge Function (`incrementPlayCount`?):
    -   Accepts `user_id` (or uses caller's ID).
    -   Atomically increments `monthly_plays_count`.
    -   Checks `play_count_reset_at` to handle monthly reset.
    -   Called securely from client (`authStore.incrementPlayCount` placeholder).
-   **Favorite Toggle:** Need an Edge Function (`toggleFavoriteSong`?):
    -   Accepts `song_id` (and uses caller's `user_id`).
    -   Updates `is_favorite` on the specific song record WHERE `user_id` matches.
    -   Called from client (`SongItem.handleToggleFavorite` placeholder).
-   **Stripe Integration:**
    -   Requires Stripe setup (products, prices).
    -   Frontend initiates checkout (likely via call to a backend function).
    -   Need a secure webhook handler Function (`/api/stripe-webhook`?):
        -   Listens for relevant Stripe events (`checkout.session.completed`, subscription updates).
        -   Verifies webhook signature.
        -   Updates `is_premium` flag in the `profiles` table.

## 6. Pending Work

-   **Backend Implementation:** Implement all server-side logic described above.
-   **Connect Frontend<>Backend:** Replace TODOs in frontend stores/components to call the new backend functions.
-   **Fetch Favorites:** Update song loading logic to fetch the `is_favorite` status and initialize `SongItem` state.
-   **Stripe Checkout UI:** Implement the frontend part of initiating the Stripe checkout flow from the `/premium` page buttons.
-   **Tooltips:** Consider adding a proper Tooltip component for better UX on disabled buttons.
-   **Error Handling:** Refine display of limit errors to provide clearer calls to action (e.g., link/button to `/premium`).

## 7. Required Backend Implementation

-   **Database (`profiles` table):**
    -   Add `is_premium BOOLEAN DEFAULT false`.
    -   Add `generation_count INTEGER DEFAULT 0`.
    -   Add `monthly_plays_count INTEGER DEFAULT 0`.
    -   Add `play_count_reset_at TIMESTAMPTZ`.
-   **Database (Favorites):**
    -   Add `is_favorite BOOLEAN DEFAULT false` to `songs` table OR create a separate `user_favorite_songs` join table (`user_id`, `song_id`).
-   **Supabase Function (`incrementPlayCount`):**
    -   Accepts `user_id`.
    -   Atomically increments `monthly_plays_count`.
    -   Checks `play_count_reset_at` and resets count/updates timestamp if a new month has started.
    -   Called by client `authStore.incrementPlayCount`.
-   **Supabase Function (`toggleFavoriteSong`):**
    -   Accepts `user_id`, `song_id`.
    -   Updates the favorite status in the database.
    -   Called by client `SongItem.handleToggleFavorite`.
-   **Server-Side Generation Check:**
    -   Modify the existing function that handles song creation requests.
    -   Fetch user's `is_premium` and `generation_count`.
    -   If free user is at limit, return error.
    -   If proceeding, increment `generation_count` *after* successfully queuing the task with external APIs.
-   **Stripe Integration:**
    -   Set up Stripe account, products (monthly/annual plans), prices.
    -   Implement Stripe Checkout on the frontend Upgrade UI.
    -   Create a Supabase Function webhook handler (`/api/stripe-webhook`?) to listen for Stripe events (e.g., `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`).
    -   Webhook handler updates `is_premium` flag in the `profiles` table based on subscription status. Securely verify webhook signatures. 