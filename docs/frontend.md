# Frontend Components

The Baby Music AI frontend is built using React and consists of several key components that work together to provide a seamless user experience.

## Page Structure

The application consists of three main pages:

1. **Landing Page** (`Landing.tsx`): Serves as the entry point for new users, showcasing the app's features and benefits. Includes multiple sections like Hero, Features, and CTAs.

2. **Dashboard** (`Dashboard.tsx`): The main interface for authenticated users, where they can create and manage songs.

3. **Methodology** (`Methodology.tsx`): An informational page explaining the science and research behind the app.

## Authentication Components

### AuthModal

The `AuthModal` component handles both sign-in and sign-up flows. Key features include:

- Multi-step registration process
- Email and password validation
- Error handling for various authentication scenarios
- Seamless transition to onboarding flow after successful registration

#### Hybrid Onboarding Modal State (Zustand + localStorage)

- The onboarding modal is managed in Zustand for UI state.
- For email signup, the modal appears immediately after signup.
- For OAuth signup, a flag is set in localStorage before redirect. After the user returns and the app reloads, the app checks this flag and triggers onboarding via Zustand, then clears the flag. This ensures onboarding is shown even after a full page reload caused by OAuth redirects.

### OnboardingModal

The `OnboardingModal.tsx` component guides new users through setting up their baby's profile after registration:

- Multi-step wizard interface
- Collection of baby information (name, birth date, gender)
- Age group determination based on birth date
- Profile creation and updates through Supabase

```jsx
// Example from OnboardingModal.tsx
const handleComplete = async () => {
  // Validation logic
  try {
    // Update profile with birth data
    const updatedProfile = await updateProfile({
      babyName,
      birthMonth,
      birthYear,
      ageGroup: getAgeGroup(birthMonth, birthYear),
      gender
    });
    
    // Complete onboarding flow
    onComplete({
      babyName,
      birthMonth,
      birthYear,
      ageGroup: getAgeGroup(birthMonth, birthYear),
      gender
    });
  } catch (error) {
    // Error handling
  }
};
```

## Main Feature Components

### MusicGenerator

The `MusicGenerator` component is responsible for handling music generation requests. It allows users to select various options, such as mood, instruments, and style, and sends these parameters to the backend API for processing. The component also displays real-time generation status updates to keep users informed about the progress of their requests.

### SongList

The `SongList` component displays a list of generated songs along with their variations. It provides playback controls, allowing users to listen to their songs directly in the browser. Additionally, it offers download and share options, enabling users to save their favorite melodies or share them with others.

### PresetSongs

The `PresetSongs` component offers a collection of pre-generated songs tailored for specific moments in a baby's day, such as playtime, mealtime, or bedtime. These songs are customized based on the user's preferences and provide quick access to high-quality, age-appropriate melodies.

## State Management

The application uses Zustand for state management with several key stores:

- **authStore**: Manages user authentication state, profile data, and auth-related methods
- **songStore**: Manages song data, generation, and song-related operations
- **errorStore**: Centralized error handling and user notifications

Example of authStore usage:

```typescript
const { user, profile, signIn, signUp, loadProfile } = useAuthStore();

// Handle authentication
await signIn(email, password);

// Access user data
if (user && profile) {
  // Use authenticated user data
}
```

## Component Interaction

The frontend components interact with each other and the backend through various mechanisms:

- **State Management**: The components rely on Zustand stores to manage their state and share data across the application.

- **API Calls**: Components make API calls to the backend to request song generation, retrieve song lists, and perform other operations.

- **Event Handlers**: Components communicate with each other through event handlers and callbacks.

## UI/UX Considerations

The frontend components are designed with user experience in mind, incorporating:

- **Responsive Design**: All components work well across device sizes
- **Animations and Transitions**: Smooth visual effects enhance the experience
- **Real-time Feedback**: Status updates keep users informed
- **Intuitive Controls**: Easy-to-use interface for all features

By leveraging these UI/UX considerations and the power of React, the Baby Music AI frontend components work together to create a seamless, engaging, and user-friendly experience for parents and their little ones.

## Progressive Web App (PWA) Features

The frontend is enhanced with PWA capabilities to provide a more native app-like experience, primarily through the `vite-plugin-pwa` Vite plugin.

- **Manifest Generation**: A `manifest.webmanifest` is automatically generated, including app name, icons, theme colors, start URL, and display mode (`standalone`). This enables the "Add to Home Screen" functionality.
- **Service Worker**: A service worker is generated (using Workbox via the plugin) to cache application assets. This improves load times and provides basic offline fallback capabilities. The service worker is configured to auto-update when new versions of the app are deployed.
- **Asset Generation**: PWA-specific icons (for the manifest, Apple touch icons, favicons) are generated from `public/logo.svg` using `@vite-pwa/assets-generator`. This process is configured in `pwa-assets.config.ts`.
- **Richer Install UI**: Screenshots of the application (stored in `public/screenshots/`) are included in the manifest to provide users with a preview during the PWA installation process on supported platforms.
- **User-Initiated Installation Prompts**:
    - An **"Get App" button** is available in the application header, allowing users to install the PWA at any time if they haven't already.
    - During the **onboarding flow** (`OnboardingModal.tsx`), after initial profile setup, users are prompted with an "Unlock Full Experience" button to install the PWA.
    - These UI elements utilize the `beforeinstallprompt` event to trigger the native browser installation prompt on supported platforms (e.g., Android, Desktop Chrome).
    - For iOS devices, where direct prompting isn't available, these buttons trigger a modal (`IOSInstallModal.tsx`) that provides clear instructions on how to use Safari's "Add to Home Screen" feature.
    - The `usePWAInstall.ts` custom hook encapsulates the logic for detecting installability, handling the `beforeinstallprompt` event, and managing installation state.

These features contribute to making BabyMusic AI installable and more accessible, behaving more like a native application on users' devices.
