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

```jsx
// Example from AuthModal.tsx
const handleCredentialsSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (isSignIn) {
    // Handle sign-in logic
  } else {
    // Handle sign-up logic and transition to onboarding
    try {
      await signUp(trimmedEmail, password, trimmedBabyName);
      setShowOnboarding(true);
    } catch (err) {
      // Error handling
    }
  }
};
```

### OnboardingModal

The `OnboardingModal` component guides new users through setting up their baby's profile after registration:

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
