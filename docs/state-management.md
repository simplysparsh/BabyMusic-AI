# State Management

Baby Music AI uses Zustand, a lightweight state management library, to manage the application state. Zustand provides a simple and intuitive way to create and manage global state stores in React applications.

## Zustand Stores

The application defines several Zustand stores to manage different aspects of the state:

### `authStore`

The `authStore` manages user authentication and profile information. It includes the following state variables and actions:

- `user`: The currently authenticated user object, containing properties like `id`, `email`, and `name`.
- `isAuthenticated`: A boolean indicating whether the user is authenticated or not.
- `login(email, password)`: An action to log in the user with the provided email and password.
- `logout()`: An action to log out the current user.
- `register(email, password, name)`: An action to register a new user with the provided email, password, and name.
- `updateProfile(profile)`: An action to update the user's profile information.

### `uiStore` (Onboarding Modal State)

The onboarding modal state is managed in Zustand for UI control. However, for OAuth signups (which involve a full-page redirect), a hybrid approach is used:

- **Email signup:** Zustand state is used to control the onboarding modal. The modal appears immediately after signup.
- **OAuth signup:** Before redirecting to the OAuth provider, a flag (`onboardingInProgress`) and the signup method are set in `localStorage`. After the user is redirected back and the app reloads, the app checks for this flag on initialization. If present, it triggers the onboarding modal via Zustand and then clears the flag. This ensures the onboarding modal appears even after a full page reload caused by OAuth redirects.

### `songStore`

The `songStore` manages the state related to songs, including the song list, generation status, and selected song. It includes the following state variables and actions:

- `songs`: An array of song objects, containing properties like `id`, `name`, `audioUrl`, and `status`.
- `selectedSong`: The currently selected song object.
- `generateSong(parameters)`: An action to initiate a new song generation with the provided parameters.
- `fetchSongs()`: An action to fetch the list of songs from the backend API.
- `selectSong(song)`: An action to set the selected song.

### `audioStore`

The `audioStore` manages the state related to audio playback, including the currently playing song and playback controls. It includes the following state variables and actions:

- `currentSong`: The currently playing song object.
- `isPlaying`: A boolean indicating whether a song is currently playing or not.
- `play(song)`: An action to start playing the provided song.
- `pause()`: An action to pause the currently playing song.
- `stop()`: An action to stop the currently playing song.
- `seek(time)`: An action to seek to a specific time in the currently playing song.

### `errorStore`

The `errorStore` manages the state related to application errors and error handling. It includes the following state variables and actions:

- `errors`: An array of error objects, containing properties like `id`, `message`, and `type`.
- `addError(error)`: An action to add a new error to the store.
- `removeError(id)`: An action to remove an error from the store by its ID.
- `clearErrors()`: An action to clear all errors from the store.

### `streakStore`

The `streakStore` manages the state related to the user's daily activity streak. It includes:

- `streakData`: An object containing `currentStreak` (number) and `lastActiveDate` (string), or `null` if not loaded.
- `isLoading`: A boolean indicating if streak data is currently being fetched.
- `error`: Stores any error message related to fetching streak data.
- `setStreakData(data)`: Action to update the streak data.
- `setLoading(loading)`: Action to set the loading state.
- `setError(error)`: Action to set an error message.

## Hybrid Onboarding Modal State (Zustand + localStorage)

- Zustand is used for all UI state, including the onboarding modal.
- For OAuth signups, a flag is set in localStorage before redirect to persist onboarding intent across the full-page reload.
- On app initialization, the app checks for this flag and, if present, triggers the onboarding modal via Zustand and clears the flag.
- This ensures a seamless onboarding experience for both email and OAuth signups.

## Enhanced Supabase Client

The application uses an enhanced Supabase client wrapper to handle authentication token refreshing and error recovery, particularly for Edge Function calls:

### `supabaseWithRetry`

This wrapper extends the standard Supabase client with additional error handling and automatic retry logic:

- **Token Refresh Logic**: Automatically refreshes JWT tokens when they become stale
- **Error Detection**: Identifies authentication errors in Edge Function responses
- **Automatic Retry**: Retries failed operations with fresh tokens
- **Timeout Management**: Implements request timeouts to prevent UI getting stuck on pending requests
- **Fallback Paths**: Provides graceful degradation when backend services are temporarily unavailable

### Token Management Functions

Several utility functions manage authentication token lifecycles:

- `startTokenRefresh()`: Begins periodic token refresh (called when user logs in)
- `stopTokenRefresh()`: Ends periodic token refresh (called when user logs out)
- `forceTokenRefresh()`: Immediately refreshes the token before critical operations

### App Integration

Token refresh mechanisms are integrated with the React component lifecycle:

- **App Component**: Starts token refresh on mount if user is authenticated
- **Visibility Events**: Refreshes tokens when the browser tab regains focus
- **Cleanup**: Stops refresh timers when components unmount
- **Critical Operations**: Forces refresh before important user actions

This enhanced client ensures that the application maintains valid authentication tokens even during extended sessions, preventing disruptions to the user experience, particularly during music playback sessions.

## Usage in Components

Components can access the state and actions from the Zustand stores using the `useStore` hook provided by Zustand. For example, to access the `authStore` in a component:

```typescript
import { useAuthStore } from '../store/authStore';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Use the state variables and actions in the component
  // ...
};
```

By using Zustand stores (and the hybrid onboarding modal approach for OAuth), Baby Music AI can efficiently manage the application state, keep the components focused on rendering and user interactions, and ensure a smooth and responsive user experience.
