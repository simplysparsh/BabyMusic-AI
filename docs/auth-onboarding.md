# Authentication and Onboarding

This document provides a detailed overview of the authentication and onboarding flow in Baby Music AI, explaining the implementation details and code structure.

## Authentication Flow

The authentication process in Baby Music AI is implemented using Supabase Authentication services and consists of the following components:

### 1. Authentication Store

The `authStore.ts` file manages the authentication state and provides methods for user operations:

```typescript
// Key interfaces and state from authStore.ts
interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  initialized: boolean;
  isLoading: boolean;
  
  loadProfile: () => Promise<void>;
  updateProfile: (updates: { 
    babyName: string; 
    preferredLanguage?: Language;
    birthMonth?: number;
    birthYear?: number;
    ageGroup?: AgeGroup;
    gender?: string;
  }) => Promise<UserProfile>; 
  
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, babyName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void | (() => void)>;
}
```

### 2. Auth Modal Component

The `AuthModal.tsx` component provides the UI for user authentication:

- Handles both sign-in and sign-up flows
- Implements multi-step registration (baby name first, then credentials)
- Validates user input and displays appropriate error messages
- Transitions to the onboarding flow after successful registration

### 3. Authentication Process

#### Sign Up:
1. User enters baby name on the first screen
2. User provides email and password on the second screen
3. The system creates a new user account in Supabase
4. On successful signup, the system shows the onboarding modal

#### Sign In:
1. User enters email and password
2. The system authenticates the user via Supabase
3. On successful authentication, the system loads the user profile
4. User is redirected to the dashboard

### 4. Error Handling

The authentication flow includes robust error handling for various scenarios:

- Email validation errors
- Password strength requirements
- Existing email detection
- Network and server errors
- Authentication failures

## Onboarding Flow

After a successful registration, new users go through an onboarding process to complete their profile:

### 1. Onboarding Modal Component

The `OnboardingModal.tsx` component guides users through the onboarding process:

- Collects additional information about the baby
- Updates the user profile with the collected information
- Initializes preset songs based on the baby's profile

### 2. Onboarding Steps

The onboarding process consists of the following steps:

#### Step 1: Gender Selection
- User selects the baby's gender
- The selection is validated before proceeding

#### Step 2: Birth Date Selection
- User selects the baby's birth month and year
- System automatically determines the appropriate age group
- Birth date is validated (cannot be in the future)

### 3. Profile Update

Once all information is collected, the system:

1. Updates the user profile in Supabase
2. Initiates background generation of preset songs
3. Completes the onboarding process and redirects to the dashboard

```typescript
// Example profile update code
const updatedProfile = await updateProfile({
  babyName,
  birthMonth,
  birthYear,
  ageGroup: getAgeGroup(birthMonth, birthYear),
  gender
});

// Trigger preset song generation
SongService.regeneratePresetSongs(user.id, babyName)
  .catch(error => {
    console.error('Background preset song regeneration failed:', error);
  });
```

## Session Management

The application implements persistent session management:

- JWT tokens for authentication
- Automatic session restoration on page reload
- Session expiration handling
- Profile data caching and synchronization

## Security Considerations

The authentication and onboarding system implements several security measures:

- Password strength requirements
- Secure JWT token handling
- Protection against common attacks
- Input validation and sanitization
- Rate limiting on authentication attempts

## Implementation Notes

- The authentication state is managed by Zustand for a clean and reactive approach
- Modals use React hooks to manage their state and transitions
- Form validation is performed both on the client and server side
- Error messages are user-friendly and actionable
- The flow is designed to be intuitive and minimize friction

## Future Improvements

Potential improvements to the authentication and onboarding flow include:

- Social authentication options (Google, Apple, etc.)
- Email verification step
- More detailed profile customization options
- Progress saving during the onboarding process
- Enhanced security features like 2FA 