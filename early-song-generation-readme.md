# Early Song Generation Feature Implementation

This feature enables generating preset songs for users during sign-up, specifically after they enter the baby's name but before they complete the full sign-up process.

## Implementation Details

### 1. Database Changes

- Added `is_onboarding` boolean field to the `profiles` table to track incomplete sign-ups.
- Created a migration file: `supabase/migrations/20240523_add_is_onboarding_to_profiles.sql`

### 2. New Components and Functions

#### SongService

- Added `generatePresetSongsForNewUser(babyName)` - Starts generating preset songs for a new user before sign-up is completed. Creates a temporary profile and returns a temporary ID.
- Added `transferSongsToUser(tempId, userId)` - Transfers songs from a temporary profile to a permanent user after sign-up completes.
- Added `cleanupAbandonedSignups()` - Removes data for abandoned sign-ups.

#### AuthModal

- Modified the sign-up flow to add a new `creatingAccount` step after the baby name is entered.
- Added a "Next" button after the baby name screen to start song generation.
- Added state to track when songs are being generated and to store the temporary profile ID.

#### AuthStore

- Updated the `signUp` function to accept a `tempProfileId` parameter.
- Modified the sign-up process to transfer songs from the temporary profile to the permanent one.

### 3. Cleanup Process

- Created a Supabase Edge Function that can be scheduled to run periodically (recommended hourly).
- The function finds profiles with `is_onboarding=true` that are older than 1 hour.
- It deletes the associated songs and then the profile itself to prevent orphaned data.

## Usage Flow

1. User enters baby name in the sign-up modal and clicks "Next".
2. The app creates a temporary profile and starts generating preset songs in the background.
3. User enters email and password to complete sign-up.
4. When sign-up completes, songs are transferred from the temporary profile to the permanent user.
5. If sign-up never completes, a scheduled job will clean up the abandoned data after 1 hour.

## Benefits

- Reduces user wait time since songs start generating earlier in the sign-up flow.
- Maintains a clean database by removing orphaned data from abandoned sign-ups.
- Preserves separation of concerns with clear service boundaries.

## Deployment Requirements

1. Run the migration to add the `is_onboarding` column.
2. Deploy the Edge Function for cleaning up abandoned sign-ups.
3. Set up a scheduled job to run the cleanup function hourly.

## Error Handling

- If song generation fails during the early phase, the app falls back to generating songs after sign-up completes.
- If transferring songs fails, the app logs the error and proceeds with sign-up completion.
- The cleanup job continues processing even if individual deletes fail, ensuring maximum data cleanup. 