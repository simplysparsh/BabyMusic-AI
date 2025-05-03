# API Integration

Baby Music AI integrates with two external APIs to provide advanced music and lyric generation capabilities: PIAPI.ai and Anthropic Claude.

## PIAPI.ai Integration

PIAPI.ai is a music generation API that creates unique, personalized songs based on various parameters, such as mood, instruments, and style. Baby Music AI uses PIAPI.ai to generate custom songs for users.

The integration with PIAPI.ai works as follows:

1. When a user requests a new custom song, the frontend first calls the `check-generation-allowance` backend function to verify limits.
2. If allowed, the **frontend client** (using logic in `src/lib/piapi.ts` likely called via `src/services/songService.ts`) directly sends the generation request to the PIAPI.ai API, including the API key (stored client-side as `VITE_PIAPI_KEY`).
3. PIAPI.ai processes the request and generates the song asynchronously.
4. When the song generation is complete, PIAPI.ai sends a webhook notification to the `/api/piapi-webhook` endpoint in the Baby Music AI backend (a Supabase Edge Function).
5. The webhook endpoint (`supabase/functions/piapi-webhook`) receives the notification, extracts the song data (audio URL, metadata, etc.), and updates the corresponding song record in the database.
6. The frontend updates reactively via Supabase Realtime subscriptions listening to changes in the `songs` table.

Key files for PIAPI integration:
-   `src/lib/piapi.ts`: Contains the client-side function (`createMusicGenerationTask`) to call the PIAPI.ai API.
-   `supabase/functions/piapi-webhook`: Handles the incoming webhook from PIAPI.ai.
-   `src/store/song/actions.ts`: Orchestrates calling the check function and then the client-side service.

**(Security Note):** Currently, the `VITE_PIAPI_KEY` is exposed in the frontend bundle. Future improvements may involve moving the PIAPI call to a dedicated backend function to protect this key.

## Anthropic Claude Integration

Anthropic Claude is an AI-powered API for generating human-like text based on given prompts. Baby Music AI uses Anthropic Claude to generate personalized song lyrics based on user-specified themes, moods, and preferences.

The integration with Anthropic Claude likely works similarly:

1. If custom lyrics are needed, the **frontend client** (likely using `src/lib/claude.ts` called via `songService.ts`) constructs a prompt and calls the Claude API directly, using the `VITE_CLAUDE_API_KEY`.
2. The generated lyrics are then included in the parameters sent to the PIAPI.ai API (via the client-side call).

Key files for Claude integration:
-   `src/lib/claude.ts`: Contains client-side logic to call the Claude API.

**(Security Note):** The `VITE_CLAUDE_API_KEY` is also exposed client-side.

## Error Handling and Rate Limiting

Both PIAPI.ai and Anthropic Claude integrations include error handling and rate limiting mechanisms to ensure a smooth user experience and prevent abuse of the APIs.

- Error Handling: The integration code includes try-catch blocks to catch and handle errors returned by the APIs. In case of an error, the code logs the error details and returns an appropriate error response to the frontend.
- Rate Limiting: The integration code implements rate limiting to prevent exceeding the API rate limits. It keeps track of the number of requests made within a specific time window and delays or rejects requests if the limit is reached.

By integrating with PIAPI.ai and Anthropic Claude, Baby Music AI can offer advanced music and lyric generation features to its users, creating a unique and personalized experience for parents and their little ones.
