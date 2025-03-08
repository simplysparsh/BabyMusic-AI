# Song State Refactoring

This document outlines the changes made to simplify the song state model in the BabyMusic-AI application.

## Overview

The song state model has been simplified to use a single source of truth for determining a song's state. Instead of relying on a `status` field in the database, we now use the presence/absence of `task_id`, `audio_url`, and `error` fields to determine the state of a song.

## Changes Made

1. **Simplified State Model**
   - Removed the `status` field from the `Song` type and database schema
   - Defined three clear states:
     - **Generating**: Song has a `task_id`, no `audio_url`, and no `error`
     - **Completed**: Song has an `audio_url`
     - **Failed**: Song has an `error` (error overrides everything)

2. **SongStateService Updates**
   - Updated `isGenerating`, `isCompleted`, and `hasFailed` methods to use only the `task_id`, `audio_url`, and `error` fields
   - Replaced `isStaged` with `isInQueue` to better reflect the purpose of the method
   - Updated `updateSongWithError` to clear the `task_id` when setting an error

3. **Webhook Updates**
   - Updated the webhook to remove references to the `status` field
   - Now only updates the `task_id`, `audio_url`, and `error` fields

4. **Store Updates**
   - Replaced `stagedTaskIds` with `queuedTaskIds` in the `SongState` interface
   - Updated the store initialization and actions to use `queuedTaskIds`
   - Updated subscription handlers to use `SongStateService.isInQueue` instead of `isStaged`

5. **Database Migration**
   - Added a migration script to remove the `status` field from the `songs` table

## Benefits

1. **Single Source of Truth**: The `SongStateService` is now the single source of truth for determining a song's state
2. **Simplified State Model**: The state model is now simpler and more intuitive
3. **Reduced Risk of Inconsistency**: By deriving state from properties, we eliminate the risk of inconsistent states
4. **Easier Debugging**: It's easier to understand the state of a song by looking at its properties

## Edge Cases Handled

- **Songs with both `audio_url` and `error`**: The presence of `error` overrides everything, and the song is considered failed
- **Songs with `retryable: true` but `error: null`**: These are treated as failed and an error message is added
- **Songs that have been stuck for too long**: These are marked as failed with a timeout error message

## Migration Notes

The migration script `20240601000000_remove_status_field.sql` will remove the `status` field from the `songs` table. This is a non-destructive change as we're only removing a redundant field.

## Testing

After deploying these changes, it's recommended to test the following scenarios:

1. Creating a new song and verifying it shows as generating
2. Waiting for a song to complete and verifying it shows as completed
3. Forcing a song to fail and verifying it shows as failed
4. Retrying a failed song and verifying it shows as generating again
5. Checking that the UI correctly reflects the state of songs in all views 