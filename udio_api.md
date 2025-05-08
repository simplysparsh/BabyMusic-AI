# Udio API Integration via PiAPI.ai (v1 Task API)

This document outlines the integration between Baby Music AI and the Udio music generation API (referred to as `music-u` model by PiAPI), facilitated through the PiAPI.ai proxy service. This documentation reflects the `/api/v1/task` endpoint.

## Endpoints Used

### 1. Create Music Generation Task (`POST /api/v1/task`)

- **Description**: This endpoint initiates a music generation task using the `music-u` model.
- **Reference**: PiAPI v1 task creation (see official PiAPI documentation for `/api/v1/task` POST).

### 2. Get Task Status/Result (`GET /api/v1/task/{taskId}`)

- **Description**: Retrieves the status and output (including audio URLs) of a specific generation task initiated via PiAPI.
- **Reference**: PiAPI v1 task retrieval (see official PiAPI documentation for `/api/v1/task/{taskId}` GET).

### 3. Webhook Notification Endpoint (`POST /api/piapi-webhook`)
- **Description**: This is the endpoint within Baby Music AI that PiAPI calls to send asynchronous updates about task status (e.g., completion, failure).
- **Handler**: `supabase/functions/piapi-webhook/index.ts`

## Workflow

1.  **User Request**: User initiates song generation (preset or custom) via the Baby Music AI frontend.
2.  **Service Call**: The frontend logic (e.g., via `SongStore`) calls `SongService.generateSong()`.
3.  **Parameter Preparation**: `SongService` prepares parameters and calls `SongService.startSongGeneration()` (which in turn calls `createMusicGenerationTask`).
4.  **Lyric Generation**: `createMusicGenerationTask` (in `src/lib/piapi.ts`) calls `LyricGenerationService.generateLyrics()`. This service uses the Claude API to generate lyrics based on various inputs (theme, mood, user ideas, etc.). The `userInput` from the UI (max 180 chars) serves as a hint/idea for Claude.
5.  **PiAPI Task Creation**: `createMusicGenerationTask` constructs the request payload for PiAPI's `/api/v1/task` endpoint (see example below) including the `webhook_config` pointing to `/api/piapi-webhook`.
6.  **Task ID Received**: The `POST /api/v1/task` call returns a JSON response containing the `task_id` nested under a `data` field (e.g., `{ "data": { "task_id": "your-task-id", ... } }`). `createMusicGenerationTask` parses this to get the `task_id`.
7.  **Store Task ID**: The `task_id` is returned to `SongService`, which updates the corresponding `songs` record in the Supabase database with this `task_id`.
8.  **Webhook Notification**: When PiAPI finishes processing the task (e.g., Udio completes song generation), PiAPI sends a POST request to Baby Music AI's configured `/api/piapi-webhook` endpoint.
9.  **Webhook Processing**: The `piapi-webhook` function (`supabase/functions/piapi-webhook/index.ts`):
    *   Authenticates the request (using `VITE_WEBHOOK_SECRET` from environment, checking against `x-webhook-secret` or similar header from PiAPI).
    *   Parses the JSON payload (see "Webhook Payload" example below).
    *   Finds the corresponding `songs` record using the `task_id` from the webhook payload.
    *   Updates the `songs` record with `audio_url`, `lyrics` (if provided by Udio in the webhook's `output`), and clears the `task_id` upon successful completion.
    *   Handles potential variations if present in `output.songs`.
    *   Logs errors or updates the song record with an error state if the webhook indicates generation failed.
10. **Frontend Update**: Supabase Realtime subscriptions notify the frontend (e.g., `songStore`) of the change to the `songs` record. The UI updates.

## API Request/Response Examples

### Create Task Request (`POST /api/v1/task`)

Example based on current implementation in `src/lib/piapi.ts` and official PiAPI examples. The `input` fields will vary based on `lyrics_type`.

**Common Structure:**
```json
{
  "model": "music-u",
  "task_type": "generate_music", // Currently only "generate_music" is used for music-u
  "input": { // Specific input fields depend on the generation mode (see below)
    // "gpt_description_prompt": "Description for AI to generate lyrics or guide instrumental.",
    // "lyrics": "Full user-provided lyrics if lyrics_type is 'user'.",
    // "lyrics_type": "generate" | "user" | "instrumental",
    // "negative_tags": "tags,to,avoid",
    // "title": "Song Title",
    // "seed": -1,
    // "continue_song_id": "task-id-of-song-to-extend", // For song extension
    // "continue_at": 0 // Time in seconds to extend from
  },
  "config": {
    "service_mode": "public", // Or other modes if applicable
    "webhook_config": {
      "endpoint": "https://your-supabase-instance.supabase.co/functions/v1/piapi-webhook",
      "secret": "{your_VITE_WEBHOOK_SECRET}"
    }
  }
}
```

**Example 1: AI Generated Lyrics (`lyrics_type: "generate"`)**
```json
{
  "model": "music-u",
  "task_type": "generate_music",
  "input": {
    "gpt_description_prompt": "A gentle, calming lullaby for baby {babyName} with soft female vocals, featuring piano and strings. Use soothing and peaceful language. Keep a gentle, slow rhythm.",
    "lyrics_type": "generate",
    "negative_tags": "rock, metal, aggressive, harsh",
    "title": "Generated Song Title",
    "seed": -1
  },
  "config": { "webhook_config": { "endpoint": "https://.../piapi-webhook", "secret": "..." } }
}
```

**Example 2: User Provided Lyrics (`lyrics_type: "user"`)**
(Lyrics generated by our Claude service, then passed to PiAPI)
```json
{
  "model": "music-u",
  "task_type": "generate_music",
  "input": {
    "gpt_description_prompt": "jazz, pop", // Style hint for the music generation
    "lyrics": "[Verse]\nIn the gentle evening air... Full lyrics from Claude...",
    "lyrics_type": "user",
    "negative_tags": "rock, metal, aggressive, harsh",
    "title": "User Lyrics Song Title",
    "seed": -1
  },
  "config": { "webhook_config": { "endpoint": "https://.../piapi-webhook", "secret": "..." } }
}
```

**Example 3: Instrumental (`lyrics_type: "instrumental"`)**
```json
{
  "model": "music-u",
  "task_type": "generate_music",
  "input": {
    "gpt_description_prompt": "Epic cinematic adventure theme, orchestral.",
    "lyrics_type": "instrumental",
    "negative_tags": "vocals, singing",
    "title": "Instrumental Piece Title",
    "seed": -1
  },
  "config": { "webhook_config": { "endpoint": "https://.../piapi-webhook", "secret": "..." } }
}
```

### Create Task Response (`POST /api/v1/task`)

Verified actual API response structure (differs from some PiAPI OpenAPI docs for this endpoint but matches `src/lib/piapi.ts` expectation):

```json
{
  "code": 200,
  "data": {
    "task_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "model": "music-u",
    "task_type": "generate_music",
    "status": "pending", // Initial status
    "config": {
      "service_mode": "",
      "webhook_config": {
        "endpoint": "https://example.com/test-webhook",
        "secret": "********"
      }
    },
    "input": {
      "gpt_description_prompt": "A simple test song description...",
      "lyrics_type": "generate",
      "negative_tags": "",
      "seed": -1,
      "title": "API Response Test Song"
    },
    "output": {
      "generation_id": "",
      "songs": null
    },
    "meta": {
      "created_at": "YYYY-MM-DDTHH:mm:ss.sssssssssZ",
      "started_at": "0001-01-01T00:00:00Z",
      "ended_at": "0001-01-01T00:00:00Z",
      "usage": { "type": "point", "frozen": 500000, "consume": 0 },
      "is_using_private_pool": false
    },
    "detail": null,
    "logs": null,
    "error": { "code": 0, "raw_message": "", "message": "", "detail": null }
  },
  "message": "success"
}
```

### Get Task Response (`GET /api/v1/task/{taskId}`)

This is the response structure when directly polling the `/api/v1/task/{taskId}` endpoint. It includes a wrapper around the task data.

```json
{
  "code": 200,
  "data": { // The actual task details are within this 'data' object
    "task_id": "d933023c-e599-4365-821d-c3fe2acb78bd",
    "model": "music-u",
    "task_type": "generate_music",
    "status": "completed", // or "processing", "failed", "pending", "staged"
    "config": {
      "service_mode": "",
      "webhook_config": {
        "endpoint": "https://your-supabase-url/functions/v1/piapi-webhook",
        "secret": "********"
      }
    },
    "input": {
      "gpt_description_prompt": "A playful, lighthearted melody...",
      "lyrics_type": "user",
      "negative_tags": "rock, metal, aggressive, harsh",
      "lyrics": "Time to go, time to go... ", // Echo of original input lyrics if provided
      "seed": -1,
      "title": "Sparsh's Sparsh's Flush Time Song (v9)"
    },
    "output": {
      "generation_id": "f5299215-bbef-48b7-bb65-5eef7870e067",
      "songs": [
        {
          "id": "29b8adf2-d508-4fc1-9318-d93ca30a421f",
          "title": "Sparsh Potty Time",
          "image_path": "https://imagedelivery.net/...",
          "lyrics": "Time to go, time to go,  Sparsh it's time to let it flow!...", // Udio-processed/returned lyrics
          "prompt": "A playful, lighthearted melody crafted to make potty time feel fun and empowering...", // Udio-returned gpt_description_prompt or original style prompt
          "song_path": "https://storage.googleapis.com/...",
          "duration": 131.114666666667,
          "finished": true,
          "tags": ["C major", "female vocalist", "pop"],
          "error_type": null,
          "error_code": null,
          "error_detail": null
        }
        // Potentially other song variations
      ]
    },
    "meta": {
      "created_at": "2025-05-06T03:45:27.53381788Z",
      "started_at": "2025-05-06T03:45:28.545747518Z",
      "ended_at": "2025-05-06T03:48:12.82521638Z",
      "usage": { "type": "point", "frozen": 500000, "consume": 500000 },
      "is_using_private_pool": false
    },
    "detail": null,
    "logs": null,
    "error": { "code": 0, "raw_message": "", "message": "", "detail": null }
  },
  "message": "success"
}
```

### Webhook Payload (`POST /api/piapi-webhook`)

The payload sent by PiAPI to your `/api/piapi-webhook` endpoint. This is the direct task data object, matching the `data` field from the `GET /api/v1/task/{taskId}` response and processed by `supabase/functions/piapi-webhook/index.ts`.

```json
{
  "task_id": "d933023c-e599-4365-821d-c3fe2acb78bd",
  "model": "music-u",
  "task_type": "generate_music",
  "status": "completed", // or "processing", "failed", etc.
  "config": {
    "service_mode": "",
    "webhook_config": {
      "endpoint": "https://your-supabase-url/functions/v1/piapi-webhook",
      "secret": "********"
    }
  },
  "input": {
    "gpt_description_prompt": "A playful, lighthearted melody...",
    "lyrics_type": "user",
    "negative_tags": "rock, metal, aggressive, harsh",
    "lyrics": "Time to go, time to go... ", // Echo of original input lyrics if provided
    "seed": -1,
    "title": "Sparsh's Sparsh's Flush Time Song (v9)"
  },
  "output": {
    "generation_id": "f5299215-bbef-48b7-bb65-5eef7870e067",
    "songs": [
      {
        "id": "29b8adf2-d508-4fc1-9318-d93ca30a421f",
        "title": "Sparsh Potty Time",
        "image_path": "https://imagedelivery.net/...",
        "lyrics": "Time to go, time to go,  Sparsh it's time to let it flow!...", // Udio-processed/returned lyrics
        "prompt": "A playful, lighthearted melody crafted to make potty time feel fun and empowering...", // Udio-returned gpt_description_prompt or original style prompt
        "song_path": "https://storage.googleapis.com/...",
        "duration": 131.114666666667,
        "finished": true,
        "tags": ["C major", "female vocalist", "pop"],
        "error_type": null,
        "error_code": null,
        "error_detail": null
      }
      // Potentially other song variations
    ]
  },
  "meta": {
    "created_at": "2025-05-06T03:45:27.53381788Z",
    "started_at": "2025-05-06T03:45:28.545747518Z",
    "ended_at": "2025-05-06T03:48:12.82521638Z",
    "usage": { "type": "point", "frozen": 500000, "consume": 500000 },
    "is_using_private_pool": false
  },
  "detail": null,
  "logs": null,
  "error": { "code": 0, "raw_message": "", "message": "", "detail": null }
}
```
*(Note on lyrics in Webhook: The actual lyrics generated by Udio are typically found in `output.songs[].lyrics`. The `input` section in the webhook payload echoes the original input parameters. If `lyrics_type` was 'user', the original user-provided lyrics were sent in `input.lyrics` during the POST request to create the task, and might be echoed here.)*

## Key Implementation Files

-   `src/lib/piapi.ts`: Contains `createMusicGenerationTask` to interact with PiAPI's `/api/v1/task` endpoint.
-   `src/services/lyricGenerationService.ts`: Generates lyrics using Claude API.
-   `src/services/songService.ts`: Orchestrates song creation and updates.
-   `supabase/functions/piapi-webhook/index.ts`: Handles incoming webhook notifications from PiAPI.
-   `src/store/songStore.ts`: Manages song state in the frontend.

## Authentication

-   **PiAPI Key**: Stored as `VITE_PIAPI_KEY`. Used in `x-api-key` header for requests to PiAPI.
-   **Webhook Secret**: Stored as `VITE_WEBHOOK_SECRET`. Sent in the `config.webhook_config.secret` during task creation and used by your webhook function to verify incoming PiAPI notifications.

## Error Handling

-   Timeouts are implemented for API calls in `src/lib/piapi.ts` and `src/services/lyricGenerationService.ts`.
-   Errors from PiAPI/Udio are caught, logged, and update the song record.
-   Webhook handler includes error checking.

## PIAPI Field Character Limits (Implemented in `src/lib/piapi.ts`)

These limits are generally enforced by `src/lib/piapi.ts` before sending data to the API, based on previous testing and API behavior.

| API Field Name (in POST `input`) | Character Limit        | Notes / Based On                                     |
|----------------------------------|------------------------|------------------------------------------------------|
| `lyrics`                         | 1000 characters        | `PIAPI_LIMITS.PROMPT_MAX_LENGTH` in `piapi.ts`         |
| `negative_tags`                  | 100 characters         | `PIAPI_LIMITS.NEGATIVE_TAGS_MAX_LENGTH` in `piapi.ts`  |
| `gpt_description_prompt`         | 10,000 characters      | `PIAPI_LIMITS.DESCRIPTION_MAX_LENGTH` in `piapi.ts`    |
| `title`                          | At least 300 chars     | No explicit truncation in `piapi.ts` beyond service gen. |

### Details of Testing/Implementation Notes:

- **`input.lyrics`**: When `lyrics_type` is 'user', these are the full lyrics (often generated by `LyricGenerationService` aiming for 750-1000 characters) sent to PiAPI. Truncated to 1000 chars by `piapi.ts` if longer.
- **`input.negative_tags`**: Truncated to 100 chars by `piapi.ts`.
- **`input.gpt_description_prompt`**: Truncated to 10,000 chars by `piapi.ts`.
- **`input.title`**: Generated by `SongPromptService`; no further truncation in `piapi.ts`.

## Notes

-   The `song_type` from BabyMusic AI's internal logic (`preset`, `theme`, `theme-with-input`, `from-scratch`) influences the `lyrics_type` and content of `gpt_description_prompt` / `lyrics` sent to PiAPI.
-   User input from `LyricsInput.tsx` (max 180 characters) serves as a hint for `LyricGenerationService` (Claude API) when `lyrics_type` implies AI lyric generation.
-   The PiAPI documentation also mentions a `task_type` of `generate_music_custom`, but current implementation uses `generate_music`.
-   Song extension capability (`continue_song_id`, `continue_at`) exists in PiAPI but is not currently used by `createMusicGenerationTask`.
