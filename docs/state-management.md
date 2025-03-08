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

By using Zustand stores, Baby Music AI can efficiently manage the application state, keep the components focused on rendering and user interactions, and ensure a smooth and responsive user experience.
