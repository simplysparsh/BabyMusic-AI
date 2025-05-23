# Monetization Strategy: TuneLoom

This document outlines the freemium monetization strategy implemented for TuneLoom, focusing on driving premium subscriptions.

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
-   **Play Count:** Supabase Edge Function `