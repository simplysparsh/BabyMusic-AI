# Utility Scripts

This directory contains utility scripts to help manage the BabyMusic-AI application. These scripts assist with environment setup, database management, and security checks.

## Environment Setup

### setup-env.ts

An interactive script to help set up your environment variables:

```bash
npx tsx scripts/setup-env.ts
```

This script will:
- Guide you through setting up all required environment variables
- Create a `.env.local` file with your provided values
- Check if an existing `.env.local` file exists and ask before overwriting

## Database Management Scripts

### fix-task-ids.ts

Checks for and fixes issues with task IDs in the database:

```bash
npx tsx scripts/fix-task-ids.ts
```

This script performs the following checks:
- Finds songs with audio URLs that still have task IDs and clears those task IDs
- Identifies songs with a failed status that still have task IDs and clears them
- Checks for songs that have been generating for more than 5 minutes and updates their status to 'failed'

### check-stuck-tasks.ts

Identifies songs that may be stuck in the generating state:

```bash
npx tsx scripts/check-stuck-tasks.ts
```

This script:
- Finds songs with task IDs that have been generating for more than 5 minutes
- Identifies songs with audio URLs that still have task IDs
- Reports these issues without making any changes to the database

### fix-stuck-tasks.ts

Resets songs that are stuck in the generating state:

```bash
npx tsx scripts/fix-stuck-tasks.ts
```

This script:
- Finds songs with task IDs that have been generating for more than 5 minutes
- Updates these songs to have a 'failed' status and clears their task IDs
- Marks them as retryable so they can be generated again

### update-song-audio.ts

Updates a song's audio URL:

```bash
npx tsx scripts/update-song-audio.ts <song_id> <audio_url>
```

Parameters:
- `song_id`: The UUID of the song to update
- `audio_url`: The new audio URL to set for the song

### list-songs.ts

Lists all songs in the database:

```bash
npx tsx scripts/list-songs.ts
```

This script displays:
- Song ID
- Song name
- Creation date
- Audio URL (if available)
- Task ID (if present)
- Error message (if any)

## Security Scripts

### check-for-secrets.ts

Scans the codebase for potentially hardcoded secrets:

```bash
npx tsx scripts/check-for-secrets.ts
```

This script:
- Searches for patterns that might indicate hardcoded secrets (API keys, tokens, etc.)
- Excludes common false positives like React key props
- Ignores files that typically contain environment variables (like .env files)
- Reports any findings so they can be moved to environment variables

## Environment Variables

All scripts use environment variables from `.env.local` for configuration. The required variables are:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

The scripts will automatically:
1. Look for a `.env.local` file in the project root
2. Fall back to `.env` if `.env.local` is not found
3. Display an error if the required environment variables are missing

## Best Practices

- Run `check-for-secrets.ts` regularly to ensure no secrets are hardcoded in the codebase
- Use `check-stuck-tasks.ts` to identify potential issues before using `fix-stuck-tasks.ts`
- Always back up your database before running scripts that modify data
- Keep your `.env.local` file secure and never commit it to version control 