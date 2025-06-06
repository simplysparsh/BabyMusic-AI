# Architecture Overview

Baby Music AI follows a modern web application architecture, leveraging a React frontend, a Supabase backend, and integrations with various AI APIs for music and lyric generation.

## Frontend

The frontend is built using the following technologies:

- **React**: A JavaScript library for building user interfaces
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript
- **Vite**: A fast build tool and development server
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **Zustand**: A small, fast, and scalable state management solution

The frontend is organized into the following main directories:

- `src/components`: Contains reusable React components
  - `auth/`: Authentication and onboarding components
  - `common/`: Shared UI components
  - `dashboard/`: Dashboard UI components
  - `landing/`: Landing page sections
  - `music-generator/`: Music generation UI components
  - `preset/`: Preset song configurations
  - `profile/`: User profile management
- `src/hooks`: Contains custom React hooks
- `src/lib`: Contains utility libraries and API integrations
- `src/pages`: Main application pages (Landing, Dashboard, Methodology)
- `src/services`: Contains business logic services
- `src/store`: Contains Zustand state management stores
- `src/types`: Contains TypeScript type definitions

## Backend

The backend is powered by Supabase, an open-source Firebase alternative. Supabase provides the following services:

- **PostgreSQL Database**: A powerful, open-source object-relational database
- **Authentication**: User authentication and authorization using JWT tokens
- **Storage**: File storage for user-generated content and audio files
- **Edge Functions**: Serverless functions for custom backend logic
- **Real-time**: WebSocket-based real-time updates for live data synchronization

The backend is organized into the following main directories:

- `supabase/functions`: Contains Supabase Edge Functions
- `supabase/migrations`: Contains database migration files

## Real-time Data Synchronization

Baby Music AI implements a robust real-time data synchronization system using a custom `RealtimeHandler` class that provides enhanced reliability and user experience over standard Supabase real-time subscriptions.

### RealtimeHandler Architecture

The `RealtimeHandler` (`src/lib/realtimeHandler.ts`) is a comprehensive solution that addresses common real-time connection issues:

**Key Features:**

1. **Factory-Based Channel Recreation**: Uses channel factories instead of static channels, enabling proper reconnection after errors
2. **Token Expiration Handling**: Automatically detects and handles Supabase token expiration scenarios
3. **Tab Visibility Management**: Intelligently disconnects from real-time when tabs are hidden for extended periods (configurable timeout)
4. **Auto-Reconnection**: Automatically reconnects timed-out channels unless the tab is hidden
5. **Comprehensive Error Handling**: Handles various error states with appropriate callbacks and recovery mechanisms

**Integration Pattern:**

```typescript
// Central instance in src/lib/supabase.ts
export const realtimeHandler = new RealtimeHandler(supabase, {
  inactiveTabTimeoutSeconds: 10 * 60 // 10 minutes
});

// Channel factories for different data types
const songsChannelFactory: ChannelFactory = (supabase) => {
  return supabase
    .channel(`songs-${userId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'songs',
      filter: `user_id=eq.${userId}`,
    }, handleSongUpdate);
};

// Usage in subscription management
const cleanup = realtimeHandler.addChannel(songsChannelFactory, {
  onSubscribe: (channel) => console.log(`Connected to ${channel.topic}`),
  onTimeout: (channel) => console.log(`Timeout in ${channel.topic}`),
  onError: (channel, error) => console.error(`Error in ${channel.topic}:`, error)
});
```

**Benefits Over Standard Subscriptions:**

- **Eliminates Button Unresponsiveness**: Resolves issues where UI buttons became unresponsive after tab switching or idle periods
- **Better Resource Management**: Automatically manages connections based on tab visibility
- **Improved Reliability**: Handles network issues, token expiration, and connection timeouts gracefully
- **Debugging Support**: Comprehensive logging and test utilities for troubleshooting

**Implementation Files:**

- `src/lib/realtimeHandler.ts`: Core RealtimeHandler implementation
- `src/store/song/subscriptions.ts`: Song-specific subscription management using RealtimeHandler
- `src/utils/testRealtimeHandler.ts`: Browser-based testing utilities for real-time functionality

## Authentication & Onboarding Flow

The application implements a comprehensive authentication and onboarding process:

1. **User Registration**:
   - Basic user registration with email, password, and baby name
   - Account creation via Supabase Auth

2. **Onboarding Flow**:
   - Multi-step onboarding process to collect baby information
   - Birth date selection with month/year
   - Gender selection
   - Age group determination based on birthdate

3. **Profile Management**:
   - User profiles stored in Supabase's `profiles` table
   - Profile data includes baby name, language preference, birth info

4. **Session Management**:
   - JWT-based authentication
   - Supabase's automatic token refresh with built-in session persistence
   - Profile loading on authentication

## Streak Tracking

The application implements a daily activity streak feature:

- **Data Storage**: Streak data (`current_streak`, `last_active_date`) is stored in the `profiles` table in Supabase.
- **Update Logic**: A PL/pgSQL database function (`update_user_streak`) handles the core logic for incrementing or resetting the streak based on the user's last active date. This function is triggered when the user's profile is loaded (effectively on app open).
- **Frontend State**: A dedicated Zustand store (`streakStore`) manages the streak data on the frontend.
- **Service Layer**: A `streakService` handles fetching streak data and triggering the update function.
- **UI Components**: `MiniStreak` and `DetailedStreak` components display the streak information.

## API Integrations

Baby Music AI integrates with the following external APIs:

- **PIAPI.ai**: A music generation API that creates unique, personalized songs
- **Anthropic Claude**: An AI-powered API for generating song lyrics based on themes and moods

The API integrations are managed through the following files:

- `src/lib/piapi.ts`: Handles PIAPI.ai music generation requests and webhook integration
- `src/lib/claude.ts`: Handles Anthropic Claude API requests for lyric generation

## Data Flow

The typical data flow in the application is as follows:

1. The user interacts with the React frontend, triggering actions in the Zustand stores
2. The Zustand stores update the application state and make API requests to the backend or external APIs
3. The backend (Supabase) handles database operations, file storage, and authentication
4. External APIs (PIAPI.ai and Anthropic Claude) process requests for music and lyric generation
5. **Real-time updates are received through the RealtimeHandler system**, ensuring the frontend stays synchronized with database changes
6. The frontend receives responses from the backend and external APIs, updating the UI accordingly

## Deployment

The application is deployed on Netlify, with the following configuration:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Functions Directory**: `netlify/functions`
- **Redirects**: All routes redirect to `index.html` to support SPA routing

This architecture allows for a scalable, modular, and maintainable application that can easily integrate with various AI services and backend providers.

## Progressive Web App (PWA) Integration

To enhance user experience and provide app-like capabilities, Baby Music AI is configured as a Progressive Web App (PWA). This allows users to "install" the application to their home screen on mobile devices and use it as a standalone app.

### Key PWA Features Implemented:

*   **Web App Manifest (`manifest.webmanifest`):**
    *   Configured via `vite-plugin-pwa` in `vite.config.ts`.
    *   Defines app name (`TuneLoom`), short name (`TuneLoom`), start URL (`/`), display mode (`standalone`), theme colors, and icons.
    *   Includes icons of various sizes generated from `public/logo.svg` by `@vite-pwa/assets-generator`.
    *   Specifies screenshots for a richer installation UI on supported platforms.
*   **Service Worker:**
    *   Generated automatically by `vite-plugin-pwa` using Workbox.
    *   Handles pre-caching of core application assets for basic offline availability and faster loads.
    *   Configured for `autoUpdate` to seamlessly update the service worker when new app versions are deployed.
*   **"Add to Home Screen" (A2HS) Functionality:**
    *   The PWA setup (manifest, service worker) enables browsers to offer an "Add to Home Screen" option.
    *   This is actively facilitated through custom UI elements: an "Get App" button in the header and a dedicated step in the onboarding flow. These elements either trigger the browser's native install prompt (via the `beforeinstallprompt` event) or provide guided instructions for iOS users. More details on the UI implementation can be found in `frontend.md`.
*   **PWA Assets Generation:**
    *   Icons (including favicons, Apple touch icons, and various PWA icon sizes) are generated from `public/logo.svg` using `@vite-pwa/assets-generator`.
    *   The generation is configured in `pwa-assets.config.ts` and can be run with `npm run generate-pwa-assets`.
    *   Generated assets are placed in the `public` directory and linked in `index.html` and the web app manifest.

### Configuration Files:

*   `vite.config.ts`: Contains the main `VitePWA` plugin configuration, including manifest details.
*   `pwa-assets.config.ts`: Configures the PWA assets generator.
*   `index.html`: Includes links for favicons and Apple touch icons. The manifest link is auto-injected.
*   `public/logo.svg`: The source image for all generated PWA icons.
*   `public/screenshots/`: Contains screenshots for the PWA installation prompt.

This PWA setup provides a more integrated and accessible experience for users, particularly on mobile devices.
