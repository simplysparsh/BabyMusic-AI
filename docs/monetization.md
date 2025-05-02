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

## 4. Frontend Implementation Details

### 4.1 State Management (`src/store/authStore.ts`)

-   `UserProfile` type (`src/types/index.ts`) extended with:
    -   `isPremium: boolean`
    -   `generationCount: number` (Lifetime custom generations)
    -   `monthlyPlaysCount: number` (Plays this cycle)
    -   `playCountResetAt?: string | null` (Timestamp for cycle reset - backend managed)
-   `loadProfile` function updated to fetch these fields from the `profiles` table.
-   `incrementPlayCount` function added (client-side only for now) to update local state after a successful play by a free user. **TODO:** This needs to call a backend function.

### 4.2 Theme Gating (`src/components/music-generator/ThemeSelector.tsx`)

-   Reads `isPremium` status from `authStore`.
-   Filters the `THEMES` array, excluding `indianClassical` and `westernClassical` for free users.
-   Displays a subtle hint below the theme grid for free users, indicating the locked themes are available with Premium.

### 4.3 Generation Limit (`src/components/MusicGenerator.tsx`)

-   Reads `isPremium` and `generationCount` from `authStore`.
-   Defines `GENERATION_LIMIT = 2`.
-   `handleGenerate` function checks: If user is free and `generationCount >= GENERATION_LIMIT`, it sets an error and prevents calling `createSong` for non-preset types.
-   The "Create Music" button (`isCreateButtonDisabled`) is disabled if the limit is reached for a free user attempting non-preset generation.
-   **TODO:** Backend needs to perform the authoritative check and increment `generation_count`.

### 4.4 Play Limit (`src/store/audioStore.ts`)

-   Reads `profile` (including `isPremium`, `monthlyPlaysCount`) from `authStore`.
-   Defines `MONTHLY_PLAY_LIMIT = 25`.
-   `playAudio` function checks: If user is free and `monthlyPlaysCount >= MONTHLY_PLAY_LIMIT`, it sets an error in `errorStore` and prevents playback.
-   If playback is allowed for a free user, it calls `authStore.incrementPlayCount()` after playback starts.
-   **TODO:** Backend should manage the authoritative count and reset logic based on `play_count_reset_at`.

### 4.5 Play Limit UI Feedback

-   **`src/components/SongItem.tsx`:**
    -   Reads `error` from `errorStore`.
    -   Checks if `error === PLAY_LIMIT_ERROR_MSG`.
    -   If true, disables the Play button and shows a `LockKeyhole` icon.
-   **`src/components/preset/PresetSongCard.tsx`:**
    -   Reads `error` from `errorStore`.
    -   Checks if `error === PLAY_LIMIT_ERROR_MSG`.
    -   If true and `songState === READY`, prevents `handleCardClick` from playing audio.
    -   `renderStatusIndicator` shows a "Limit Reached" status with `LockKeyhole` icon.
    -   Card `div` `aria-disabled` is set, and styles applied to indicate non-interactivity.

### 4.6 Download Button Gating

-   **`src/components/SongItem.tsx`:**
    -   Added Download button.
    -   Reads `isPremium` from `authStore`.
    -   Button is disabled with `LockKeyhole` icon if user is not premium.
    -   `handleDownload` function implements client-side download logic via temporary `<a>` tag, only runs if premium.
-   **`src/components/preset/PresetSongCard.tsx`:**
    -   Added Download button.
    -   Reads `isPremium` from `authStore`.
    -   Button is visible only when `isReady`.
    -   Button is disabled with `LockKeyhole` icon if user is not premium.
    -   `handleDownload` function implements client-side download logic, only runs if premium.

### 4.7 Favorite Button Gating (`src/components/SongItem.tsx`)

-   Added Favorite (Heart) button (only for custom songs).
-   Reads `isPremium` from `authStore`.
-   Button is disabled with `LockKeyhole` icon if user is not premium.
-   `handleToggleFavorite` function implemented (client-side state toggle only for now). Icon toggles fill state.
-   **TODO:** Implement backend logic for storing/retrieving favorite status and call from `handleToggleFavorite`.

## 5. Pending UI Work

-   **Upgrade Flow UI:** Create a dedicated page/modal (e.g., `/premium`, or triggered from upgrade prompts) that:
    -   Clearly lists the benefits of Premium vs. Free.
    -   Displays pricing ($X/month, $Y/year with discount).
    -   Includes a button to initiate the Stripe checkout process.
-   **Tooltips:** Add tooltips to disabled premium feature buttons for better UX (requires a `Tooltip` component).
-   **Error Handling:** Improve display of limit errors (generation/play) to include clear calls to action (e.g., link to upgrade page).

## 6. Required Backend Implementation

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