# Backend Services

The Baby Music AI backend is powered by Supabase, an open-source Firebase alternative that provides a set of backend services for building modern applications.

## Database

Supabase provides a PostgreSQL database for storing application data. The database schema for Baby Music AI includes the following main tables:

- `users`: Stores user information, such as email, name, and authentication details.
- `songs`: Stores information about generated songs, including the user ID, song name, audio URL, and creation date.
- `song_variations`: Stores variations of generated songs, linked to the main song via a foreign key.
- `presets`: Stores preset song templates for specific moments, such as playtime or bedtime.

The database also includes additional tables for managing user preferences, favorites, and other application-specific data.

## Authentication

Supabase provides a built-in authentication system that supports various authentication methods, such as email/password, OAuth, and magic links. Baby Music AI uses email/password authentication for user registration and login.

The authentication flow works as follows:

1. Users register with their email and password.
2. Supabase creates a new user record in the `users` table and sends a confirmation email.
3. Users confirm their email address by clicking the confirmation link.
4. Users log in with their email and password, and Supabase returns a JSON Web Token (JWT) that can be used to authenticate subsequent requests.

The frontend stores the JWT in local storage and includes it in the `Authorization` header of API requests to authenticate the user.

## Storage

Supabase provides a storage service for storing and serving user-generated content, such as audio files. Baby Music AI uses this service to store generated song audio files.

When a song is generated, the audio file is uploaded to Supabase storage, and the URL of the file is stored in the `songs` table. The frontend can then retrieve the audio URL from the database and use it to play the song or provide download links.

## API Endpoints

The backend exposes a set of API endpoints for interacting with the application data and services. These endpoints are implemented using Supabase Edge Functions, which are serverless functions that run on the Supabase infrastructure.

The main API endpoints include:

- `/api/songs`: Handles song generation requests, retrieves song lists, and manages song metadata.
- `/api/presets`: Retrieves preset song templates and manages preset data.
- `/api/auth`: Handles user registration, login, and authentication-related tasks.

The API endpoints are secured using JWT authentication, and the Edge Functions verify the JWT before processing the request.

## Webhooks

Supabase supports webhooks for real-time event notifications. Baby Music AI uses webhooks to receive notifications from external services, such as PIAPI.ai, when song generation tasks are completed.

The webhook endpoint is implemented as an Edge Function that listens for incoming HTTP POST requests. When a webhook event is received, the Edge Function validates the request signature, extracts the relevant data, and updates the corresponding song record in the database.

By leveraging Supabase's backend services, Baby Music AI can focus on delivering a seamless user experience while benefiting from a scalable, secure, and feature-rich backend infrastructure.
