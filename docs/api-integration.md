# API Integration

Baby Music AI integrates with two external APIs to provide advanced music and lyric generation capabilities: PIAPI.ai and Anthropic Claude.

## PIAPI.ai Integration

PIAPI.ai is a music generation API that creates unique, personalized songs based on various parameters, such as mood, instruments, and style. Baby Music AI uses PIAPI.ai to generate custom songs for users.

The integration with PIAPI.ai works as follows:

1. When a user requests a new song, the frontend sends a request to the `/api/songs` endpoint with the desired song parameters.
2. The backend API endpoint forwards the request to the PIAPI.ai API, including the necessary authentication headers and request payload.
3. PIAPI.ai processes the request and generates the song asynchronously.
4. When the song generation is complete, PIAPI.ai sends a webhook notification to the designated webhook endpoint in the Baby Music AI backend.
5. The webhook endpoint receives the notification, extracts the song data (audio URL, metadata, etc.), and updates the corresponding song record in the database.
6. The frontend periodically polls the `/api/songs` endpoint to check the status of the song generation and retrieves the song data when it's available.

The PIAPI.ai integration is implemented in the `src/lib/piapi.ts` file, which exports functions for initiating song generation requests and handling webhook notifications.

## Anthropic Claude Integration

Anthropic Claude is an AI-powered API for generating human-like text based on given prompts. Baby Music AI uses Anthropic Claude to generate personalized song lyrics based on user-specified themes, moods, and preferences.

The integration with Anthropic Claude works as follows:

1. When a user requests a new song with custom lyrics, the frontend sends a request to the `/api/songs` endpoint with the desired lyric parameters (theme, mood, etc.).
2. The backend API endpoint constructs a prompt for Anthropic Claude based on the user's parameters and sends a request to the Anthropic Claude API.
3. Anthropic Claude processes the request and generates the song lyrics.
4. The backend API endpoint receives the generated lyrics and includes them in the request payload sent to PIAPI.ai for song generation.
5. The song generation process continues as described in the PIAPI.ai integration section.

The Anthropic Claude integration is implemented in the `src/lib/claude.ts` file, which exports functions for generating song lyrics based on user-specified parameters.

## Error Handling and Rate Limiting

Both PIAPI.ai and Anthropic Claude integrations include error handling and rate limiting mechanisms to ensure a smooth user experience and prevent abuse of the APIs.

- Error Handling: The integration code includes try-catch blocks to catch and handle errors returned by the APIs. In case of an error, the code logs the error details and returns an appropriate error response to the frontend.
- Rate Limiting: The integration code implements rate limiting to prevent exceeding the API rate limits. It keeps track of the number of requests made within a specific time window and delays or rejects requests if the limit is reached.

By integrating with PIAPI.ai and Anthropic Claude, Baby Music AI can offer advanced music and lyric generation features to its users, creating a unique and personalized experience for parents and their little ones.
