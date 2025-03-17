This file is a merged representation of the entire codebase, combined into a single document by Repomix. The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information

## Additional Info

# Directory Structure
```
.bolt/
  config.json
  prompt
docs/
  api-integration.md
  architecture.md
  backend.md
  contributing.md
  deployment.md
  frontend.md
  README.md
  security.md
  state-management.md
netlify/
  functions/
    waitlist.ts
scripts/
  lint/
    .eslintrc.js
    fix-imports.mjs
    fix-unused-vars.mjs
    README.md
  check-for-secrets.ts
  check-stuck-tasks.ts
  fix-stuck-tasks.ts
  fix-task-ids.ts
  list-songs.ts
  README.md
  setup-env.ts
  update-song-audio.ts
src/
  components/
    auth/
      AuthModal.tsx
      OnboardingModal.tsx
    common/
      SongGenerationTimer.tsx
    dashboard/
      DetailedStreak.tsx
      MiniStreak.tsx
    landing/
      Benefits.tsx
      CTASection.tsx
      Features.tsx
      Hero.tsx
      ProblemSolution.tsx
      ResearchInstitutions.tsx
      VideoEvidence.tsx
    music-generator/
      CustomOptions.tsx
      GenerationProgress.tsx
      LyricsInput.tsx
      themeData.ts
      ThemeSelector.tsx
      VoiceSelector.tsx
    preset/
      PresetSongCard.tsx
    profile/
      ProfileModal.tsx
    EmailSignupForm.tsx
    Footer.tsx
    Header.tsx
    MusicGenerator.tsx
    PresetSongs.tsx
    SongItem.tsx
    SongList.tsx
  data/
    lyrics/
      index.ts
      presets.ts
      themes.ts
  hooks/
    useAuthModal.ts
    useEmailSignup.ts
    usePresetSongs.ts
    useRealtime.ts
    useResetGenerating.ts
    useSongGenerationTimer.ts
  lib/
    claude.ts
    piapi.ts
    supabase.ts
  pages/
    Dashboard.tsx
    Landing.tsx
    Methodology.tsx
  services/
    lyricGenerationService.ts
    profileService.ts
    songPromptService.ts
    songService.ts
    songStateService.ts
  store/
    song/
      handlers/
        songSubscriptionHandlers.ts
        variationSubscriptionHandlers.ts
      actions.ts
      subscriptions.ts
      types.ts
    appStore.ts
    audioStore.ts
    authStore.ts
    errorStore.ts
    songStore.ts
  types/
    index.ts
  utils/
    presetUtils.ts
    validation.ts
  App.tsx
  index.css
  main.tsx
  vite-env.d.ts
supabase/
  functions/
    piapi-webhook/
      index.ts
  migrations/
    20250210084713_ivory_stream.sql
    20250210085258_navy_temple.sql
    20250210102620_humble_oasis.sql
    20250210210424_lingering_wildflower.sql
    20250210221235_purple_pebble.sql
    20250211175629_fierce_waterfall.sql
    20250211185720_long_shadow.sql
    20250211185721_fierce_island.sql
    20250211190439_late_temple.sql
    20250211193819_shiny_coral.sql
    20250211233356_fierce_cloud.sql
    20250211233423_rustic_math.sql
    20250211233856_autumn_plain.sql
    20250212033025_holy_rain.sql
    20250212074154_red_harbor.sql
    20250212082359_mute_meadow.sql
    20250216081442_fragrant_temple.sql
    20250216081622_throbbing_butterfly.sql
    20250216082214_square_wood.sql
    20250216083215_bitter_villa.sql
    20250216083400_navy_mud.sql
    20250216083545_tiny_sun.sql
    20250216083811_restless_dream.sql
    20250216083904_sunny_hall.sql
    20250216084301_navy_snowflake.sql
    20250216084749_solitary_thunder.sql
    20250216084843_gentle_torch.sql
    20250216090822_young_manor.sql
    20250216090848_frosty_sun.sql
    20250216090937_heavy_rain.sql
    20250216091423_amber_mouse.sql
    20250216091643_square_cloud.sql
    20250216220716_silver_river.sql
    20250216224920_small_valley.sql
    20250216225307_warm_stream.sql
    20250216225549_rapid_plain.sql
    20250217001623_copper_math.sql
    20250217015148_light_cake.sql
    20250217015700_crystal_wildflower.sql
    20250217015936_plain_temple.sql
    20250219234733_curly_boat.sql
    20250220003421_stark_dream.sql
    20250220004702_mute_union.sql
    20250220004802_young_desert.sql
    20250221010539_calm_rain.sql
    20250221014644_super_mouse.sql
    20250221014651_warm_sea.sql
    20250222071320_aged_darkness.sql
    20250222223841_rough_cherry.sql
    20250222223949_fading_grass.sql
    20250303195224_add_gender_to_profiles.sql
    20250303204200_database_schema_baseline.sql
    20250304020456_make_gender_mandatory.sql
    20250306200022_baseline_schema.sql
    20250306222659_drop_auto_profile_trigger.sql
    20250306224039_allow_null_gender.sql
    20250307172057_cleanup_status_fields_and_logs.sql
    20250316000000_fix_profile_and_song_issues.sql
    20250316145618_schema_baseline_complete.sql
  .gitignore
  config.toml
.eslintrc.cjs
.gitignore
claude_api.md
eslint.config.js
index.html
LICENSE
netlify.toml
package.json
postcss.config.js
README.md
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: .bolt/config.json
````json
{
  "template": "bolt-vite-react-ts"
}
````

## File: .bolt/prompt
````
For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.

By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.

Use icons from lucide-react for logos.

Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.

If a file exceeds 350 lines, abstract the code into multiple files.
````

## File: docs/api-integration.md
````markdown
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
````

## File: docs/architecture.md
````markdown
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
- `src/hooks`: Contains custom React hooks
- `src/lib`: Contains utility libraries and API integrations
- `src/services`: Contains business logic services
- `src/store`: Contains Zustand state management stores
- `src/types`: Contains TypeScript type definitions

## Backend

The backend is powered by Supabase, an open-source Firebase alternative. Supabase provides the following services:

- **PostgreSQL Database**: A powerful, open-source object-relational database
- **Authentication**: User authentication and authorization using JWT tokens
- **Storage**: File storage for user-generated content and audio files
- **Edge Functions**: Serverless functions for custom backend logic

The backend is organized into the following main directories:

- `supabase/functions`: Contains Supabase Edge Functions
- `supabase/migrations`: Contains database migration files

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
5. The frontend receives responses from the backend and external APIs, updating the UI accordingly

This architecture allows for a scalable, modular, and maintainable application that can easily integrate with various AI services and backend providers.
````

## File: docs/backend.md
````markdown
# Backend Services

The Baby Music AI backend is powered by Supabase, an open-source Firebase alternative that provides a set of backend services for building modern applications.

## Database

Supabase provides a PostgreSQL database for storing application data. The database schema for Baby Music AI includes the following main tables:

### Core Tables

- `profiles`: Stores user profile information, such as email, name, and authentication details.
- `songs`: Stores information about generated songs, including the user ID, song name, audio URL, task ID, error (if any), and creation date.
- `song_variations`: Stores variations of generated songs, linked to the main song via a foreign key. Contains audio URLs and metadata for each variation.

### Supporting Tables

- `song_generations`: Tracks the generation process of songs, including start time, completion time, and any errors that occur during generation.
- `lyric_generation_errors`: Logs errors that occur during lyric generation, including error messages and context (theme, mood, preset type). Used for monitoring and improving the lyric generation service.

The database schema is designed to support:
- User authentication and profile management
- Song generation and variation tracking
- Error logging and monitoring
- Real-time updates via Supabase's built-in change notification system

## Authentication

Supabase provides a built-in authentication system that supports various authentication methods, such as email/password, OAuth, and magic links. Baby Music AI uses email/password authentication for user registration and login.

The authentication flow works as follows:

1. Users register with their email and password.
2. Supabase creates a new user record and profile, and sends a confirmation email.
3. Users confirm their email address by clicking the confirmation link.
4. Users log in with their email and password, and Supabase returns a JSON Web Token (JWT) that can be used to authenticate subsequent requests.

The frontend stores the JWT in local storage and includes it in the `Authorization` header of API requests to authenticate the user.

## Storage

Supabase provides a storage service for storing and serving user-generated content, such as audio files. Baby Music AI uses this service to store generated song audio files.

When a song is generated, the audio file is uploaded to Supabase storage, and the URL of the file is stored in the `songs` or `song_variations` table. The frontend can then retrieve the audio URL from the database and use it to play the song or provide download links.

## API Endpoints

The backend exposes a set of API endpoints for interacting with the application data and services. These endpoints are implemented using Supabase Edge Functions, which are serverless functions that run on the Supabase infrastructure.

The main API endpoints include:

- `/api/songs`: Handles song generation requests, retrieves song lists, and manages song metadata.
- `/api/auth`: Handles user registration, login, and authentication-related tasks.

The API endpoints are secured using JWT authentication, and the Edge Functions verify the JWT before processing the request.

## Webhooks

Supabase supports webhooks for real-time event notifications. Baby Music AI uses webhooks to receive notifications from external services, such as PIAPI.ai, when song generation tasks are completed.

The webhook endpoint is implemented as an Edge Function that listens for incoming HTTP POST requests. When a webhook event is received, the Edge Function validates the request signature, extracts the relevant data, and updates the corresponding song record in the database.

By leveraging Supabase's backend services, Baby Music AI can focus on delivering a seamless user experience while benefiting from a scalable, secure, and feature-rich backend infrastructure.
````

## File: docs/contributing.md
````markdown
# Contributing to Baby Music AI

Thank you for your interest in contributing to the Baby Music AI project! We welcome contributions from the community to help improve and expand the application.

This document outlines the guidelines and best practices for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](../CODE_OF_CONDUCT.md). Please read it to understand the expectations we have for everyone who contributes to this project.

## Getting Started

To get started with contributing to Baby Music AI, follow these steps:

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Install the project dependencies by running `npm install`.
4. Create a new branch for your feature or bug fix: `git checkout -b my-feature-branch`.
5. Make your changes and commit them with descriptive commit messages.
6. Push your changes to your forked repository.
7. Create a pull request from your branch to the main repository's `main` branch.

## Coding Standards

To maintain a consistent and readable codebase, we follow these coding standards:

- Use meaningful and descriptive variable and function names.
- Follow the existing code style and formatting conventions.
- Write clear and concise comments to explain complex or non-obvious code.
- Use TypeScript for type safety and improved developer experience.
- Write unit tests for new features and bug fixes.
- Ensure that your code passes the existing tests and linting rules.

## Pull Request Process

When submitting a pull request, please follow these guidelines:

1. Provide a clear and descriptive title for your pull request.
2. Include a detailed description of the changes you made and the problem they solve.
3. Reference any related issues or pull requests using GitHub's linking syntax.
4. Ensure that your code follows the project's coding standards and passes all tests.
5. Be responsive to feedback and be willing to make changes if requested.

All pull requests will be reviewed by the project maintainers. We may request changes or ask for additional information before merging your pull request.

## Issue Reporting

If you encounter a bug or have a feature request, please submit an issue on the GitHub repository. When submitting an issue, please include the following information:

- A clear and descriptive title.
- A detailed description of the problem or feature request.
- Steps to reproduce the issue (for bugs).
- Any relevant error messages or screenshots.
- Your operating system and browser version (for frontend issues).

We will review your issue and provide feedback or updates as soon as possible.

## Documentation

Improving the project's documentation is always welcome. If you find any errors, typos, or areas that need clarification, please submit a pull request with your proposed changes.

When writing documentation, follow these guidelines:

- Use clear and concise language.
- Provide examples and code snippets when appropriate.
- Use proper formatting and markup (e.g., Markdown) for readability.
- Update the table of contents and any relevant links when adding new sections.

## Conclusion

We appreciate your contributions to the Baby Music AI project! By following these guidelines and working together, we can create a powerful and engaging application for parents and their little ones.

If you have any questions or need further assistance, please don't hesitate to reach out to the project maintainers.

Happy coding!
````

## File: docs/deployment.md
````markdown
# Deployment

This document provides instructions on how to deploy the Baby Music AI application to production environments.

## Prerequisites

Before deploying the application, ensure that you have the following:

- A Supabase project set up with the required database tables and configurations
- API keys for PIAPI.ai and Anthropic Claude
- A Netlify account for deploying the frontend
- The latest version of the application code

## Frontend Deployment

The Baby Music AI frontend is deployed using Netlify, a popular platform for deploying static websites and web applications.

To deploy the frontend:

1. Create a new site in your Netlify account.
2. Connect the site to your Git repository containing the frontend code.
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set the following environment variables in the Netlify site settings:
   - `VITE_SUPABASE_URL`: The URL of your Supabase project
   - `VITE_SUPABASE_ANON_KEY`: The anonymous key of your Supabase project
   - `VITE_PIAPI_KEY`: Your PIAPI.ai API key
   - `VITE_CLAUDE_API_KEY`: Your Anthropic Claude API key
5. Trigger a new deploy by pushing changes to your Git repository or manually deploying from the Netlify dashboard.

Netlify will automatically build and deploy your frontend application whenever changes are pushed to the connected Git repository.

## Backend Deployment

The Baby Music AI backend is deployed using Supabase Edge Functions, which are serverless functions that run on the Supabase infrastructure.

To deploy the backend:

1. Install the Supabase CLI by running `npm install -g supabase`.
2. Log in to your Supabase account using `supabase login`.
3. Link your local project to your Supabase project using `supabase link --project-ref your-project-ref`.
4. Deploy the Edge Functions by running `supabase functions deploy --no-verify-jwt`.
5. Set the required environment variables for your Edge Functions using `supabase secrets set`:
   - `PIAPI_KEY`: Your PIAPI.ai API key
   - `CLAUDE_API_KEY`: Your Anthropic Claude API key
   - `WEBHOOK_SECRET`: Your webhook secret for handling PIAPI.ai callbacks
6. Push the database schema and migrations using `supabase db push`.

Your backend Edge Functions and database schema will now be deployed and ready to handle requests from the frontend.

## Continuous Deployment

To automate the deployment process and enable continuous deployment, you can set up a CI/CD pipeline using tools like GitHub Actions or GitLab CI/CD.

The basic steps for setting up a CI/CD pipeline are:

1. Create a new workflow file in your Git repository (e.g., `.github/workflows/deploy.yml` for GitHub Actions).
2. Define the triggers for the workflow, such as pushing to the main branch or creating a new release.
3. Set up the required environment variables for your CI/CD pipeline, such as API keys and Supabase project details.
4. Add steps to your workflow to build and deploy the frontend and backend:
   - Install dependencies
   - Build the frontend
   - Deploy the frontend to Netlify
   - Install the Supabase CLI
   - Link the project to your Supabase project
   - Deploy the Edge Functions
   - Push the database schema and migrations
5. Commit and push the workflow file to your Git repository.

With a CI/CD pipeline in place, your application will be automatically deployed whenever changes are pushed to the specified branch or a new release is created.

## Monitoring and Error Tracking

To ensure the stability and reliability of your deployed application, it's important to set up monitoring and error tracking.

Some popular tools for monitoring and error tracking include:

- Sentry: For capturing and tracking frontend and backend errors
- New Relic: For monitoring application performance and identifying bottlenecks
- Supabase Logs: For monitoring and analyzing Supabase Edge Function logs
- Netlify Analytics: For tracking frontend usage and performance metrics

By setting up these tools and configuring appropriate alerts, you can proactively identify and resolve issues in your production environment.

## Conclusion

Deploying the Baby Music AI application involves deploying the frontend to Netlify, deploying the backend Edge Functions to Supabase, and setting up the required environment variables and database schema.

By following the steps outlined in this document and implementing a CI/CD pipeline, you can automate the deployment process and ensure a smooth and reliable deployment of your application to production environments.

Remember to monitor your application and set up error tracking to identify and resolve any issues that may arise in production.
````

## File: docs/frontend.md
````markdown
# Frontend Components

The Baby Music AI frontend is built using React and consists of several key components that work together to provide a seamless user experience.

## Main Components

### MusicGenerator

The `MusicGenerator` component is responsible for handling music generation requests. It allows users to select various options, such as mood, instruments, and style, and sends these parameters to the backend API for processing. The component also displays real-time generation status updates to keep users informed about the progress of their requests.

### SongList

The `SongList` component displays a list of generated songs along with their variations. It provides playback controls, allowing users to listen to their songs directly in the browser. Additionally, it offers download and share options, enabling users to save their favorite melodies or share them with others.

### PresetSongs

The `PresetSongs` component offers a collection of pre-generated songs tailored for specific moments in a baby's day, such as playtime, mealtime, or bedtime. These songs are customized based on the user's preferences and provide quick access to high-quality, age-appropriate melodies.

## Component Interaction

The frontend components interact with each other and the backend through various mechanisms:

- **State Management**: The components rely on Zustand stores (`songStore`, `audioStore`, etc.) to manage their state and share data across the application. When a component needs to update its state or access data from another component, it does so through the appropriate store.

- **API Calls**: Components like `MusicGenerator` and `SongList` make API calls to the backend to request song generation, retrieve song lists, and perform other operations. These calls are typically handled by service files in the `src/services` directory, which abstract away the details of the API communication.

- **Event Handlers**: Components communicate with each other through event handlers and callbacks. For example, when a user clicks the "Generate" button in the `MusicGenerator` component, it triggers a callback that sends a generation request to the backend and updates the `songStore` with the new song data.

## UI/UX Considerations

The frontend components are designed with user experience in mind. They incorporate the following UI/UX features:

- **Responsive Design**: All components are built using responsive design principles, ensuring that the application looks and functions well on a variety of devices and screen sizes.

- **Animations and Transitions**: The components utilize smooth animations and transitions to provide a polished and engaging user experience. These visual effects help guide users through the application and provide feedback on their actions.

- **Real-time Feedback**: Components like `MusicGenerator` and `SongList` provide real-time feedback and status updates to keep users informed about the progress of their requests and the state of their songs.

- **Intuitive Controls**: The components feature intuitive and easy-to-use controls for music playback, downloading, and sharing. These controls are designed to be accessible and straightforward, even for users with limited technical expertise.

By leveraging these UI/UX considerations and the power of React, the Baby Music AI frontend components work together to create a seamless, engaging, and user-friendly experience for parents and their little ones.
````

## File: docs/README.md
````markdown
# Baby Music AI Documentation

Welcome to the comprehensive documentation for the Baby Music AI project! This documentation is designed to provide a deep dive into the codebase, architecture, and features of the application.

## Table of Contents

- [Architecture Overview](./architecture.md)
- [Frontend Components](./frontend.md)
- [Backend Services](./backend.md)
- [API Integration](./api-integration.md)
- [State Management](./state-management.md)
- [Security](./security.md)
- [Deployment](./deployment.md)
- [Contributing Guidelines](./contributing.md)

Each section provides detailed explanations and code examples to help you understand and navigate the project effectively. Whether you're a new contributor or an experienced developer, this documentation will serve as your guide to the Baby Music AI codebase.

If you have any questions or suggestions for improving the documentation, please don't hesitate to open an issue or submit a pull request. Happy coding!
````

## File: docs/security.md
````markdown
# Security

Baby Music AI takes security seriously and implements various measures to protect user data and ensure a secure application environment.

## Authentication

The application uses Supabase's built-in authentication system, which supports email/password authentication out of the box. When a user registers or logs in, Supabase generates a JSON Web Token (JWT) that is used to authenticate subsequent requests to the backend API.

The frontend stores the JWT in local storage and includes it in the `Authorization` header of API requests. The backend API verifies the JWT before processing any authenticated requests.

## Authorization

Baby Music AI implements role-based access control (RBAC) to authorize user actions based on their assigned roles. The application defines the following roles:

- `user`: Regular users who can generate songs, view their own songs, and manage their profile.
- `admin`: Administrators who have access to additional features, such as managing users and viewing analytics.

The backend API endpoints check the user's role before allowing access to specific resources or actions. For example, only users with the `admin` role can access the user management endpoints.

## Data Protection

Baby Music AI takes several measures to protect user data:

### Encryption

Sensitive user data, such as passwords, are never stored in plain text. Passwords are hashed using a secure hashing algorithm (e.g., bcrypt) before being stored in the database.

### Secure Communication

All communication between the frontend and backend is done over HTTPS, ensuring that data is encrypted in transit. The application uses SSL/TLS certificates to establish secure connections.

### Input Validation and Sanitization

User input is always validated and sanitized before being processed by the backend API. This helps prevent common security vulnerabilities, such as SQL injection and cross-site scripting (XSS) attacks.

### Rate Limiting

The backend API implements rate limiting to prevent abuse and protect against denial-of-service (DoS) attacks. It limits the number of requests a user can make within a specific time window.

### Secure Cookies

When using cookies for authentication or session management, the application sets the `secure` and `httpOnly` flags to ensure that cookies are only sent over HTTPS and are not accessible via JavaScript.

## Third-Party Dependencies

Baby Music AI relies on several third-party libraries and services, such as Supabase, PIAPI.ai, and Anthropic Claude. The application carefully vets these dependencies and keeps them up to date to ensure they are secure and free from known vulnerabilities.

## Security Best Practices

In addition to the above measures, Baby Music AI follows general security best practices:

- Keeping all dependencies up to date with the latest security patches
- Using secure coding practices and following the OWASP Top 10 guidelines
- Conducting regular security audits and penetration testing
- Implementing a bug bounty program to encourage responsible disclosure of vulnerabilities
- Providing security training to developers and team members

By implementing these security measures and following best practices, Baby Music AI aims to provide a secure and trustworthy application for its users.
````

## File: docs/state-management.md
````markdown
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
````

## File: netlify/functions/waitlist.ts
````typescript
import { Handler } from '@netlify/functions';

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Safely parse JSON with error handling
    let email = '';
    try {
      const body = JSON.parse(event.body || '{}');
      email = body.email || '';
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Validate API key and publication ID
    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      console.error('Missing Beehiiv API key or publication ID');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Call Beehiiv API to add subscriber
    try {
      const apiUrl = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`;
      
      const requestBody = {
        email: email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'website_waitlist',
        utm_medium: 'organic',
        utm_campaign: 'waitlist_signup',
        referring_site: 'babymusic.ai'
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      let data;
      try {
        const responseText = await response.text();
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Error parsing response as JSON:', jsonError);
          data = { text: responseText };
        }
      } catch (textError) {
        console.error('Error getting response text:', textError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error processing response from email service' }),
        };
      }

      // Check for success (201 Created or 200 OK)
      if (response.status === 201 || response.status === 200) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            message: 'Successfully added to waitlist! Please check your email to confirm your subscription.'
          }),
        };
      }
      
      // Handle duplicate email more gracefully
      if (response.status === 409 || (data.error && data.error.includes('already exists'))) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            message: 'You\'re already on our waitlist!'
          }),
        };
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: data.message || data.error || 'Failed to subscribe' 
        }),
      };
    } catch (fetchError) {
      console.error('Fetch error calling Beehiiv API:', fetchError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Error connecting to email service' }),
      };
    }
  } catch (error) {
    console.error('Waitlist error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
````

## File: scripts/lint/.eslintrc.js
````javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
````

## File: scripts/lint/fix-imports.mjs
````
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const srcDir = path.join(process.cwd(), 'src');
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

console.log('🔍 Scanning files to optimize imports...');

// Helper function to get all files recursively
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Map of known React namespace usages to their import names
const reactNamespaceMap = {
  'React.FormEvent': 'FormEvent',
  'React.ChangeEvent': 'ChangeEvent',
  'React.MouseEvent': 'MouseEvent',
  'React.KeyboardEvent': 'KeyboardEvent',
  'React.ComponentType': 'ComponentType',
  'React.ReactNode': 'ReactNode',
  'React.useEffect': 'useEffect',
  'React.useState': 'useState',
  'React.useRef': 'useRef',
  'React.useMemo': 'useMemo',
  'React.useCallback': 'useCallback',
  'React.useContext': 'useContext',
  'React.FC': 'FC',
  'React.FunctionComponent': 'FunctionComponent',
  'React.ReactElement': 'ReactElement',
  'React.CSSProperties': 'CSSProperties',
  'React.Fragment': 'Fragment'
  // Add more as needed
};

// Process files
const files = findFiles(srcDir);
let modifiedCount = 0;
let scannedCount = 0;

console.log(`Found ${files.length} files to scan`);

// Process each file
files.forEach(filePath => {
  scannedCount++;
  const relativePath = path.relative(process.cwd(), filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Case 1: import React from 'react';
  const standaloneImportPattern = /import\s+React\s+from\s+['"]react['"];?/;
  const hasStandaloneImport = standaloneImportPattern.test(content);
  
  // Case 2: import React, { useState, useEffect } from 'react';
  const combinedImportPattern = /import\s+React,\s*{([^}]*)}\s+from\s+['"]react['"];?/;
  const combinedImportMatch = content.match(combinedImportPattern);
  
  // Case 3: import { ... } from 'react';
  const namedImportPattern = /import\s*{\s*([^}]*)\s*}\s+from\s+['"]react['"];?/;
  const namedImportMatch = content.match(namedImportPattern);
  
  // Check if React is used directly in the code
  const reactUsagesRegex = /React\.[a-zA-Z]+/g;
  const reactUsages = content.match(reactUsagesRegex);
  const hasReactNamespaceUsage = reactUsages && reactUsages.length > 0;
  
  // Track needed named imports
  let neededImports = new Set();
  
  // Handle React namespace usage conversion
  if (hasReactNamespaceUsage) {
    console.log(`Converting React namespace usage in: ${relativePath}`);
    console.log(`Namespace usages: ${reactUsages.join(', ')}`);
    
    // Collect needed imports
    reactUsages.forEach(usage => {
      if (reactNamespaceMap[usage]) {
        neededImports.add(reactNamespaceMap[usage]);
        
        // Replace React.X with X in content
        const replacement = reactNamespaceMap[usage];
        const usagePattern = new RegExp(usage.replace('.', '\\.'), 'g');
        content = content.replace(usagePattern, replacement);
        modified = true;
      }
    });
  }
  
  // Handle imports based on what we found
  if (neededImports.size > 0) {
    // Convert set to sorted array
    const importsList = Array.from(neededImports).sort();
    
    // Case 1: If we have standalone React import
    if (hasStandaloneImport) {
      // Replace standalone with named imports
      content = content.replace(
        standaloneImportPattern,
        `import { ${importsList.join(', ')} } from 'react';`
      );
      modified = true;
    }
    // Case 2: If we have combined import
    else if (combinedImportMatch) {
      const existingImports = combinedImportMatch[1]
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp.length > 0);
      
      // Merge existing and new imports, remove duplicates
      const allImports = Array.from(new Set([...existingImports, ...importsList])).sort();
      
      // Replace with updated combined imports
      content = content.replace(
        combinedImportPattern,
        `import { ${allImports.join(', ')} } from 'react';`
      );
      modified = true;
    }
    // Case 3: If we have named imports already
    else if (namedImportMatch) {
      const existingImports = namedImportMatch[1]
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp.length > 0);
      
      // Merge existing and new imports, remove duplicates
      const allImports = Array.from(new Set([...existingImports, ...importsList])).sort();
      
      // Replace with updated named imports
      content = content.replace(
        namedImportPattern,
        `import { ${allImports.join(', ')} } from 'react';`
      );
      modified = true;
    }
    // Case 4: No existing React import at all
    else {
      // Add a new import statement at the top of the file
      content = `import { ${importsList.join(', ')} } from 'react';\n${content}`;
      modified = true;
    }
  }
  // Handle unused React imports
  else if ((hasStandaloneImport || combinedImportMatch) && !hasReactNamespaceUsage) {
    // Case 1: Standalone React import with no namespace usage
    if (hasStandaloneImport) {
      console.log(`Found unused standalone React import in: ${relativePath}`);
      // Remove the React import
      content = content.replace(standaloneImportPattern, '');
      modified = true;
    }
    
    // Case 2: Combined import with no namespace usage
    if (combinedImportMatch) {
      console.log(`Found unused React in combined import in: ${relativePath}`);
      const namedImports = combinedImportMatch[1].trim();
      
      if (namedImports) {
        // Replace with just the named imports
        content = content.replace(
          combinedImportPattern, 
          `import { ${namedImports} } from 'react';`
        );
      } else {
        // No named imports either, remove the entire import
        content = content.replace(combinedImportPattern, '');
      }
      modified = true;
    }
  }
  
  // Cleanup empty lines to ensure file is tidy
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Write changes if modified
  if (modified) {
    fs.writeFileSync(filePath, content);
    modifiedCount++;
    console.log(`✅ Fixed: ${relativePath}`);
  }
  
  // Show progress every 10 files
  if (scannedCount % 20 === 0) {
    console.log(`Progress: Scanned ${scannedCount}/${files.length} files...`);
  }
});

console.log(`\n✨ Complete! Scanned ${scannedCount} files, modified ${modifiedCount} files.`);
console.log('Run your application to ensure everything works correctly.');
````

## File: scripts/lint/fix-unused-vars.mjs
````
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const srcDir = path.join(process.cwd(), 'src');
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

console.log('🔍 Scanning for unused variables and imports...');

// Find all TypeScript/JavaScript files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Run ESLint to find unused variables
function findUnusedVariables() {
  try {
    console.log('Running ESLint to detect unused variables...');
    const eslintOutput = execSync('npx eslint --no-eslintrc --config scripts/lint/.eslintrc.js --quiet --format json src', { encoding: 'utf8' });
    return JSON.parse(eslintOutput);
  } catch (error) {
    // ESLint will exit with error code if it finds issues
    if (error.stdout) {
      return JSON.parse(error.stdout);
    }
    console.error('Error running ESLint:', error.message);
    return [];
  }
}

// This function checks if a variable is defined but never used
function detectUnusedVars(filePath) {
  // Create a temporary ESLint config for unused vars detection
  const eslintConfig = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error']
    }
  };
  
  const configPath = path.join(__dirname, '.eslintrc.js');
  fs.writeFileSync(
    configPath,
    `module.exports = ${JSON.stringify(eslintConfig, null, 2)};`
  );
  
  try {
    // Run ESLint with specific config
    const cmd = `npx eslint --no-eslintrc --config ${configPath} --quiet --format json "${filePath}"`;
    const result = execSync(cmd, { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (error) {
    // ESLint will exit with error code if it finds issues
    if (error.stdout) {
      return JSON.parse(error.stdout);
    }
    return [];
  }
}

// Fix unused variables in a file
function fixUnusedVars(filePath) {
  console.log(`Checking ${filePath} for unused variables...`);
  const results = detectUnusedVars(filePath);
  
  if (!results.length || !results[0].messages.length) {
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const file of results) {
    for (const message of file.messages) {
      if (message.ruleId === '@typescript-eslint/no-unused-vars') {
        const variableName = message.message.match(/'([^']+)'/)?.[1];
        
        if (variableName) {
          console.log(`Found unused variable: ${variableName} at line ${message.line}`);
          
          // Different patterns to match variable declarations
          const patterns = [
            // const/let/var declarations
            new RegExp(`(const|let|var)\\s+${variableName}\\s*=`, 'g'),
            // Function parameters
            new RegExp(`function\\s+[\\w_]+\\s*\\([^)]*?\\b${variableName}\\b[^)]*\\)`, 'g'),
            // Arrow function parameters
            new RegExp(`\\([^)]*?\\b${variableName}\\b[^)]*\\)\\s*=>`, 'g'),
            // Destructuring patterns
            new RegExp(`\\{[^}]*?\\b${variableName}\\b[^}]*\\}\\s*=`, 'g'),
            new RegExp(`\\[[^\\]]*?\\b${variableName}\\b[^\\]]*\\]\\s*=`, 'g'),
            // Import statements
            new RegExp(`import\\s+\\{[^}]*?\\b${variableName}\\b[^}]*\\}\\s+from`, 'g')
          ];
          
          // Fix pattern: prefix with underscore
          for (const pattern of patterns) {
            if (pattern.test(content)) {
              content = content.replace(
                pattern, 
                (match) => match.replace(new RegExp(`\\b${variableName}\\b`), `_${variableName}`)
              );
              modified = true;
            }
          }
          
          // Special case for object destructuring with rename
          const destructuringRenamePattern = new RegExp(`{[^}]*?\\b\\w+:\\s*${variableName}\\b[^}]*}`, 'g');
          if (destructuringRenamePattern.test(content)) {
            content = content.replace(
              destructuringRenamePattern,
              (match) => match.replace(new RegExp(`(\\w+:\\s*)${variableName}\\b`), `$1_${variableName}`)
            );
            modified = true;
          }
          
          // Special case for import destructuring with rename
          const importRenamePattern = new RegExp(`import\\s+{[^}]*?\\b\\w+\\s+as\\s+${variableName}\\b[^}]*}\\s+from`, 'g');
          if (importRenamePattern.test(content)) {
            content = content.replace(
              importRenamePattern,
              (match) => match.replace(new RegExp(`(\\w+\\s+as\\s+)${variableName}\\b`), `$1_${variableName}`)
            );
            modified = true;
          }
          
          // Special case for imports we can simply remove
          const importPattern = new RegExp(`import\\s+\\{[^}]*?\\b${variableName}\\b[^}]*\\}\\s+from\\s+['"][^'"]+['"]\\s*;?`, 'g');
          if (importPattern.test(content)) {
            // If this is the only import, remove the whole line
            const singleImportPattern = new RegExp(`import\\s+\\{\\s*${variableName}\\s*\\}\\s+from\\s+['"][^'"]+['"]\\s*;?`, 'g');
            if (singleImportPattern.test(content)) {
              content = content.replace(singleImportPattern, '');
              modified = true;
            }
            // Otherwise remove just this import from the import list
            else {
              content = content.replace(
                new RegExp(`(import\\s+\\{[^}]*?)\\b${variableName}\\b,?\\s*([^}]*\\})`, 'g'),
                (match, before, after) => {
                  // If variableName is at the end with a comma before it, remove the comma too
                  before = before.replace(new RegExp(`,\\s*$`), '');
                  return `${before}${after}`;
                }
              );
              // Also try the case where variableName is in the middle or start
              content = content.replace(
                new RegExp(`(import\\s+\\{[^}]*?)\\b${variableName}\\b,\\s*([^}]*\\})`, 'g'),
                '$1$2'
              );
              modified = true;
            }
          }
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed unused variables in: ${filePath}`);
  }
  
  return modified;
}

// Process files
const files = findFiles(srcDir);
let modifiedCount = 0;

console.log(`Found ${files.length} files to scan`);

// Process each file
files.forEach(filePath => {
  const modified = fixUnusedVars(filePath);
  if (modified) {
    modifiedCount++;
  }
});

console.log(`\n✨ Complete! Fixed ${modifiedCount} files with unused variables.`);
console.log('Run ESLint again to verify all issues are resolved:');
console.log('npx eslint . --fix --ext .js,.jsx,.ts,.tsx');
````

## File: scripts/lint/README.md
````markdown
# Lint Scripts

This directory contains scripts for automatically fixing linting issues in the codebase.

## Available Scripts

### fix-imports.mjs

This script optimizes React imports throughout the codebase:

- Converts `React.X` references to named imports (e.g., `React.useState` → `useState`)
- Removes unused React imports
- Converts standalone React imports to named imports where appropriate

Usage:
```bash
node scripts/lint/fix-imports.mjs
```

### fix-unused-vars.mjs

This script fixes unused variables by:

- Adding an underscore prefix to unused variables (e.g., `variable` → `_variable`)
- Removing unused import statements
- Fixing destructuring patterns with unused variables

Usage:
```bash
node scripts/lint/fix-unused-vars.mjs
```

## Common Lint Issues

1. **Unused React Imports**: With React 17+, you no longer need to import React to use JSX. The script will remove these unnecessary imports.

2. **Unused Variables**: Variables that are declared but never used will be prefixed with an underscore to indicate they are intentionally unused.

3. **React Namespace Usage**: Using `React.X` is less efficient than importing the specific React API directly. The script converts these to named imports.

## Running ESLint

After running the fix scripts, you can validate your changes with:

```bash
npx eslint . --fix --ext .js,.jsx,.ts,.tsx
```
````

## File: scripts/check-for-secrets.ts
````typescript
import * as fs from 'fs';
import * as _path from 'path';
import * as glob from 'glob';

// Patterns that might indicate secrets
const secretPatterns = [
  /supabaseUrl\s*=\s*["'](?!process|import\.meta)/i,
  /supabaseKey\s*=\s*["'](?!process|import\.meta)/i,
  /apiKey\s*=\s*["'](?!process|import\.meta)/i,
  /SUPABASE_URL\s*=\s*["'](?!process|import\.meta|your_)/i,
  /SUPABASE_ANON_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /PIAPI_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /CLAUDE_API_KEY\s*=\s*["'](?!process|import\.meta|your_)/i,
  /WEBHOOK_SECRET\s*=\s*["'](?!process|import\.meta|your_)/i,
  /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/i, // JWT pattern
];

// Patterns to exclude (common false positives)
const excludePatterns = [
  /key={/i, // React key prop
  /key=\{/i, // React key prop with space
  /key\s*=\s*\{/i, // React key prop with more spaces
  /primaryKey=/i, // Database primary key
  /foreignKey=/i, // Database foreign key
  /keyframes/i, // CSS keyframes
  /keydown/i, // Keyboard event
  /keyup/i, // Keyboard event
  /keypress/i, // Keyboard event
  /keyboard/i, // Keyboard related
  /hotkey/i, // Hotkey related
  /publicKey/i, // Public key (not sensitive)
  /keyof/i, // TypeScript keyof operator
  /keyCode/i, // Key code in events
  /keyboardEvent/i, // Keyboard event
];

// Files and directories to exclude
const excludePaths = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'node_modules',
  'dist',
  'build',
  '.git',
  'scripts/check-for-secrets.ts', // Exclude this script itself
  'README.md', // Exclude README as it contains examples
];

// Function to check if a file might contain secrets
async function checkFileForSecrets(filePath: string): Promise<string[]> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    const findings: string[] = [];

    lines.forEach((line, index) => {
      // Skip lines that match exclude patterns
      if (excludePatterns.some(pattern => pattern.test(line))) {
        return;
      }

      // Check for secret patterns
      for (const pattern of secretPatterns) {
        if (pattern.test(line)) {
          findings.push(`Found potential secret pattern "${pattern.source.substring(0, 20)}..." in ${filePath} at line ${index + 1}`);
          break; // Only report once per line
        }
      }
    });

    return findings;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Function to scan directories
async function scanDirectories(): Promise<string[]> {
  const findings: string[] = [];
  
  // Get all files except excluded ones
  const files = glob.sync('**/*', {
    ignore: excludePaths,
    nodir: true,
    dot: true,
  });

  console.log(`Checking ${files.length} files for hardcoded secrets...`);
  
  // Check each file
  for (const file of files) {
    // Skip binary files and non-text files
    if (!/\.(js|jsx|ts|tsx|json|yml|yaml|xml|html|css|scss|md|txt|sh|env.*|config)$/.test(file) && 
        !file.includes('.env')) {
      continue;
    }
    
    const fileFindings = await checkFileForSecrets(file);
    findings.push(...fileFindings);
  }
  
  return findings;
}

// Main function
async function main() {
  console.log('Checking for hardcoded secrets in the codebase...');
  
  const findings = await scanDirectories();
  
  if (findings.length > 0) {
    console.log(`Found ${findings.length} potential hardcoded secrets:`);
    findings.forEach(finding => console.log(`- ${finding}`));
    console.log('\nPlease review these findings and move any secrets to .env.local');
  } else {
    console.log('No hardcoded secrets found. Good job!');
  }
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
````

## File: scripts/check-stuck-tasks.ts
````typescript
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config(); // Fallback to .env
  console.warn('Warning: .env.local file not found, using .env if available');
}

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStuckTasks() {
  console.log('Checking for songs that might be stuck in a generating state...');

  // Find songs that have task IDs but no audio URL and no error
  const { data: generatingSongs, error: generatingError } = await supabase
    .from('songs')
    .select('id, name, created_at, task_id')
    .is('audio_url', null)
    .is('error', null)
    .not('task_id', 'is', null);

  if (generatingError) {
    console.error('Error fetching generating songs:', generatingError);
    return;
  }

  console.log(`Found ${generatingSongs.length} songs that might be stuck in a generating state.`);

  // Sort by creation date (oldest first)
  generatingSongs.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Display information about each song
  for (const song of generatingSongs) {
    const createdAt = new Date(song.created_at);
    const now = new Date();
    const ageInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    
    console.log(`Song: ${song.name} (${song.id})`);
    console.log(`  Created: ${createdAt.toLocaleString()} (${ageInMinutes} minutes ago)`);
    console.log(`  Task ID: ${song.task_id}`);
    
    // Check if the song is older than 5 minutes (likely stuck)
    if (ageInMinutes > 5) {
      console.log(`  LIKELY STUCK (older than 5 minutes)`);
    }
    
    console.log('');
  }

  // Find songs that have audio URLs but still have task IDs
  const { data: incompleteWithAudio, error: incompleteError } = await supabase
    .from('songs')
    .select('id, name, audio_url, task_id')
    .not('audio_url', 'is', null)
    .not('task_id', 'is', null);

  if (incompleteError) {
    console.error('Error fetching incomplete songs with audio:', incompleteError);
    return;
  }

  console.log(`Found ${incompleteWithAudio.length} songs with audio URLs but still have task IDs.`);

  // Display information about each song
  for (const song of incompleteWithAudio) {
    console.log(`Song: ${song.name} (${song.id})`);
    console.log(`  Has audio URL: ${!!song.audio_url}`);
    console.log(`  Task ID: ${song.task_id || 'null'}`);
    console.log('');
  }

  console.log('Done!');
}

// Run the function
checkStuckTasks().catch(console.error);
````

## File: scripts/fix-stuck-tasks.ts
````typescript
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config(); // Fallback to .env
  console.warn('Warning: .env.local file not found, using .env if available');
}

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixStuckTasks() {
  console.log('Fixing songs that might be stuck in a generating state...');

  // Find songs that have task IDs but no audio URL and no error, and are older than 5 minutes
  const { data: stuckSongs, error: stuckError } = await supabase
    .from('songs')
    .select('id, name, created_at, task_id')
    .is('audio_url', null)
    .is('error', null)
    .not('task_id', 'is', null);

  if (stuckError) {
    console.error('Error fetching stuck songs:', stuckError);
    return;
  }

  // Filter songs that are older than 5 minutes
  const now = new Date();
  const oldStuckSongs = stuckSongs.filter(song => {
    const createdAt = new Date(song.created_at);
    const ageInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    return ageInMinutes > 5;
  });

  console.log(`Found ${oldStuckSongs.length} songs that are stuck in a generating state for more than 5 minutes.`);

  // Update each stuck song
  for (const song of oldStuckSongs) {
    console.log(`Fixing stuck song: ${song.name} (${song.id})`);
    
    // Update the song to mark it as failed and clear the task ID
    const { error: updateError } = await supabase
      .from('songs')
      .update({
        task_id: null,
        error: 'Generation timed out after 5 minutes',
        retryable: true
      })
      .eq('id', song.id);
    
    if (updateError) {
      console.error(`Error updating song ${song.id}:`, updateError);
    } else {
      console.log(`Successfully updated song ${song.id}`);
    }
  }

  // Find songs that have audio URLs but still have task IDs
  const { data: incompleteWithAudio, error: incompleteError } = await supabase
    .from('songs')
    .select('id, name, audio_url, task_id')
    .not('audio_url', 'is', null)
    .not('task_id', 'is', null);

  if (incompleteError) {
    console.error('Error fetching incomplete songs with audio:', incompleteError);
    return;
  }

  console.log(`Found ${incompleteWithAudio.length} songs with audio URLs but still have task IDs.`);

  // Update each song with audio but still has task ID
  for (const song of incompleteWithAudio) {
    console.log(`Fixing song with audio: ${song.name} (${song.id})`);
    
    // Update the song to clear the task ID since it already has audio
    const { error: updateError } = await supabase
      .from('songs')
      .update({
        task_id: null
      })
      .eq('id', song.id);
    
    if (updateError) {
      console.error(`Error updating song ${song.id}:`, updateError);
    } else {
      console.log(`Successfully updated song ${song.id}`);
    }
  }

  console.log('Done!');
}

// Run the function
fixStuckTasks().catch(console.error);
````

## File: scripts/fix-task-ids.ts
````typescript
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config(); // Fallback to .env
  console.warn('Warning: .env.local file not found, using .env if available');
}

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTaskIds() {
  console.log('Checking for songs with task ID issues...');

  // 1. Find songs with audio URLs but still have task IDs
  // These should have their task IDs cleared since they're completed
  const { data: completedWithTaskIds, error: completedError } = await supabase
    .from('songs')
    .select('id, name, audio_url, task_id')
    .not('audio_url', 'is', null)
    .not('task_id', 'is', null);

  if (completedError) {
    console.error('Error fetching completed songs with task IDs:', completedError);
    return;
  }

  console.log(`Found ${completedWithTaskIds.length} completed songs that still have task IDs.`);

  // Update each song to clear the task ID
  for (const song of completedWithTaskIds) {
    console.log(`Updating completed song: ${song.name} (${song.id})`);
    console.log(`  Has audio URL: ${!!song.audio_url}`);
    console.log(`  Task ID: ${song.task_id}`);

    const { error: updateError } = await supabase
      .from('songs')
      .update({ task_id: null })
      .eq('id', song.id);

    if (updateError) {
      console.error(`Error updating song ${song.id}:`, updateError);
    } else {
      console.log(`  Cleared task ID`);
    }
  }

  // 2. Find songs with errors but still have task IDs
  // These should have their task IDs cleared since they're failed
  const { data: failedWithTaskIds, error: failedError } = await supabase
    .from('songs')
    .select('id, name, error, task_id')
    .not('error', 'is', null)
    .not('task_id', 'is', null);

  if (failedError) {
    console.error('Error fetching failed songs with task IDs:', failedError);
    return;
  }

  console.log(`Found ${failedWithTaskIds.length} failed songs that still have task IDs.`);

  // Update each song to clear the task ID
  for (const song of failedWithTaskIds) {
    console.log(`Updating failed song: ${song.name} (${song.id})`);
    console.log(`  Has error: ${!!song.error}`);
    console.log(`  Task ID: ${song.task_id}`);

    const { error: updateError } = await supabase
      .from('songs')
      .update({ task_id: null })
      .eq('id', song.id);

    if (updateError) {
      console.error(`Error updating song ${song.id}:`, updateError);
    } else {
      console.log(`  Cleared task ID`);
    }
  }

  // 3. Find songs with old task IDs (older than 5 minutes) that are still in generating state
  const { data: generatingSongs, error: generatingError } = await supabase
    .from('songs')
    .select('id, name, created_at, task_id')
    .is('audio_url', null)
    .is('error', null)
    .not('task_id', 'is', null);

  if (generatingError) {
    console.error('Error fetching generating songs:', generatingError);
    return;
  }

  // Filter for songs older than 5 minutes
  const now = new Date();
  const stuckSongs = generatingSongs.filter(song => {
    const createdAt = new Date(song.created_at);
    const ageInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    return ageInMinutes > 5;
  });

  console.log(`Found ${stuckSongs.length} songs with old task IDs (older than 5 minutes).`);

  // Update each stuck song to set an error and make it retryable
  for (const song of stuckSongs) {
    console.log(`Updating stuck song: ${song.name} (${song.id})`);
    console.log(`  Task ID: ${song.task_id}`);
    
    const { error: updateError } = await supabase
      .from('songs')
      .update({ 
        error: 'Song generation timed out. Please try again.',
        retryable: true,
        task_id: null
      })
      .eq('id', song.id);

    if (updateError) {
      console.error(`Error updating song ${song.id}:`, updateError);
    } else {
      console.log(`  Updated song to failed state and cleared task ID`);
    }
  }

  console.log('Done!');
}

// Run the function
fixTaskIds().catch(console.error);
````

## File: scripts/list-songs.ts
````typescript
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config(); // Fallback to .env
  console.warn('Warning: .env.local file not found, using .env if available');
}

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function listSongs() {
  console.log('Listing songs in the database...');

  // Fetch all songs
  const { data: songs, error } = await supabase
    .from('songs')
    .select('id, name, audio_url, task_id, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching songs:', error);
    return;
  }

  if (!songs || songs.length === 0) {
    console.log('No songs found in the database.');
    return;
  }

  console.log(`Found ${songs.length} songs:`);
  console.log('----------------------------');

  // Display information about each song
  for (const song of songs) {
    console.log(`Song: ${song.name}`);
    console.log(`  ID: ${song.id}`);
    console.log(`  Created: ${new Date(song.created_at).toLocaleString()}`);
    console.log(`  Has audio URL: ${!!song.audio_url}`);
    if (song.audio_url) {
      console.log(`  Audio URL: ${song.audio_url}`);
    }
    console.log(`  Task ID: ${song.task_id || 'null'}`);
    console.log('----------------------------');
  }

  console.log('Done!');
}

// Run the function
listSongs().catch(console.error);
````

## File: scripts/README.md
````markdown
# Utility Scripts

This directory contains utility scripts to help manage the BabyMusic-AI application. These scripts assist with environment setup, database management, and security checks.

## Environment Setup

### setup-env.ts

An interactive script to help set up your environment variables:

```bash
npx tsx scripts/setup-env.ts
```

This script will:
- Guide you through setting up all required environment variables
- Create a `.env.local` file with your provided values
- Check if an existing `.env.local` file exists and ask before overwriting

## Database Management Scripts

### fix-task-ids.ts

Checks for and fixes issues with task IDs in the database:

```bash
npx tsx scripts/fix-task-ids.ts
```

This script performs the following checks:
- Finds songs with audio URLs that still have task IDs and clears those task IDs
- Identifies songs with a failed status that still have task IDs and clears them
- Checks for songs that have been generating for more than 5 minutes and updates their status to 'failed'

### check-stuck-tasks.ts

Identifies songs that may be stuck in the generating state:

```bash
npx tsx scripts/check-stuck-tasks.ts
```

This script:
- Finds songs with task IDs that have been generating for more than 5 minutes
- Identifies songs with audio URLs that still have task IDs
- Reports these issues without making any changes to the database

### fix-stuck-tasks.ts

Resets songs that are stuck in the generating state:

```bash
npx tsx scripts/fix-stuck-tasks.ts
```

This script:
- Finds songs with task IDs that have been generating for more than 5 minutes
- Updates these songs to have a 'failed' status and clears their task IDs
- Marks them as retryable so they can be generated again

### update-song-audio.ts

Updates a song's audio URL:

```bash
npx tsx scripts/update-song-audio.ts <song_id> <audio_url>
```

Parameters:
- `song_id`: The UUID of the song to update
- `audio_url`: The new audio URL to set for the song

### list-songs.ts

Lists all songs in the database:

```bash
npx tsx scripts/list-songs.ts
```

This script displays:
- Song ID
- Song name
- Creation date
- Audio URL (if available)
- Task ID (if present)
- Error message (if any)

## Security Scripts

### check-for-secrets.ts

Scans the codebase for potentially hardcoded secrets:

```bash
npx tsx scripts/check-for-secrets.ts
```

This script:
- Searches for patterns that might indicate hardcoded secrets (API keys, tokens, etc.)
- Excludes common false positives like React key props
- Ignores files that typically contain environment variables (like .env files)
- Reports any findings so they can be moved to environment variables

## Environment Variables

All scripts use environment variables from `.env.local` for configuration. The required variables are:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

The scripts will automatically:
1. Look for a `.env.local` file in the project root
2. Fall back to `.env` if `.env.local` is not found
3. Display an error if the required environment variables are missing

## Best Practices

- Run `check-for-secrets.ts` regularly to ensure no secrets are hardcoded in the codebase
- Use `check-stuck-tasks.ts` to identify potential issues before using `fix-stuck-tasks.ts`
- Always back up your database before running scripts that modify data
- Keep your `.env.local` file secure and never commit it to version control
````

## File: scripts/setup-env.ts
````typescript
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Required environment variables
const requiredEnvVars = [
  {
    name: 'VITE_SUPABASE_URL',
    description: 'Your Supabase URL (e.g., https://your-project.supabase.co)'
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    description: 'Your Supabase anonymous key'
  },
  {
    name: 'VITE_PIAPI_KEY',
    description: 'Your PIAPI.ai API key'
  },
  {
    name: 'VITE_CLAUDE_API_KEY',
    description: 'Your Anthropic Claude API key'
  },
  {
    name: 'VITE_WEBHOOK_SECRET',
    description: 'Your webhook secret key (can be any random string)'
  }
];

// Function to prompt for environment variables
async function promptForEnvVars(): Promise<Record<string, string>> {
  const envVars: Record<string, string> = {};

  for (const envVar of requiredEnvVars) {
    const value = await new Promise<string>(resolve => {
      rl.question(`Enter ${envVar.name} (${envVar.description}): `, answer => {
        resolve(answer.trim());
      });
    });

    envVars[envVar.name] = value;
  }

  return envVars;
}

// Function to create .env.local file
function createEnvFile(envVars: Record<string, string>): void {
  const envFilePath = path.resolve(process.cwd(), '.env.local');
  
  let envFileContent = '';
  for (const [key, value] of Object.entries(envVars)) {
    envFileContent += `${key}=${value}\n`;
  }

  fs.writeFileSync(envFilePath, envFileContent);
  console.log(`Created .env.local file at ${envFilePath}`);
}

// Main function
async function main() {
  console.log('Welcome to the BabyMusic-AI environment setup!');
  console.log('This script will help you set up your .env.local file with the required environment variables.');
  console.log('');

  // Check if .env.local already exists
  const envFilePath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envFilePath)) {
    const answer = await new Promise<string>(resolve => {
      rl.question('.env.local file already exists. Do you want to overwrite it? (y/n): ', answer => {
        resolve(answer.trim().toLowerCase());
      });
    });

    if (answer !== 'y') {
      console.log('Setup cancelled. Your existing .env.local file was not modified.');
      rl.close();
      return;
    }
  }

  // Prompt for environment variables
  const envVars = await promptForEnvVars();

  // Create .env.local file
  createEnvFile(envVars);

  console.log('');
  console.log('Setup complete! Your .env.local file has been created with the provided environment variables.');
  console.log('You can now run the application with:');
  console.log('  npm run dev');

  rl.close();
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
````

## File: scripts/update-song-audio.ts
````typescript
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config(); // Fallback to .env
  console.warn('Warning: .env.local file not found, using .env if available');
}

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Song ID to update
const songId = '005d66f1-d43d-4550-8e20-1a17a65c2548';

// Audio URL to set
const audioUrl = 'https://example.com/audio.mp3';

async function updateSongAudio() {
  console.log(`Updating song ${songId} with audio URL: ${audioUrl}`);

  // First, fetch the song to make sure it exists
  const { data: song, error: fetchError } = await supabase
    .from('songs')
    .select('*')
    .eq('id', songId)
    .single();

  if (fetchError) {
    console.error('Error fetching song:', fetchError);
    return;
  }

  if (!song) {
    console.error(`Song with ID ${songId} not found`);
    return;
  }

  console.log('Found song:', song.name);

  // Update the song with the audio URL
  const { error: updateError } = await supabase
    .from('songs')
    .update({
      audio_url: audioUrl,
      task_id: null // Clear the task ID since we're manually setting the audio URL
    })
    .eq('id', songId);

  if (updateError) {
    console.error('Error updating song:', updateError);
    return;
  }

  console.log(`Successfully updated song ${songId} with audio URL`);
}

// Run the function
updateSongAudio().catch(console.error);
````

## File: src/components/auth/AuthModal.tsx
````typescript
import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { X } from 'lucide-react';
import OnboardingModal from './OnboardingModal';
import type { BabyProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(defaultMode === 'signin');
  const [email, setEmail] = useState('');
  const [babyName, setBabyName] = useState('');
  const [babyNameError, setBabyNameError] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState<'credentials' | 'babyNameFirst' | 'babyName'>(
    isSignIn ? 'credentials' : 'babyNameFirst'
  );
  const { signIn, signUp } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setIsSignIn(defaultMode === 'signin');
      setStep(defaultMode === 'signin' ? 'credentials' : 'babyNameFirst');
      setEmail('');
      setPassword('');
      setBabyName('');
      setError('');
      setBabyNameError('');
      setShowOnboarding(false);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleBabyNameFirstSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedBabyName = babyName.trim();
    
    if (!trimmedBabyName) {
      setBabyNameError('Please enter your baby\'s name');
      return;
    }
    
    setBabyNameError('');
    setStep('credentials');
  };

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      setError('');
      try {
        await signIn(email, password);
        onClose();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        if (message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(message);
        }
      }
    } else {
      setError('');
      setIsLoading(true);
      setBabyNameError('');
      
      const trimmedBabyName = babyName.trim();
      const trimmedEmail = email.trim();
      
      if (!trimmedEmail) {
        setError('Please enter your email');
        setIsLoading(false);
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Starting signup process...');
        await signUp(trimmedEmail, password, trimmedBabyName);
        console.log('Signup successful, showing onboarding modal...');
        setShowOnboarding(true);
      } catch (err) {
        console.error('Signup error:', err);
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(
          message.includes('already registered') 
            ? 'This email is already registered. Please sign in instead.'
            : message
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOnboardingComplete = (_babyProfile: BabyProfile) => {
    console.log('Onboarding complete, closing modals...');
    setShowOnboarding(false);
    onClose();
  };

  const handleBack = () => {
    if (step === 'credentials' && !isSignIn) {
      setStep('babyNameFirst');
    } else if (step === 'babyName') {
      setStep('credentials');
    }
    setError('');
  };

  if (showOnboarding) {
    console.log('Rendering OnboardingModal with babyName:', babyName.trim());
    return (
      <OnboardingModal
        isOpen={true}
        onComplete={handleOnboardingComplete}
        initialBabyName={babyName.trim()}
      />
    );
  }

  const renderStep = () => {
    switch (step) {
      case 'babyNameFirst':
        return (
          <form onSubmit={handleBabyNameFirstSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                What's your baby's name?
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                className={`input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors
                         ${babyNameError ? 'border-red-400 focus:border-red-400' : ''}`}
                required
                placeholder="Enter your baby's name"
                autoFocus
              />
              {babyNameError && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {babyNameError}
                </p>
              )}
              <p className="text-xs text-white/40 mt-2">
                We'll use this to personalize songs for your little one
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                       py-3 rounded-xl hover:opacity-90 transition-all duration-300
                       shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                       hover:scale-[1.02] active:scale-[0.98]"
            >
              Next
            </button>
          </form>
        );

      case 'credentials':
        return (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors"
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors"
                required
                placeholder={isSignIn ? "Enter your password" : "Create a password"}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              {!isSignIn && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-white/5 text-white py-3 rounded-xl border border-white/10
                           hover:bg-white/10 transition-all duration-300 hover:border-white/20"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100 disabled:hover:shadow-none`}
              >
                {isSignIn ? (
                  isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : 'Sign In'
                ) : (
                  isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : 'Sign Up'
                )}
              </button>
            </div>
          </form>
        );
        
      case 'babyName':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                What's your baby's name?
                <span className="text-primary ml-1">*</span>
              </label>
              <input
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                className={`input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors
                         ${babyNameError ? 'border-red-400 focus:border-red-400' : ''}`}
                required
                placeholder="Enter your baby's name"
              />
              {babyNameError && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {babyNameError}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-white/5 text-white py-3 rounded-xl border border-white/10
                         hover:bg-white/10 transition-all duration-300 hover:border-white/20"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98]"
              >
                Next
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md relative border-white/[0.05] fade-in overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-secondary/20 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-12 left-12 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-12 right-12 w-20 h-20 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white bg-white/5 rounded-full p-2
                   transition-all duration-300 hover:rotate-90 hover:bg-white/10 hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-white to-secondary 
                     bg-clip-text text-transparent mb-2">
          {isSignIn 
            ? 'Welcome Back' 
            : step === 'babyNameFirst' 
              ? 'Tell Us About Your Baby' 
              : 'Create Account'}
        </h2>
        <p className="text-white/60 text-sm mb-8">
          {isSignIn 
            ? "Sign in to continue your musical journey" 
            : step === 'babyNameFirst'
              ? "Let's start by getting your baby's name"
              : "Set up your account to start your baby's musical adventure"}
        </p>
        
        {renderStep()}
        
        <div className="mt-8 text-center relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative">
            <span className="px-4 text-sm bg-[#2A2D3E] text-white/40">or</span>
          </div>
        </div>
        
        <p className="mt-6 text-center text-white/60 text-sm">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setStep(isSignIn ? 'babyNameFirst' : 'credentials');
              setError('');
            }}
            className="text-primary hover:text-secondary transition-colors font-medium"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/auth/OnboardingModal.tsx
````typescript
import { useState, useEffect } from 'react';
import { Baby, Music2, Brain, ArrowRight, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { AgeGroup, BabyProfile } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (babyProfile: BabyProfile) => void;
  initialBabyName: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

// Calculate years for dropdown (current year down to 5 years ago)
const YEARS = Array.from(
  { length: 6 },
  (_, i) => CURRENT_YEAR - i
);

// Add "Older" option for future expansion
const AGE_OPTIONS = [
  ...YEARS.map(year => ({ value: year, label: year.toString() })),
  { value: CURRENT_YEAR - 6, label: 'Older' }
];

const getAgeGroup = (month: number, year: number): AgeGroup => {
  const ageInMonths = ((CURRENT_YEAR - year) * 12) + (CURRENT_MONTH - month);
  if (ageInMonths <= 6) return '0-6';
  if (ageInMonths <= 12) return '7-12';
  return '13-24';
};

export default function OnboardingModal({ isOpen, onComplete, initialBabyName }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [babyName, setBabyName] = useState(initialBabyName);
  const [birthMonth, setBirthMonth] = useState<number>(CURRENT_MONTH);
  const [birthYear, setBirthYear] = useState<number>(CURRENT_YEAR);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('0-6');
  const [gender, setGender] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const { updateProfile } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      console.log('OnboardingModal opened with initialBabyName:', initialBabyName);
      setStep(1);
      setIsUpdating(false);
      setBabyName(initialBabyName);
      setGender('');
      setError(null);
    }
  }, [isOpen, initialBabyName]);

  useEffect(() => {
    setAgeGroup(getAgeGroup(birthMonth, birthYear));
  }, [birthMonth, birthYear]);

  if (!isOpen) return null;

  const handleNext = () => {
    // Reset errors
    setError(null);
    setBirthDateError(null);
    
    // Validate birth date (UI only)
    const currentDate = new Date();
    const selectedDate = new Date(birthYear, birthMonth - 1);
    
    if (selectedDate > currentDate) {
      setBirthDateError("Birth date cannot be in the future");
      return;
    }
    
    // Validate gender
    if (!gender) {
      setError("Please select your baby's gender");
      return;
    }
    
    console.log('Moving to step 2 with gender:', gender);
    setStep(2);
  };

  const handleComplete = async () => {
    // Reset errors
    setError(null);
    setBirthDateError(null);
    
    // Validate birth date (UI only)
    const currentDate = new Date();
    const selectedDate = new Date(birthYear, birthMonth - 1);
    
    if (selectedDate > currentDate) {
      setBirthDateError("Birth date cannot be in the future");
      return;
    }
    
    // Validate gender
    if (!gender) {
      setError("Please select your baby's gender");
      return;
    }
    
    try {
      console.log('Completing onboarding with data:', {
        babyName,
        birthMonth,
        birthYear,
        ageGroup: getAgeGroup(birthMonth, birthYear),
        gender
      });
      setIsUpdating(true);
      
      // Update profile with birth data
      const updatedProfile = await updateProfile({
        babyName,
        birthMonth,
        birthYear,
        ageGroup: getAgeGroup(birthMonth, birthYear),
        gender
      });
      
      console.log('Profile updated successfully:', updatedProfile);
      
      // Call onComplete with profile data
      onComplete({
        babyName,
        birthMonth,
        birthYear,
        ageGroup: getAgeGroup(birthMonth, birthYear),
        gender
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg relative border-white/[0.05] fade-in overflow-hidden">
        {/* Add loading state for profile update */}
        {isUpdating && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        <div className="relative p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome!</h2>
                  <p className="text-white/60">Let's personalize the experience</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  When was {babyName} born?
                  <span className="text-primary ml-1" title="Required">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(parseInt(e.target.value))}
                      className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${birthDateError ? 'border-red-400' : ''}`}
                      required
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="relative">
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(parseInt(e.target.value))}
                      className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${birthDateError ? 'border-red-400' : ''}`}
                      required
                    >
                      {AGE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  We use age to customize songs for your child's developmental stage
                </p>
                {birthDateError && <p className="text-red-400 text-sm mt-1">{birthDateError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  What is {babyName}'s gender?
                  <span className="text-primary ml-1" title="Required">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`input w-full bg-white/[0.07] hover:bg-white/[0.09] transition-colors ${error ? 'border-red-400' : ''}`}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                  <option value="other">Other</option>
                </select>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-2">
                  <Baby className="w-3 h-3" />
                  We use this to personalize songs with gender-appropriate lyrics
                </p>
                {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Creating Your Songs</h2>
                  <p className="text-white/60">Customized for {babyName}'s development</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Music2 className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-white/80">Your account is ready!</p>
                      <p className="text-sm text-white/60 mt-1">Explore preset songs in your dashboard.</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-white/80 leading-relaxed">
                  We've prepared special songs tailored to {babyName}'s age group ({ageGroup}).
                  These melodies are scientifically designed to support cognitive development and emotional well-being.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Continue to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/common/SongGenerationTimer.tsx
````typescript
import { Clock } from 'lucide-react';
import { useSongGenerationTimer } from '../../hooks/useSongGenerationTimer';

interface SongGenerationTimerProps {
  isGenerating: boolean;
  showProgress?: boolean;
  className?: string;
  compact?: boolean;
  onTimeout?: () => void;
}

/**
 * A reusable timer component for song generation
 * Uses the same timeout duration as the server-side timeout
 */
export default function SongGenerationTimer({
  isGenerating,
  showProgress = true,
  className = '',
  compact = false,
  onTimeout
}: SongGenerationTimerProps) {
  const { timeLeft, formattedTime, progress, totalTime: _totalTime } = useSongGenerationTimer(isGenerating);
  
  // Call onTimeout when timer reaches 0
  if (timeLeft === 0 && onTimeout) {
    onTimeout();
  }
  
  if (!isGenerating) {
    return null;
  }
  
  // Compact mode just shows the time
  if (compact) {
    return (
      <span className={`text-white/80 ${className}`}>
        <Clock className="inline-block w-3 h-3 mr-1 animate-pulse" />
        {formattedTime}
      </span>
    );
  }
  
  return (
    <div className={`space-y-3 fade-in ${className}`}>
      <div className="flex items-center justify-center gap-3 bg-primary/10 py-2 px-4 rounded-xl
                    backdrop-blur-sm border border-primary/20 animate-pulse">
        <Clock className="inline-block w-4 h-4 animate-pulse" />
        <p className="text-white/90 text-sm font-medium">
          <span className="text-white/80">{formattedTime}</span> remaining
        </p>
      </div>
      
      {showProgress && (
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
````

## File: src/components/dashboard/DetailedStreak.tsx
````typescript
import { Flame, Star, Music2, Sparkles, Heart, Zap } from 'lucide-react';

interface DetailedStreakProps {
  streakDays: number;
  dailyGoal: number;
  songsToday: number;
}

export default function DetailedStreak({ streakDays, dailyGoal, songsToday }: DetailedStreakProps) {
  return (
    <div className="relative overflow-hidden group rounded-3xl bg-gradient-to-br from-[#34D399] via-[#F59E0B] to-[#EC4899]
                   p-[2px] hover:p-[3px] transition-all duration-300">
      <div className="bg-black/90 rounded-[22px] p-4 sm:p-6 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#34D399]/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#F59E0B]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#EC4899]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Stats Content */}
        <div className="w-full">
          {/* Streak Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-centers gap-4 sm:gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B] to-[#EC4899] blur-lg opacity-50"></div>
                    <div className="relative p-2 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10">
                      <Flame className="w-6 h-6 text-[#F59E0B] animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      {streakDays} Day Streak
                      <Sparkles className="w-5 h-5 text-[#F59E0B] animate-sparkle" />
                    </h3>
                    <p className="text-white/60 text-sm">Play songs daily to keep your streak</p>
                  </div>
                </div>
              </div>
            
              {/* Daily Goal Progress */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-white/60 text-sm">Daily Song Goal</p>
                <p className="text-white/80 text-sm font-medium ml-4">{songsToday}/{dailyGoal} songs</p>
              </div>
              <div className="h-3 bg-black/50 backdrop-blur-xl rounded-full overflow-hidden border border-white/10 relative">
                <div 
                  className="h-full bg-gradient-to-r from-[#34D399] via-[#F59E0B] to-[#EC4899]
                           transition-all duration-500 animate-pulse"
                  style={{ width: `${(songsToday / dailyGoal) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-between gap-4">
            <div className="hidden sm:flex flex-1 items-center gap-4 p-4 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10
                         hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#34D399]/10 via-transparent to-transparent opacity-0 
                           group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-12 h-12 rounded-full bg-[#34D399]/20 flex items-center justify-center
                           group-hover:scale-110 transition-transform duration-500">
                <Music2 className="w-6 h-6 text-[#34D399]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">145</h4>
                <p className="text-xs text-white/60">Minutes Played</p>
              </div>
            </div>
            <div className="hidden sm:flex flex-1 items-center gap-4 p-4 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10
                         hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/10 via-transparent to-transparent opacity-0 
                           group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-12 h-12 rounded-full bg-[#EC4899]/20 flex items-center justify-center
                           group-hover:scale-110 transition-transform duration-500">
                <Star className="w-6 h-6 text-[#EC4899]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">12</h4>
                <p className="text-xs text-white/60">Songs Created</p>
              </div>
            </div>
            {/* Mobile Stats */}
            <div className="flex sm:hidden items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10">
              <Music2 className="w-5 h-5 text-[#34D399]" />
              <div>
                <h4 className="text-lg font-bold text-white">145</h4>
                <p className="text-xs text-white/60">Minutes Played</p>
              </div>
            </div>
            <div className="flex sm:hidden items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10">
              <Star className="w-5 h-5 text-[#EC4899]" />
              <div>
                <h4 className="text-lg font-bold text-white">12</h4>
                <p className="text-xs text-white/60">Songs Created</p>
              </div>
            </div>
          </div>
          
          {/* Badges */}
          <div className="mt-8 flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {[
              {
                icon: Star,
                label: 'First Song',
                color: '#FFC107',
                borderColor: '#FFB300',
                earned: true
              },
              { 
                icon: Flame, 
                label: '3 Days',
                color: '#FF5722',
                borderColor: '#F4511E',
                earned: true 
              },
              { 
                icon: Music2, 
                label: '10 Songs',
                color: '#4CAF50',
                borderColor: '#43A047',
                earned: true 
              },
              { 
                icon: Zap, 
                label: '7 Days',
                color: '#9C27B0',
                borderColor: '#8E24AA',
                earned: false 
              },
              {
                icon: Heart,
                label: '20 Songs',
                color: '#E91E63',
                borderColor: '#D81B60',
                earned: false
              }
            ].map(({ icon: Icon, label, color, borderColor, earned }) => (
              <div 
                key={label}
                className={`flex-none group relative ${earned ? '' : 'opacity-40 grayscale'}`}
                title={label}
              >
                <div className="relative w-10 h-10">
                  <div 
                    className="w-full h-full relative"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      background: earned 
                        ? `linear-gradient(135deg, ${color}, ${borderColor})`
                        : 'linear-gradient(135deg, #4A5568, #2D3748)',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${earned ? 'text-white' : 'text-white/40'} 
                                    group-hover:scale-110 transition-transform duration-500`} />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-white/80 text-center mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/dashboard/MiniStreak.tsx
````typescript
import { Flame } from 'lucide-react';

interface MiniStreakProps {
  streakDays: number;
}

export default function MiniStreak({ streakDays }: MiniStreakProps) {
  return (
    <div className="w-full bg-white/[0.03] backdrop-blur-sm border-t border-b border-white/5 py-2">
      <div className="max-w-md mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#F59E0B]" />
          <div className="relative">
            <span className="text-xl font-bold bg-gradient-to-r from-[#F59E0B] to-[#EC4899] 
                          bg-clip-text text-transparent">
              {streakDays}
            </span>
            <span className="ml-1.5 text-white/80">day streak</span>
          </div>
        </div>
        <div className="w-px h-4 bg-white/10"></div>
        <div className="text-white/50 text-sm">
          Play 2+ mins to maintain
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/landing/Benefits.tsx
````typescript
export default function Benefits() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-background-dark to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
          Proven Impact
          <span className="block text-sm sm:text-base font-normal text-white/60 mt-1">
            Research-backed results
          </span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          {[
            {
              title: 'Sleep Quality',
              stat: '35%',
              description: 'Faster sleep onset',
              research: 'Study published in Pediatrics (2023) shows that appropriate musical stimulation reduces sleep onset time by up to 35% in infants aged 0-24 months.'
            },
            {
              title: 'Cognition',
              stat: '27%',
              description: 'Better neural processing',
              research: 'Research from Harvard Medical School demonstrates 27% improvement in neural processing speed when infants are exposed to structured musical patterns.'
            }
          ].map(({ title, stat, description, research }) => (
            <div 
              key={title}
              className="relative group/card w-[240px]"
            >
              <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 
                           transition-all duration-500 cursor-help">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary 
                              bg-clip-text text-transparent group-hover/card:scale-110 
                              transition-transform duration-500 w-20 text-center">{stat}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="text-white/70 text-sm">{description}</p>
                </div>
              </div>
              {/* Desktop tooltip */}
              <div className="hidden sm:block">
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 
                             bg-white/10 backdrop-blur-md rounded-lg p-3 invisible opacity-0 
                             group-hover/card:visible group-hover/card:opacity-100 
                             transition-all duration-300 text-sm text-white/90 
                             border border-white/10 shadow-xl z-10">
                  {research}
                  <div className="absolute left-1/2 -bottom-1 w-2 h-2 -translate-x-1/2 rotate-45 
                               bg-white/10 border-r border-b border-white/10"></div>
                </div>
              </div>
              {/* Mobile info button */}
              <button
                onClick={() => window.alert(research)}
                className="sm:hidden absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full
                         flex items-center justify-center text-primary text-xs border border-primary/30"
              >
                i
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
````

## File: src/components/landing/CTASection.tsx
````typescript
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onOpenAuth: () => void;
}

export default function CTASection({ onOpenAuth }: CTASectionProps) {
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
  
  // Handle methodology navigation to ensure scroll to top
  const handleMethodologyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState({}, '', '/methodology');
    window.scrollTo(0, 0);
    
    // Dispatch a custom event so any components listening for route changes can update
    const navigationEvent = new CustomEvent('navigation', { detail: '/methodology' });
    window.dispatchEvent(navigationEvent);
  };
  
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-20 w-64 h-64 bg-primary/10 rounded-full filter blur-[80px]"></div>
        <div className="absolute -bottom-40 right-20 w-64 h-64 bg-secondary/10 rounded-full filter blur-[80px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-white/[0.03] border border-white/[0.05] rounded-2xl p-8 sm:p-12 group
                      hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-secondary/10 via-transparent to-transparent"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Start Your Musical Journey Today
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto group-hover:text-white/80 transition-colors duration-500">
              Create magical moments with your little one through the power of AI-crafted melodies. Your peaceful parenting journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onOpenAuth}
                className="relative inline-flex items-center btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 
                          hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
              >
                {isSignupDisabled ? 'Join the Waitlist' : 'Create Your First Song'}
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </button>
              
              <a 
                href="/methodology" 
                onClick={handleMethodologyClick}
                className="relative inline-flex items-center justify-center text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3
                          border border-white/20 rounded-md text-white/80 hover:text-white hover:border-white/30
                          transition-all duration-300 w-full sm:w-auto"
              >
                View Our Methodology
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
````

## File: src/components/landing/Features.tsx
````typescript
import { Heart, Music2, Star } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[100px] animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Your Partner in Peaceful Parenting
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed px-2">
            What your baby hears shapes their brain. Replace overstimulation with high-quality melodies designed for learning and calm
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              icon: Heart,
              title: 'Peace of Mind',
              description: 'Finally, screen-free entertainment you can trust, giving you guilt-free moments to yourself',
              gradient: 'from-rose-300/20 via-rose-300/10 to-transparent',
              iconColor: 'text-rose-300/80',
              delay: '0s'
            },
            {
              icon: Music2,
              title: 'Daily Routines Made Easy',
              description: 'Transform challenging moments into joyful experiences with music designed for every situation',
              gradient: 'from-sky-300/20 via-sky-300/10 to-transparent',
              iconColor: 'text-sky-300/80',
              delay: '0.1s'
            },
            {
              icon: Star,
              title: 'Smart Development',
              description: 'While you relax, your baby naturally develops musical intelligence and emotional awareness',
              gradient: 'from-amber-300/20 via-amber-300/10 to-transparent',
              iconColor: 'text-amber-300/80',
              delay: '0.2s'
            }
          ].map(({ icon: Icon, title, description, gradient, iconColor, delay }) => (
            <div 
              key={title}
              className="relative group"
              style={{ transitionDelay: delay }}
            >
              <div className="relative h-full p-6 sm:p-8 rounded-3xl backdrop-blur-sm
                           bg-white/[0.02] border border-white/5
                           transition-all duration-500 overflow-hidden
                           sm:hover:bg-white/[0.05] sm:group-hover:scale-[1.02]
                           sm:group-hover:border-white/10">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0
                              sm:group-hover:opacity-100 transition-all duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 relative">
                    <div className="absolute inset-0 bg-white/5 rounded-2xl transform rotate-45
                                sm:group-hover:scale-110 transition-all duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${iconColor} transform sm:group-hover:scale-110 transition-all duration-500`} />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 sm:group-hover:text-primary
                              transition-colors duration-300">{title}</h3>
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed sm:group-hover:text-white/80
                              transition-colors duration-300">
                    {title === 'Peace of Mind' ? (
                      <>
                        Finally, screen-free entertainment you can trust, giving you{' '}
                        <span className="text-primary/90 font-medium">guilt-free</span>{' '}
                        moments to yourself
                      </>
                    ) : (
                      description
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
````

## File: src/components/landing/Hero.tsx
````typescript
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { isValidEmail } from '../../utils/validation';

interface HeroProps {
  onOpenAuth: () => void;
}

export default function Hero({ onOpenAuth }: HeroProps) {
  
  // State for the inline email form
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
  
  // Handle direct submission of email form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In development mode, log the email for tracking
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`Waitlist signup email: ${email.trim()}`);
      }
      
      let apiSuccess = false;
      let responseData = null;
      
      try {
        console.log('Attempting to call Netlify function at /.netlify/functions/waitlist');
        const response = await fetch('/.netlify/functions/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() })
        });
        
        const responseText = await response.text();
        
        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
            console.log('Netlify function response:', responseData);
          } catch {
            console.warn('Non-JSON response received:', responseText.slice(0, 100));
          }
        }
        
        if (response.ok) {
          apiSuccess = true;
          setSuccess(true);
        } else if (responseData?.error) {
          throw new Error(responseData.error);
        }
      } catch (apiError) {
        console.warn('API request failed:', apiError);
        
        // In development mode, show success even if API fails
        if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !apiSuccess) {
          console.log('🚨 Development mode - Using mock Beehiiv integration as fallback');
          console.log('📨 Would have sent email to Beehiiv:', email.trim());
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setSuccess(true);
        } else {
          throw apiError;
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            Musical Adventures for Your
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Little One
            </span>
          </h1>
          <p className="text-base sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Create personalized melodies that inspire learning, creativity, and development
            through the magic of AI-powered music.
          </p>
          
          {isSignupDisabled ? (
            success ? (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto mb-6">
                <p className="text-primary font-medium">Thank you for joining our waitlist!</p>
                <p className="text-white/70 text-sm mt-1">We'll notify you when we launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <div className="relative flex-1 max-w-md mx-auto sm:mx-0">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 sm:py-2.5 rounded-md bg-white/25 border border-white/40 text-white
                               focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                               placeholder-white/70"
                      disabled={isSubmitting}
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-xs text-red-400">{error}</p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 
                            hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap
                            flex items-center justify-center gap-2 max-w-xs mx-auto sm:mx-0"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        Join the Waitlist
                        <ArrowRight className="w-5 h-5 inline-block" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="flex justify-center">
              <button 
                onClick={onOpenAuth}
                className="btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
````

## File: src/components/landing/ProblemSolution.tsx
````typescript
export default function ProblemSolution() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-background-dark/50 to-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 sm:mb-8">
          Is Your Baby's Music Helping or Harming?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto">
          {/* Problem Side */}
          <div className="card p-6 sm:p-8 bg-red-500/5 border-red-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
            <div className="w-24 sm:w-32 h-24 sm:h-32 mx-auto mb-6 sm:mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-red-500/10 rounded-lg transform rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
                <div className="w-24 h-24 bg-red-500/10 rounded-lg transform -rotate-45 group-hover:-rotate-90 transition-transform duration-700"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                <div className="w-20 h-20 bg-red-500/20 rounded-lg transform rotate-[30deg]"></div>
                <div className="w-20 h-20 bg-red-500/20 rounded-lg transform -rotate-[30deg]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-500/30 rounded-lg animate-pulse">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-red-500/40"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">Traditional Content</h3>
            <p className="text-white text-center mb-6">Overstimulating, fast-paced, bright visuals</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-red-400">
                <span className="text-lg">❌</span>
                <span>Fast-paced cuts hijack attention spans</span>
              </li>
              <li className="flex items-start gap-3 text-red-400">
                <span className="text-lg">❌</span>
                <span>Overstimulation linked to speech delays</span>
              </li>
              <li className="flex items-start gap-3 text-red-400">
                <span className="text-lg">❌</span>
                <span>Passive consumption hurts emotional development</span>
              </li>
            </ul>
          </div>

          {/* Solution Side */}
          <div className="card p-6 sm:p-8 bg-green-500/5 border-green-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 bg-green-500/10 rounded-full transform group-hover:scale-110 transition-transform duration-700"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-green-500/15 rounded-full transform group-hover:scale-110 transition-transform duration-500 delay-75"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full transform group-hover:scale-110 transition-transform duration-500 delay-100">
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="absolute w-3 h-8 bg-green-500/40 rounded-full transform -rotate-45 -translate-x-4"></div>
                    <div className="absolute w-3 h-6 bg-green-500/40 rounded-full"></div>
                    <div className="absolute w-3 h-8 bg-green-500/40 rounded-full transform rotate-45 translate-x-4"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">BabyMusic AI Solution</h3>
            <p className="text-white text-center mb-6">Designed for cognitive and emotional well-being</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-green-400">
                <span className="text-lg">✓</span>
                <span>Scientifically crafted melodies</span>
              </li>
              <li className="flex items-start gap-3 text-green-400">
                <span className="text-lg">✓</span>
                <span>Boosts cognition and emotional well-being</span>
              </li>
              <li className="flex items-start gap-3 text-green-400">
                <span className="text-lg">✓</span>
                <span>Supports deep sleep and relaxation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
````

## File: src/components/landing/ResearchInstitutions.tsx
````typescript
import { ArrowRight, Star, Brain, Heart } from 'lucide-react';

const INSTITUTIONS = [
  { name: 'H', text: 'HARVARD RESEARCH', url: 'https://www.gse.harvard.edu/ideas/usable-knowledge/23/03/does-nature-or-nurture-determine-musical-ability', isSerif: true },
  { name: 'UW', text: 'WASHINGTON STUDY', url: 'https://www.washington.edu/news/2016/04/25/music-improves-baby-brain-responses-to-music-and-speech' },
  { name: 'NCBI', text: 'NIH PAPER', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4951961' },
  { name: 'F', text: 'FRONTIERS RESEARCH', url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.00297' },
  { name: 'AMTA', text: 'STUDY', url: 'https://www.musictherapy.org/assets/1/7/MT_Young_Children_2006.pdf' }
];

export default function ResearchInstitutions() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-[#FFD700]/[0.08] to-background-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFD700]/[0.03] via-transparent to-transparent opacity-30"></div>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-4xl font-bold text-white text-center mb-4 sm:mb-6">
          Research is Clear: Music Shapes Your Baby's Mind
          <span className="block text-base sm:text-xl font-normal text-white/60 mt-2">
            Leading institutions confirm the profound impact of early musical exposure
          </span>
        </h2>
        
        {/* Mobile layout */}
        <div className="sm:hidden max-w-3xl mx-auto mb-8">
          <div className="flex justify-center gap-4 mb-4">
            {INSTITUTIONS.slice(0, 2).map((institution) => (
              <InstitutionCard key={institution.name} {...institution} className="w-[5.5rem]" />
            ))}
          </div>
          <div className="flex justify-center gap-4">
            {INSTITUTIONS.slice(2).map((institution) => (
              <InstitutionCard key={institution.name} {...institution} className="w-[5.5rem]" />
            ))}
          </div>
        </div>
        
        {/* Desktop layout */}
        <div className="hidden sm:grid sm:grid-cols-5 gap-4 max-w-3xl mx-auto mb-12">
          {INSTITUTIONS.map(institution => (
            <InstitutionCard key={institution.name} {...institution} />
          ))}
        </div>
        
        <ResearchSummary />
      </div>
    </section>
  );
}

function InstitutionCard({ name, text, url, isSerif, className }: {
  name: string;
  text: string;
  url: string;
  isSerif?: boolean;
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`aspect-square card bg-[#FFD700]/[0.02] hover:bg-[#FFD700]/[0.05] p-3 group
                transition-all duration-500 hover:scale-105 relative overflow-hidden
                ${className || ''}`}
      style={{ minHeight: '5.5rem' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-white/70 group-hover:text-white transition-all duration-300 text-center">
          <div className={`text-lg sm:text-xl mb-1 ${isSerif ? 'font-serif' : 'font-bold'}`}>{name}</div>
          <div className="text-[0.65rem] sm:text-xs font-medium mb-1">{text}</div>
          <ArrowRight className="w-3 h-3 mx-auto mt-2 text-primary/70 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </a>
  );
}

function ResearchSummary() {
  return (
    <div className="max-w-3xl mx-auto text-center relative">
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-[#FFD700]/80">
          <Star className="w-5 h-5" fill="currentColor" />
          <span className="text-xs sm:text-sm font-medium">Research</span>
        </div>
        <div className="w-px h-4 bg-[#FFD700]/20"></div>
        <div className="flex items-center gap-2 text-[#FFD700]/80">
          <Brain className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-medium">Science</span>
        </div>
        <div className="w-px h-4 bg-[#FFD700]/20"></div>
        <div className="flex items-center gap-2 text-[#FFD700]/80">
          <Heart className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-medium">Certified</span>
        </div>
      </div>
      <p className="text-base sm:text-lg text-white/80 leading-relaxed">
        Studies show that exposure to complex music before the age of 5 can significantly improve a child's pitch perception. 
        In some cases, it even leads to perfect pitch, a rare auditory skill linked to stronger memory and language abilities.
      </p>
    </div>
  );
}
````

## File: src/components/landing/VideoEvidence.tsx
````typescript
export default function VideoEvidence() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-16 relative z-10">
      <div className="card p-3 sm:p-4 bg-red-500/5 border-red-500/10 max-w-lg mx-auto">
        <h3 className="text-base font-medium text-white mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-75"></span>
          Research: Impact on Development
        </h3>
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/50 mb-2" style={{ maxHeight: '160px' }}>
          <iframe
            src="https://www.youtube.com/embed/YEFptHp0AmM?rel=0&modestbranding=1&showinfo=0&controls=1&fs=0&playsinline=1"
            title="The Impact of Overstimulating Content on Child Development"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            loading="lazy"
          ></iframe>
        </div>
        <p className="text-white/60 text-xs italic">
          Research shows that fast-paced, overstimulating content can negatively impact attention spans
          and cognitive development in young children.
        </p>
      </div>
    </div>
  );
}
````

## File: src/components/music-generator/CustomOptions.tsx
````typescript
import type { MusicMood, Tempo } from '../../types';

const TEMPO_OPTIONS: { type: Tempo; label: string }[] = [
  { type: 'slow', label: 'Slow' },
  { type: 'medium', label: 'Medium' },
  { type: 'fast', label: 'Fast' }
];

const MOOD_OPTIONS: { type: MusicMood; label: string }[] = [
  { type: 'calm', label: 'Calm' },
  { type: 'playful', label: 'Playful' },
  { type: 'learning', label: 'Learning' },
  { type: 'energetic', label: 'Energetic' }
];

interface CustomOptionsProps {
  mood?: MusicMood;
  tempo?: Tempo;
  onMoodSelect: (mood: MusicMood) => void;
  onTempoSelect: (tempo: Tempo) => void;
}

export default function CustomOptions({ 
  mood, 
  tempo, 
  onMoodSelect, 
  onTempoSelect 
}: CustomOptionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium text-white/90 mb-4">
          Tempo
        </label>
        <div className="flex gap-3">
          {TEMPO_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onTempoSelect(type)}
              className={`flex-1 px-4 py-3 rounded-xl text-center transition-all duration-300
                       ${tempo === type
                         ? 'bg-gradient-to-r from-primary to-accent text-black'
                         : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium text-white/90 mb-4">
          Mood
        </label>
        <div className="grid grid-cols-2 gap-3">
          {MOOD_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onMoodSelect(type)}
              className={`px-4 py-3 rounded-xl text-center transition-all duration-300
                       ${mood === type
                         ? 'bg-gradient-to-r from-secondary to-accent text-black'
                         : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/music-generator/GenerationProgress.tsx
````typescript
import { Clock } from 'lucide-react';

interface GenerationProgressProps {
  timeLeft: number;
  totalTime: number;
  formattedTime?: string;
  progress?: number;
}

export default function GenerationProgress({ 
  timeLeft, 
  totalTime,
  formattedTime,
  progress
}: GenerationProgressProps) {
  // If formattedTime is not provided, calculate it
  const displayTime = formattedTime || (() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  })();

  // If progress is not provided, calculate it
  const progressPercent = progress !== undefined 
    ? progress 
    : ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="mt-8 space-y-6 fade-in">
      <div className="flex items-center justify-center gap-3 bg-primary/10 py-3 px-6 rounded-xl
                    backdrop-blur-sm border border-primary/20 animate-pulse">
        <Clock className="inline-block w-4 h-4 mr-2 animate-pulse" />
        <p className="text-white/90 text-sm font-medium flex items-center gap-2">
          Creating your <span className="text-primary">masterpiece</span>... ✨ 
          <span className="text-white/80">
            {displayTime}
          </span>
        </p>
      </div>
      
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}
````

## File: src/components/music-generator/LyricsInput.tsx
````typescript
import { ChangeEvent, useState } from 'react';


interface LyricsInputProps {
  value: string;
  onChange: (value: string) => void;
  isFromScratch?: boolean;
  onSongTypeChange: (songType: 'theme' | 'theme-with-input' | 'from-scratch') => void;
}

const MAX_INPUT_LENGTH = 180;

export default function LyricsInput({ value, onChange, isFromScratch = false, onSongTypeChange }: LyricsInputProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isOverLimit, setIsOverLimit] = useState(false);

  const handleCustomInputChange = (wantsCustomInput: boolean) => {
    setShowCustomInput(wantsCustomInput);
    onSongTypeChange(wantsCustomInput ? 'theme-with-input' : 'theme');
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setIsOverLimit(newValue.length > MAX_INPUT_LENGTH);
    onChange(newValue.slice(0, MAX_INPUT_LENGTH));
  };

  return (
    <div>
      <label className="block text-lg font-medium text-white/90 mb-2">
        {isFromScratch ? 'Your Song Ideas' : 'Customize Your Song'}
        <span className="text-white/60 text-sm ml-2">
          {(isFromScratch || showCustomInput) && `(${MAX_INPUT_LENGTH} characters max)`}
        </span>
      </label>
      <div className="space-y-3">
        {!isFromScratch && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleCustomInputChange(false);
                onChange('');
              }}
              className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${!showCustomInput
                         ? 'bg-gradient-to-r from-primary to-secondary text-black'
                         : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            >
              Build for me
            </button>
            <button
              onClick={() => handleCustomInputChange(true)}
              className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                       ${showCustomInput
                         ? 'bg-gradient-to-r from-primary to-secondary text-black'
                         : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            >
              I have ideas
            </button>
          </div>
        )}
        {(showCustomInput || isFromScratch) && (
          <div className="space-y-2">
            <textarea
              value={value}
              onChange={handleInputChange}
              placeholder={`Examples:
${isFromScratch ?
`• Create a song about exploring colors and shapes in nature
• Make a melody about a magical garden adventure
• Tell a story about making new friends at the park
• Include themes of curiosity and discovery` :
`• Include favorite animals or activities
• Add specific places or objects
• Mention special family moments
• Include daily routines or rituals`}`}
              className="w-full h-40 bg-[#2A2D3E] border border-white/10 rounded-xl px-6 py-4
                     text-white placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:ring-2
                     focus:ring-primary/50 transition-all duration-300 resize-none
                     ${isOverLimit ? 'border-red-400 focus:ring-red-400/50' : ''}"
            />
            <div className="flex justify-between text-sm">
              <span className={`${isOverLimit ? 'text-red-400' : 'text-white/60'}`}>
                {value.length}/{MAX_INPUT_LENGTH} characters
              </span>
              {isOverLimit && (
                <span className="text-red-400">
                  Character limit exceeded
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
````

## File: src/components/music-generator/themeData.ts
````typescript
import type { ThemeType } from '../../types';
import { Music2, Brain, Heart, Star } from 'lucide-react';

export const THEMES: { type: ThemeType; title: string; description: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  {
    type: 'pitchDevelopment',
    title: 'Musical Intelligence',
    description: 'Develop pitch recognition and musical memory',
    icon: Music2
  },
  {
    type: 'cognitiveSpeech',
    title: 'Language & Learning',
    description: 'Enhance speech development and cognitive skills',
    icon: Brain
  },
  {
    type: 'sleepRegulation',
    title: 'Sleep & Relaxation',
    description: 'Calming melodies for peaceful sleep',
    icon: Heart
  },
  {
    type: 'socialEngagement',
    title: 'Social & Emotional',
    description: 'Foster emotional intelligence and social bonds',
    icon: Star
  },
  {
    type: 'indianClassical',
    title: 'Indian Ragas',
    description: 'Traditional melodies for holistic development',
    icon: Music2
  },
  {
    type: 'westernClassical',
    title: 'Western Classical',
    description: 'Structured compositions for focus and calm',
    icon: Heart
  }
];
````

## File: src/components/music-generator/ThemeSelector.tsx
````typescript
import type { ThemeType } from '../../types';
import { THEMES } from './themeData';

interface ThemeSelectorProps {
  selectedTheme?: ThemeType;
  onThemeSelect: (theme: ThemeType) => void;
}

export default function ThemeSelector({ selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {THEMES.map(({ type, title, description, icon: Icon }) => (
        <button
          key={type}
          onClick={() => onThemeSelect(type)}
          className={`p-6 rounded-2xl text-left transition-all duration-500 flex items-start gap-4 relative overflow-hidden
                    group hover:scale-[1.02] backdrop-blur-sm
                   ${selectedTheme === type
                     ? 'bg-black/60 text-white shadow-xl shadow-primary/10'
                     : 'bg-black/40 text-white/90 hover:bg-black/50'}`}
        >
          {/* Dynamic background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 
                       group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-secondary/10 via-transparent to-transparent opacity-0 
                       group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '150ms' }}></div>
          
          {/* Selected state overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500
                        ${selectedTheme === type 
                          ? 'from-primary/20 via-secondary/10 to-transparent opacity-100'
                          : 'opacity-0'}`} />
          
          {/* Icon container */}
          <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center
                        transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg]
                        ${selectedTheme === type 
                          ? 'bg-primary/20' 
                          : 'bg-white/[0.05] group-hover:bg-white/[0.08]'}`}>
            <Icon className={`w-6 h-6 transition-colors duration-300
                          ${selectedTheme === type 
                            ? 'text-primary' 
                            : 'text-white/70 group-hover:text-white'}`} />
          </div>
          
          <div className="relative z-10">
            <div className="font-medium text-lg mb-1 group-hover:text-white transition-colors">{title}</div>
            <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{description}</div>
          </div>
          
          {/* Decorative corner gradient */}
          <div className="absolute bottom-0 right-0 w-24 h-24 
                       bg-gradient-radial from-white/5 to-transparent 
                       rounded-full -mr-12 -mb-12 
                       group-hover:scale-150 transition-transform duration-700"></div>
        </button>
      ))}
    </div>
  );
}
````

## File: src/components/music-generator/VoiceSelector.tsx
````typescript
import type { VoiceType } from '../../types';
import { Mic, Music as MusicOff, Volume2 } from 'lucide-react';

const VOICE_OPTIONS: { 
  type: VoiceType; 
  label: string;
  description: string;
  icon: typeof Volume2;
}[] = [
  { 
    type: 'softFemale', 
    label: 'Soft Female Voice',
    description: 'Gentle, nurturing voice perfect for lullabies and calm songs',
    icon: Volume2
  },
  { 
    type: 'calmMale', 
    label: 'Calm Male Voice',
    description: 'Warm, soothing voice ideal for storytelling and learning songs',
    icon: Volume2
  }
];

interface VoiceSelectorProps {
  isInstrumental: boolean;
  selectedVoice: VoiceType;
  onVoiceSelect: (voice: VoiceType) => void;
  onInstrumentalToggle: (instrumental: boolean) => void;
}

export default function VoiceSelector({ 
  isInstrumental, 
  selectedVoice, 
  onVoiceSelect,
  onInstrumentalToggle 
}: VoiceSelectorProps) {
  return (
    <div className="space-y-8 sm:space-y-6 rounded-xl bg-white/[0.03] p-4 sm:p-6">
      <div>
        <label className="block text-xl sm:text-lg font-medium text-white/90 mb-2">
          Music Type
        </label>
        <p className="text-sm text-white/60 mb-6 sm:mb-4">
          Choose between instrumental music or songs with vocals
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
          <button
            onClick={() => onInstrumentalToggle(false)}
            className={`min-h-[5rem] sm:min-h-0 px-4 py-5 sm:py-4 rounded-xl text-center transition-all duration-300
                     flex flex-col items-center justify-center gap-4 sm:gap-3 group flex-1
                     active:scale-[0.98] touch-manipulation
                     ${!isInstrumental
                       ? 'bg-gradient-to-r from-accent to-secondary text-black shadow-lg shadow-accent/25'
                       : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            aria-pressed={!isInstrumental}
          >
            <div className={`p-4 sm:p-3 rounded-full transition-all duration-300
                         ${!isInstrumental 
                           ? 'bg-black/10' 
                           : 'bg-white/5 group-hover:bg-white/10'}`}>
              <Mic className="w-7 h-7 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-medium text-lg sm:text-base">With Voice</div>
              <div className="text-sm sm:text-xs opacity-80 mt-1">
                Songs with lyrics and vocals
              </div>
            </div>
          </button>
          <button
            onClick={() => onInstrumentalToggle(true)}
            className={`min-h-[5rem] sm:min-h-0 px-4 py-5 sm:py-4 rounded-xl text-center transition-all duration-300
                     flex flex-col items-center justify-center gap-4 sm:gap-3 group flex-1
                     active:scale-[0.98] touch-manipulation
                     ${isInstrumental
                       ? 'bg-gradient-to-r from-accent to-secondary text-black shadow-lg shadow-accent/25'
                       : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
            aria-pressed={isInstrumental}
          >
            <div className={`p-4 sm:p-3 rounded-full transition-all duration-300
                         ${isInstrumental 
                           ? 'bg-black/10' 
                           : 'bg-white/5 group-hover:bg-white/10'}`}>
              <MusicOff className="w-7 h-7 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-medium text-lg sm:text-base">Instrumental</div>
              <div className="text-sm sm:text-xs opacity-80 mt-1">
                Music without vocals
              </div>
            </div>
          </button>
        </div>
      </div>

      {!isInstrumental && (
        <div className="animate-fadeIn">
          <label className="block text-xl sm:text-lg font-medium text-white/90 mb-2">
            Voice Type
          </label>
          <p className="text-sm text-white/60 mb-6 sm:mb-4">
            Select the voice that best suits your song
          </p>
          <div className="grid grid-cols-1 gap-4 sm:gap-3 sm:grid-cols-2">
            {VOICE_OPTIONS.map(({ type, label, description, icon: Icon }) => (
              <button
                key={type}
                onClick={() => onVoiceSelect(type)}
                className={`min-h-[4.5rem] p-5 sm:p-4 rounded-xl text-left transition-all duration-300 group
                         active:scale-[0.98] touch-manipulation
                         ${selectedVoice === type
                           ? 'bg-gradient-to-r from-accent to-secondary text-black shadow-lg shadow-accent/25'
                           : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
                aria-pressed={selectedVoice === type}
              >
                <div className="flex items-start gap-4 sm:gap-3">
                  <div className={`p-3 sm:p-2 rounded-full transition-all duration-300 flex-shrink-0
                               ${selectedVoice === type 
                                 ? 'bg-black/10' 
                                 : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <Icon className="w-6 h-6 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-lg sm:text-base">{label}</div>
                    <div className="text-sm sm:text-xs mt-1.5 sm:mt-1 opacity-80 line-clamp-2">
                      {description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
````

## File: src/components/preset/PresetSongCard.tsx
````typescript
import { ComponentType, KeyboardEvent, MouseEvent, useCallback, useEffect } from 'react';
import { Play, Pause, RefreshCw, Wand2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PresetType, Song } from '../../types';
import { SongStateService, SongState } from '../../services/songStateService';
import SongGenerationTimer from '../common/SongGenerationTimer';

interface PresetCardProps {
  type: PresetType;
  title: string;
  description: string;
  iconComponent: ComponentType<React.SVGProps<SVGSVGElement>>;
  songs: Song[];
  isPlaying: boolean;
  onPlayClick: (audioUrl: string, type: PresetType) => void;
  onGenerateClick: (type: PresetType) => void;
  onVariationChange: (e: MouseEvent<HTMLDivElement>, type: PresetType, direction: 'next' | 'prev') => void;
  currentVariationIndex: number;
  isPresetTypeGenerating: (type: PresetType) => boolean;
}

export default function PresetSongCard({
  type,
  title,
  description,
  iconComponent: Icon,
  songs,
  isPlaying,
  onPlayClick,
  onGenerateClick,
  onVariationChange,
  currentVariationIndex,
  isPresetTypeGenerating
}: PresetCardProps) {
  // Get song state metadata using the helper method for preset types
  const {
    isGenerating: serviceIsGenerating,
    hasFailed,
    canRetry,
    isReady,
    hasVariations,
    variationCount,
    statusLabel,
    song: currentSong,
    state: songState
  } = SongStateService.getPresetTypeStateMetadata(
    songs,
    type
  );
  
  // Debugging for song state changes
  useEffect(() => {
    if (currentSong?.audio_url && isReady) {
      console.log(`PresetSongCard: Song ready with audio URL for type ${type}`, {
        songId: currentSong.id,
        audioUrl: currentSong.audio_url,
        state: songState
      });
    }
  }, [currentSong?.audio_url, isReady, songState, type]);
  
  // Combine generating states - check both the service and the store state
  const isGenerating = serviceIsGenerating || isPresetTypeGenerating(type);
  
  // Get the audio URL
  const audioUrl = currentSong ? currentSong.audio_url : undefined;

  // Handle card click
  const handleCardClick = useCallback(() => {
    // If already generating, do nothing
    if (isGenerating) {
      console.log(`Card click ignored: ${type} preset is already generating`);
      return;
    }
    
    // Log the current state for debugging
    console.log(`Card click for ${type} preset:`, {
      songState,
      isReady,
      audioUrl: audioUrl || 'none',
      songId: currentSong?.id || 'none'
    });
    
    switch (songState) {
      case SongState.READY:
        // Play the song if it's ready and has an audio URL
        if (audioUrl) {
          onPlayClick(audioUrl, type);
        }
        break;
        
      case SongState.FAILED:
        // Handle retry if the song has failed and can be retried
        if (canRetry) {
          onGenerateClick(type);
        }
        break;
        
      default:
        // For initial state or any other state, generate a new song
        onGenerateClick(type);
        break;
    }
  }, [songState, isGenerating, audioUrl, type, onPlayClick, onGenerateClick, canRetry, isReady, currentSong?.id]);

  // Get color scheme based on preset type
  const getColorScheme = () => {
    switch (type) {
      case 'playing':
        return {
          gradientFrom: 'from-[#FF5252]/20',
          gradientTo: 'to-[#FF8080]/5',
          hoverFrom: 'hover:from-[#FF3333]/40',
          hoverTo: 'hover:to-[#FF6666]/30',
          shadowColor: 'shadow-[#FF5252]/20',
          bgColor: 'bg-[#FF5252]',
          textColor: 'text-[#FF5252]',
          hoverTextColor: 'group-hover:text-[#FF3333]',
          emoji: '🎈'
        };
      case 'eating':
        return {
          gradientFrom: 'from-[#00E676]/20',
          gradientTo: 'to-[#69F0AE]/5',
          hoverFrom: 'hover:from-[#00C853]/40',
          hoverTo: 'hover:to-[#00E676]/30',
          shadowColor: 'shadow-[#00E676]/20',
          bgColor: 'bg-[#00E676]',
          textColor: 'text-[#00E676]',
          hoverTextColor: 'group-hover:text-[#00C853]',
          emoji: '🍼'
        };
      case 'sleeping':
        return {
          gradientFrom: 'from-[#40C4FF]/20',
          gradientTo: 'to-[#80D8FF]/5',
          hoverFrom: 'hover:from-[#00B0FF]/40',
          hoverTo: 'hover:to-[#40C4FF]/30',
          shadowColor: 'shadow-[#40C4FF]/20',
          bgColor: 'bg-[#40C4FF]',
          textColor: 'text-[#40C4FF]',
          hoverTextColor: 'group-hover:text-[#00B0FF]',
          emoji: '🌙'
        };
      default: // pooping
        return {
          gradientFrom: 'from-[#E040FB]/20',
          gradientTo: 'to-[#EA80FC]/5',
          hoverFrom: 'hover:from-[#D500F9]/40',
          hoverTo: 'hover:to-[#E040FB]/30',
          shadowColor: 'shadow-[#E040FB]/20',
          bgColor: 'bg-[#E040FB]',
          textColor: 'text-[#E040FB]',
          hoverTextColor: 'group-hover:text-[#D500F9]',
          emoji: '🚽'
        };
    }
  };

  const colors = getColorScheme();

  // Add a pulsing animation to the card when generating
  const loadingAnimation = isGenerating ? 'animate-pulse' : '';

  // Render the status indicator based on song state
  const renderStatusIndicator = () => {
    if (isGenerating) {
      return (
        <span className="inline-flex items-center text-xs bg-primary/20 text-white
                       px-3 py-1.5 rounded-full ml-2 border border-primary/20
                       shadow-lg z-10 whitespace-nowrap">
          <SongGenerationTimer 
            isGenerating={isGenerating}
            showProgress={false}
            compact={true}
            className="!m-0 !p-0"
          />
        </span>
      );
    }
    
    if (hasFailed) {
      return (
        <span className="inline-flex items-center text-xs bg-red-500/20 text-white
                       px-3 py-1.5 rounded-full ml-2 border border-red-500/20
                       shadow-lg z-10 whitespace-nowrap">
          <RefreshCw className="w-3 h-3 mr-1" />
          {statusLabel}
        </span>
      );
    }
    
    if (isReady) {
      return (
        <span className="inline-flex items-center text-xs bg-gradient-to-br from-black/80 to-black/90 text-green-400
                       px-3 py-1.5 rounded-full ml-2 border border-green-500/30
                       shadow-lg z-10 whitespace-nowrap">
          {isPlaying ? (
            <Pause className="w-3 h-3 mr-1" />
          ) : (
            <Play className="w-3 h-3 mr-1" />
          )}
          {isPlaying ? "Pause" : statusLabel}
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center text-xs bg-white/20 text-white
                     px-3 py-1.5 rounded-full ml-2 border border-white/20
                     shadow-lg z-10 whitespace-nowrap">
        <Wand2 className="w-3 h-3 mr-1" />
        {statusLabel}
      </span>
    );
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      aria-disabled={isGenerating}
      className={`relative overflow-hidden rounded-2xl p-5 sm:p-7 text-left min-h-[100px] cursor-pointer
                 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed
                 aria-disabled:hover:scale-100 aria-disabled:hover:shadow-none
                 aria-disabled:hover:from-current aria-disabled:hover:to-current
                 aria-disabled:hover:hover:bg-white/5
                 transition-all duration-500 group flex items-start gap-4 backdrop-blur-sm bg-black/60
                 bg-gradient-to-br hover:scale-[1.02] ${loadingAnimation}
                 ${colors.gradientFrom} ${colors.gradientTo} ${colors.hoverFrom} ${colors.hoverTo}
                 hover:shadow-xl ${colors.shadowColor}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0
                    group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className={`w-14 h-14 rounded-xl ${colors.bgColor}/10 flex items-center justify-center
                    group-hover:scale-110 group-hover:rotate-[360deg] 
                    transition-all duration-700 ease-in-out group-hover:bg-opacity-20`}
      >
        <Icon className={`w-6 h-6 ${colors.textColor} ${colors.hoverTextColor}`} />
      </div>
      <div className="relative">
        <h3 className="text-base font-medium text-white mb-1 flex items-center gap-1.5
                     group-hover:text-opacity-90">
          {title}
          <span className="text-base">{colors.emoji}</span>
          {/* Status indicator */}
          {renderStatusIndicator()}
        </h3>
        <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
          {isGenerating ? (
            <span className="text-primary animate-pulse">
              Creating your special song...
            </span>
          ) : description}
        </p>
        {hasVariations && !isGenerating && currentSong && (
          <div className="flex items-center gap-1 mt-3 text-white/60">
            <div
              role="button"
              tabIndex={0}
              onClick={(e: MouseEvent<HTMLDivElement>) => onVariationChange(e, type, 'prev')}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && onVariationChange(e as unknown as MouseEvent<HTMLDivElement>, type, 'prev')}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
            </div>
            <span className="text-xs">
              {currentVariationIndex + 1}/{variationCount}
            </span>
            <div
              role="button"
              tabIndex={0}
              onClick={(e: MouseEvent<HTMLDivElement>) => onVariationChange(e, type, 'next')}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && onVariationChange(e as unknown as MouseEvent<HTMLDivElement>, type, 'next')}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 
                    bg-gradient-radial from-white/5 to-transparent 
                    rounded-full -mr-12 -mb-12 
                    group-hover:scale-150 transition-transform duration-700"></div>
    </div>
  );
}
````

## File: src/components/profile/ProfileModal.tsx
````typescript
import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useErrorStore } from '../../store/errorStore';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { profile, updateProfile } = useAuthStore();
  const { error: globalError, clearError } = useErrorStore();
  const [formState, setFormState] = useState({ babyName: '', gender: '' });
  const [error, setError] = useState<{ global?: string; babyName?: string; gender?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setFormState({ 
        babyName: profile.babyName ?? '',
        gender: profile.gender ?? '' 
      });
      setError({});
      setShowSuccess(false);
      clearError();
    }
  }, [isOpen, profile, clearError]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError({});
    clearError(); // Clear any global errors

    const trimmedName = formState.babyName.trim();
    if (!trimmedName) {
      setError({ babyName: "Please enter your baby's name" });
      return;
    }

    if (!formState.gender) {
      setError({ gender: "Please select your baby's gender" });
      return;
    }
    
    try {
      await updateProfile({ 
        babyName: trimmedName,
        gender: formState.gender
      });
      setShowSuccess(true);
    } catch (error) {
      // Only show profile-specific errors
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      if (!errorMessage.includes('preset') && !errorMessage.includes('songs')) {
        setError({ global: errorMessage });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="card p-8 w-full max-w-md mx-4 relative border-white/[0.05] fade-in">
        
        {showSuccess && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 rounded-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-medium">Profile Updated Successfully!</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white transition-all duration-300 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold text-white mb-8">Profile Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Baby's Name
              <span className="text-primary ml-1" title="Required">*</span>
            </label>
            <input
              type="text"
              value={formState.babyName}
              onChange={(e) => setFormState((prev) => ({ ...prev, babyName: e.target.value }))}
              className={`input w-full ${error.babyName ? 'border-red-400' : ''}`}
              placeholder="Enter your baby's name"
              required
            />
            {error.babyName && <p className="text-red-400 text-sm mt-1">{error.babyName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Baby's Gender
              <span className="text-primary ml-1" title="Required">*</span>
            </label>
            <select
              value={formState.gender}
              onChange={(e) => setFormState((prev) => ({ ...prev, gender: e.target.value }))}
              className={`input w-full ${error.gender ? 'border-red-400' : ''}`}
              required
            >
              <option value="">Select gender</option>
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
              <option value="other">Other</option>
            </select>
            {error.gender && <p className="text-red-400 text-sm mt-1">{error.gender}</p>}
          </div>

          {(error.global || globalError) && (
            <p className="text-red-400 text-sm mt-1">{error.global || globalError}</p>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-300">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
````

## File: src/components/EmailSignupForm.tsx
````typescript
import { FormEvent, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { isValidEmail } from '../utils/validation';

interface EmailSignupFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailSignupForm({ isOpen, onClose }: EmailSignupFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [isDevMode, setIsDevMode] = useState(false);

  // Check if we're in development mode
  useEffect(() => {
    // In development, window.location.hostname is typically localhost or 127.0.0.1
    setIsDevMode(
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }
    
    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }
    
    // Always log the email for tracking in development
    if (isDevMode) {
      console.log(`Waitlist signup email: ${trimmedEmail}`);
    }
    
    try {
      // Always attempt to call the Netlify function first
      // This allows testing with Netlify CLI in development
      let apiSuccess = false;
      let responseData = null;
      
      try {
        console.log('Attempting to call Netlify function at /.netlify/functions/waitlist');
        const response = await fetch('/.netlify/functions/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail })
        });
        
        const responseText = await response.text();
        
        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
            console.log('Netlify function response:', responseData);
          } catch {
            console.warn('Non-JSON response received:', responseText.slice(0, 100));
          }
        }
        
        if (response.ok) {
          apiSuccess = true;
          const successMessage = responseData?.message || 
            'Successfully added to waitlist! Please check your email to confirm your subscription.';
          setSuccess(true);
          setMessage(successMessage);
        } else if (responseData?.error) {
          throw new Error(responseData.error);
        }
      } catch (apiError) {
        console.warn('API request failed:', apiError);
        
        // Only if we're in development mode and the API call failed, use the fallback
        if (isDevMode && !apiSuccess) {
          console.log('🚨 Development mode - Using mock Beehiiv integration as fallback');
          console.log('📨 Would have sent email to Beehiiv:', trimmedEmail);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Show a development-specific message
          setSuccess(true);
          setMessage('Development mode: Email would be added to Beehiiv waitlist in production.');
        } else {
          // In production, or if we want accurate error reporting in development
          throw apiError;
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md relative border-white/[0.05] fade-in overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-secondary/20 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-12 left-12 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-12 right-12 w-20 h-20 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/60 hover:text-white bg-white/5 rounded-full p-2
                     transition-all duration-300 hover:rotate-90 hover:bg-white/10 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-white to-secondary 
                       bg-clip-text text-transparent mb-2">
            Stay Tuned for Launch
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Sign up to be the first to know when we launch
          </p>
          
          {success ? (
            <div className="text-center">
              <p className="text-primary text-xl mb-4">Thanks for signing up!</p>
              <p className="text-white/60 text-sm">
                {message || "We'll let you know when we launch"}
              </p>
              {isDevMode && message.includes('Development mode') && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                  <p className="text-yellow-300 text-xs">Developer Mode: Mock response was used because the Netlify function was not available. Run with Netlify CLI to test the actual function.</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email
                  <span className="text-primary ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full bg-white/[0.07] focus:bg-white/[0.09] transition-colors"
                  required
                  placeholder="Enter your email"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              {isDevMode && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-yellow-300 text-xs">
                    Developer Mode: {window.location.hostname}. 
                    Will attempt to call Netlify function first. 
                    Use 'netlify dev' command to test with real functions.
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-black font-medium
                         py-3 rounded-xl hover:opacity-90 transition-all duration-300
                         shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                    <span>Signing Up...</span>
                  </div>
                ) : (
                  'Join Waitlist'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/Footer.tsx
````typescript
export default function Footer() {
  return (
    <footer className="text-center text-white/40 text-sm py-8 border-t border-white/5">
      © 2025 BabyMusic AI. All rights reserved.
    </footer>
  );
}
````

## File: src/components/Header.tsx
````typescript
import { useState, useEffect, useRef } from 'react';
import { Music2, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './auth/AuthModal';
import EmailSignupForm from './EmailSignupForm';
import ProfileModal from './profile/ProfileModal';
import { useErrorStore } from '../store/errorStore';
import { useEmailSignup } from '../hooks/useEmailSignup';

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { error: authError } = useErrorStore();
  const { isOpen: isEmailSignupOpen, handleOpen: handleOpenEmailSignup, handleClose: handleCloseEmailSignup } = useEmailSignup();
  
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
  
  // Force open the email signup form for testing
  useEffect(() => {
    if (isSignupDisabled && !user) {
      // Wait a bit to make sure everything is loaded
      const timer = setTimeout(() => {
        handleOpenEmailSignup();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSignupDisabled, user, handleOpenEmailSignup]);

  useEffect(() => {
    if (authError) {
      console.error('Auth error:', authError);
    }
  }, [authError]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-background-dark/80 backdrop-blur-xl border-b border-white/[0.05] z-[100]">
        {authError && (
          <div className="absolute top-full left-0 right-0 bg-red-500/90 text-white text-sm py-2 px-4 text-center">
            {authError}
            <button
              onClick={() => window.location.reload()}
              className="ml-2 underline hover:no-underline"
            >
              Refresh Page
            </button>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 relative">
              <Music2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-float" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BabyMusic AI
              </span>
            </div>
            <nav className="flex items-center space-x-4 relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="fixed-button w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full
                             bg-white/10 text-white/80 hover:text-white hover:bg-white/20 
                             transition-all duration-300 hover:scale-105 shadow-lg shadow-black/5
                             relative z-[101]"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    className="text-white/80 hover:text-white transition-all duration-300 px-3 py-1.5 sm:px-4 sm:py-2
                             hover:bg-white/5 rounded-lg text-sm sm:text-base active:scale-95"
                    onClick={async () => {
                      try {
                        await signOut();
                      } catch (error) {
                        console.error('Sign out failed:', error);
                        window.location.reload();
                      }
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {isSignupDisabled ? (
                    <button
                      onClick={handleOpenEmailSignup}
                      className="btn-primary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                    >
                      Join Waitlist
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setAuthMode('signin');
                          setIsAuthModalOpen(true);
                        }}
                        className="btn-secondary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3" 
                        data-auth-trigger
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('signup');
                          setIsAuthModalOpen(true);
                        }}
                        className="btn-primary text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                      >
                        Try Free
                      </button>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      {isSignupDisabled ? (
        <EmailSignupForm
          isOpen={isEmailSignupOpen}
          onClose={handleCloseEmailSignup}
        />
      ) : (
        <AuthModal
          isOpen={isAuthModalOpen}
          defaultMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
      
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
````

## File: src/components/MusicGenerator.tsx
````typescript
import { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import type { ThemeType, VoiceType, Tempo, MusicMood } from '../types';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import ThemeSelector from './music-generator/ThemeSelector';
import VoiceSelector from './music-generator/VoiceSelector';
import CustomOptions from './music-generator/CustomOptions';
import LyricsInput from './music-generator/LyricsInput';
import GenerationProgress from './music-generator/GenerationProgress';
import { SongPromptService } from '../services/songPromptService';
import { useSongGenerationTimer } from '../hooks/useSongGenerationTimer';

type TabType = 'themes' | 'fromScratch';

export default function MusicGenerator() {
  const [activeTab, setActiveTab] = useState<TabType>('themes');
  const [theme, setTheme] = useState<ThemeType | undefined>();
  const [tempo, setTempo] = useState<Tempo | undefined>();
  const [mood, setMood] = useState<MusicMood | undefined>();
  const [voiceSettings, setVoiceSettings] = useState({
    isInstrumental: false,
    voice: 'softFemale' as VoiceType
  });
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [songType, setSongType] = useState<'preset' | 'theme' | 'theme-with-input' | 'from-scratch'>('theme');
  
  const { createSong, generatingSongs } = useSongStore();
  const { user } = useAuthStore();
  const isGenerating = generatingSongs.size > 0;
  
  // Use the centralized timer hook
  const { timeLeft, totalTime, formattedTime, progress } = useSongGenerationTimer(isGenerating);

  // Reset states when changing tabs
  useEffect(() => {
    setUserInput('');
    setSongType(activeTab === 'themes' ? 'theme' : 'from-scratch');
    setError(null);
    setVoiceSettings({
      isInstrumental: false,
      voice: 'softFemale' as VoiceType
    });
  }, [activeTab]);

  const handleGenerate = async () => {
    if (!user?.id) {
      setError('Please sign in to generate music');
      return;
    }
    
    // Validate required fields based on song type
    if ((songType === 'theme' || songType === 'theme-with-input') && !theme) {
      setError('Please select a theme');
      return;
    }
    
    // Add validation for theme-with-input to require user input
    if (songType === 'theme-with-input' && !userInput.trim()) {
      setError('Please enter your custom text');
      return;
    }
    
    if (songType === 'from-scratch') {
      if (!mood) {
        setError('Please select a mood');
        return;
      }
      
      if (!tempo) {
        setError('Please select a tempo');
        return;
      }
      
      if (!userInput.trim()) {
        setError('Please enter your custom text');
        return;
      }
    }

    console.log('Generate clicked:', { 
      activeTab, 
      theme, 
      mood, 
      userInput,
      songType,
      voiceSettings
    });

    setError(null);

    try {
      const baseParams = {
        voice: voiceSettings.isInstrumental ? undefined : voiceSettings.voice,
        isInstrumental: voiceSettings.isInstrumental,
        songType
      };

      // Get the user's profile
      const profile = useAuthStore.getState().profile;
      if (!profile) {
        throw new Error('User profile not found');
      }

      if (songType === 'theme' || songType === 'theme-with-input') {
        console.log('Creating themed song:', {
          theme,
          songType,
          userInput: userInput.trim()
        });

        await createSong({
          ...baseParams,
          name: SongPromptService.generateTitle({
            theme,
            babyName: profile.babyName,
            isInstrumental: voiceSettings.isInstrumental,
            songType
          }),
          theme,
          userInput: userInput.trim() || undefined
        });
      } else {
        // from-scratch mode
        console.log('Creating custom song:', {
          mood,
          userInput: userInput.trim()
        });

        await createSong({
          ...baseParams,
          name: `${mood} Song: ${userInput.slice(0, 30)}${userInput.length > 30 ? '...' : ''}`,
          tempo,
          mood,
          userInput: userInput.trim()
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate music');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 card relative z-10">
      <div className="space-y-6">
        {/* Chrome-style Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-300 relative
                     ${activeTab === 'themes' 
                       ? 'text-white bg-white/10' 
                       : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            Goal-Based
            {activeTab === 'themes' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('fromScratch')}
            className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-300 relative
                     ${activeTab === 'fromScratch' 
                       ? 'text-white bg-white/10' 
                       : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            Build from Scratch
            {activeTab === 'fromScratch' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'themes' ? (
            <>
              <ThemeSelector
                key="theme-selector"
                selectedTheme={theme}
                onThemeSelect={setTheme}
              />
              <LyricsInput
                key="theme-lyrics"
                value={userInput}
                onChange={setUserInput}
                onSongTypeChange={setSongType}
              />
            </>
          ) : (
            <>
              <LyricsInput
                key="scratch-lyrics"
                value={userInput}
                onChange={setUserInput}
                isFromScratch
                onSongTypeChange={setSongType}
              />
              <CustomOptions
                key="scratch-options"
                tempo={tempo}
                mood={mood}
                onTempoSelect={setTempo}
                onMoodSelect={setMood}
              />
            </>
          )}
          
          {/* Only show voice options if user has ideas or in fromScratch mode */}
          {(songType === 'theme-with-input' || songType === 'from-scratch') && (
            <VoiceSelector
              isInstrumental={voiceSettings.isInstrumental}
              selectedVoice={voiceSettings.voice}
              onVoiceSelect={(voice) => setVoiceSettings(prev => ({ ...prev, voice }))}
              onInstrumentalToggle={(isInstrumental) => 
                setVoiceSettings(prev => ({ ...prev, isInstrumental }))}
            />
          )}
        </div>

        {/* Generate Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center space-x-3 min-h-[48px] bg-gradient-to-r from-primary to-secondary
                     text-black font-medium px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-300
                     disabled:opacity-50 shadow-lg shadow-primary/25 group"
          >
            <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>{isGenerating ? 'Generating...' : 'Create Music'}</span>
          </button>
        </div>
        
        {error && (
          <p className="text-red-400 text-sm text-center mt-4 fade-in">{error}</p>
        )}

        {isGenerating && (
          <GenerationProgress
            timeLeft={timeLeft}
            totalTime={totalTime}
            formattedTime={formattedTime}
            progress={progress}
          />
        )}
      </div>
    </div>
  );
}
````

## File: src/components/PresetSongs.tsx
````typescript
import { type FC } from 'react';
import { Baby, UtensilsCrossed, Moon, Waves } from 'lucide-react';
import usePresetSongs from '../hooks/usePresetSongs';
import { useAuthStore } from '../store/authStore';
import { useAudioStore } from '../store/audioStore';
import PresetSongCard from './preset/PresetSongCard';
import type { PresetType } from '../types';

const PRESETS: {
  type: PresetType;
  icon: typeof Baby;
  title: string;
  description: string;
}[] = [
  {
    type: 'playing',
    icon: Baby,
    title: 'Playtime',
    description: 'Fun and energetic songs for active moments',
  },
  {
    type: 'eating',
    icon: UtensilsCrossed,
    title: 'Mealtime',
    description: 'Gentle melodies to make eating enjoyable',
  },
  {
    type: 'sleeping',
    icon: Moon,
    title: 'Bedtime',
    description: 'Soothing lullabies for peaceful sleep',
  },
  {
    type: 'pooping',
    icon: Waves,
    title: 'Flushtime', //Let it be Flushtime
    description: 'Playful tunes to make bathroom time fun',
  },
];

const PresetSongs: FC = () => {
  const { user, profile } = useAuthStore();
  const { isPlaying, currentUrl: currentPlayingUrl } = useAudioStore();
  
  const {
    songs,
    handlePresetClick,
    handlePlay,
    handleVariationChange,
    isPresetTypeGenerating,
    currentVariationIndices
  } = usePresetSongs();

  // Show component only when we have a logged-in user
  if (!user) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 relative px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 
                    rounded-3xl blur-3xl"></div>
      <h2 className="text-3xl font-bold text-white mb-6 sm:mb-8 text-center relative z-10 bg-transparent">
        {profile?.babyName ? `${profile.babyName}'s Special Songs` : 'Special Songs'}
        <span className="block text-base sm:text-lg font-normal text-white/60 mt-2">
          ✨ Magical melodies for every moment ✨
        </span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
        {PRESETS.map(({ type, icon, title, description }) => {
          // Find the song for this preset type
          const song = songs.find(s => s.preset_type === type);
          const audioUrl = song?.audio_url;
          
          return (
            <PresetSongCard
              key={type}
              type={type}
              title={title}
              description={description}
              iconComponent={icon}
              songs={songs}
              isPlaying={isPlaying && currentPlayingUrl === audioUrl}
              onPlayClick={(url) => handlePlay(url)}
              onGenerateClick={handlePresetClick}
              onVariationChange={handleVariationChange}
              currentVariationIndex={currentVariationIndices[type] || 0}
              isPresetTypeGenerating={isPresetTypeGenerating}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PresetSongs;
````

## File: src/components/SongItem.tsx
````typescript
import { useState, useEffect } from 'react';
import { Play, Pause, Download, Share2, ChevronDown, RefreshCw } from 'lucide-react';
import { SongStateService } from '../services/songStateService';
import type { Song } from '../types';
import { useSongStore } from '../store/songStore';
import { SongService } from '../services/songService';
import { useAuthStore } from '../store/authStore';
import SongGenerationTimer from './common/SongGenerationTimer';

interface SongItemProps {
  song: Song;
  currentSong: string | null;
  isPlaying: boolean;
  onPlayClick: (audioUrl: string, songId: string) => void;
  onDownloadClick: (audioUrl: string, title: string) => void;
}

export default function SongItem({
  song,
  currentSong,
  isPlaying,
  onPlayClick,
  onDownloadClick
}: SongItemProps) {
  const [expandedVariations, setExpandedVariations] = useState(false);
  const { retryingSongs, setRetrying } = useSongStore();
  const { user } = useAuthStore();

  // Get all the song state information from SongStateService
  const isGenerating = SongStateService.isGenerating(song);
  const hasFailed = SongStateService.hasFailed(song);
  const hasVariations = SongStateService.hasVariations(song);
  const isCompleted = SongStateService.isCompleted(song);
  const canRetry = SongStateService.canRetry(song);

  // Check if the song is currently being retried
  const isRetrying = retryingSongs.has(song.id);

  // Get the audio URL and check if it's actually available
  const audioUrl = song.audio_url;
  const isPlayable = !!audioUrl; // A song is playable if it has an audio URL

  // Effect to clear retrying state when song state changes
  useEffect(() => {
    if (isPlayable && isRetrying) {
      setRetrying(song.id, false);
    }
  }, [isPlayable, isRetrying, song.id, setRetrying]);

  // Handle toggling variations display
  const toggleExpand = () => {
    if (hasVariations) {
      setExpandedVariations(!expandedVariations);
    }
  };

  // Handle retry button click
  const handleRetry = async () => {
    if (song.id && !isRetrying && user) {
      try {
        setRetrying(song.id, true);
        const babyName = user.user_metadata?.babyName || 'Baby';
        await SongService.retrySongGeneration(song.id, user.id, babyName);
      } catch (error) {
        console.error('Failed to retry song:', error);
        setRetrying(song.id, false);
      }
    }
  };

  return (
    <div className="card p-6 group hover:bg-white/[0.09] transition-all duration-500 mb-4
                   bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium text-lg mb-1">{song.name}</h3>
          <p className="text-sm text-white/60">
            {`${song.mood || ''} ${song.theme ? `• ${song.theme}` : ''}`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasVariations && (
            <button
              onClick={toggleExpand}
              className="text-white/60 hover:text-primary transition-all duration-300"
            >
              <ChevronDown
                className={`w-5 h-5 transform transition-transform ${
                  expandedVariations ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
          <button
            onClick={() => isPlayable && audioUrl && onPlayClick(audioUrl, song.id)}
            disabled={!isPlayable}
            className={`transition-all duration-300 group flex items-center justify-center
                     ${isPlaying && currentSong === audioUrl 
                        ? 'bg-gradient-to-br from-black/80 to-black/90 text-green-400 border border-green-500/30 shadow-lg rounded-full p-2.5' 
                        : 'text-white/60 hover:text-primary disabled:opacity-50 p-2.5'}`}
          >
            {isPlaying && currentSong === audioUrl ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
          <button
            disabled={!isPlayable}
            onClick={() => isPlayable && audioUrl && onDownloadClick(audioUrl, song.name)}
            className="text-white/60 hover:text-accent disabled:opacity-50
                     transition-all duration-300 group"
          >
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button
            disabled={!isPlayable}
            className="text-white/60 hover:text-secondary disabled:opacity-50
                     transition-all duration-300 group"
          >
            <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Variations section */}
      {expandedVariations && hasVariations && song.variations && (
        <div className="mt-6 space-y-3 pl-6 border-l-2 border-primary/20">
          {song.variations.map((variation, index) => (
            <div
              key={variation.id}
              className="flex items-center justify-between py-3 px-4 bg-white/[0.05]
                       rounded-xl backdrop-blur-sm group/variation hover:bg-white/[0.08]
                       transition-all duration-300"
            >
              <span className="text-white/80">
                Variation {index + 1}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => variation.audio_url && onPlayClick(variation.audio_url, song.id)}
                  className={`transition-all duration-300 flex items-center justify-center
                           ${isPlaying && currentSong === variation.audio_url 
                              ? 'bg-gradient-to-br from-black/80 to-black/90 text-green-400 border border-green-500/30 shadow-sm rounded-full p-1.5' 
                              : 'text-white/60 hover:text-primary p-1.5'}`}
                >
                  {isPlaying && currentSong === variation.audio_url ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 group-hover/variation:scale-110 transition-transform" />
                  )}
                </button>
                <button 
                  onClick={() => variation.audio_url && onDownloadClick(variation.audio_url, `${song.name} - Variation ${index + 1}`)}
                  className="text-white/60 hover:text-accent transition-all duration-300"
                >
                  <Download className="w-4 h-4 group-hover/variation:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generation progress */}
      {!isPlayable && (
        <div className="mt-2">
          <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
            <div className={`h-full bg-primary animate-pulse ${
              hasFailed ? 'bg-red-400 !animate-none' : ''
            }`}></div>
          </div>
          <div className="flex items-center justify-between mt-1">
            {isGenerating ? (
              <SongGenerationTimer 
                isGenerating={isGenerating} 
                showProgress={false}
                className="w-full"
              />
            ) : (
              <p className={`text-xs text-white/60 ${hasFailed ? '!text-red-400' : ''}`}>
                {isCompleted ? 'Ready to play' : (song.error || 'Processing...')}
              </p>
            )}
            {canRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className={`text-xs flex items-center ${
                  song.error && song.error.includes('timed out') 
                    ? 'text-white bg-primary hover:bg-primary/80' 
                    : 'text-white bg-primary/20 hover:bg-primary/30'
                } px-2 py-1 rounded transition-all ${isRetrying ? 'opacity-50' : ''}`}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Retry'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
````

## File: src/components/SongList.tsx
````typescript
import { useState } from 'react';
import { useEffect } from 'react';
import { Trash2, Music2 } from 'lucide-react';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import { useAudioStore } from '../store/audioStore';
import SongItem from './SongItem';

export default function SongList() {
  const { songs, loadSongs, isLoading, isDeleting, deleteAllSongs, generatingSongs, processingTaskIds } = useSongStore();
  const { user } = useAuthStore();
  const { isPlaying, currentUrl, playAudio } = useAudioStore();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDownload = async (audioUrl: string, title: string) => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download audio:', error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Loading songs for user:', user.id);
      loadSongs().then(() => {
        setInitialLoadComplete(true);
      });
    }
  }, [loadSongs, user]);

  const handleDeleteAll = async () => {
    try {
      await deleteAllSongs();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete songs:', error);
    }
  };

  const handlePlay = (audioUrl: string, _songId: string) => {
    playAudio(audioUrl);
  };
  
  // Only show loading state on initial load, not when refreshing
  if (isLoading && !initialLoadComplete) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-white/60">Loading your songs...</p>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        {isDeleting ? (
          <p className="text-white/60 text-lg animate-pulse">
            Deleting all songs...
          </p>
        ) : (
        <div>
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary/20 to-secondary/20 
                        rounded-full flex items-center justify-center">
            <Music2 className="w-12 h-12 text-primary animate-float" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              Create Your First Melody
            </h3>
            <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
              Choose a mood and instrument above to generate a unique song for your little one.
            </p>
          </div>
        </div>
        )}
      </div>
    );
  }

  // Filter out preset songs using proper checks - use SongStateService
  const regularSongs = songs.filter(song => 
    song.song_type !== 'preset' || !song.preset_type
  );

  // Check if all songs have errors
  const allSongsHaveErrors = regularSongs.length > 0 && regularSongs.every(song => !!song.error);

  return (
    <div>
      <div className="flex justify-end mb-6">
        {songs.length > 0 && (
          <div className="relative">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10
                         text-red-400 hover:bg-red-500/20 transition-all duration-300
                         font-medium"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 card p-4 border-red-500/20 bg-black/50">
                <span className="text-white/80">Are you sure?</span>
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium
                           hover:bg-red-600 transition-all duration-300 
                           shadow-lg shadow-red-500/25"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, delete all'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white/80 font-medium
                           hover:bg-white/20 transition-all duration-300
                           border border-white/10"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {allSongsHaveErrors && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-yellow-300 text-sm">
            All your songs encountered generation issues. This could be due to high server load or temporary service disruptions. 
            Please try retrying your songs or creating new ones.
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {regularSongs.map((song) => (
          <SongItem
            key={song.id}
            song={song}
            currentSong={currentUrl}
            isPlaying={isPlaying && currentUrl === song.audio_url}
            generatingSongs={generatingSongs}
            processingTaskIds={processingTaskIds}
            onPlayClick={handlePlay}
            onDownloadClick={handleDownload}
          />
        ))}
      </div>
    </div>
  );
}
````

## File: src/data/lyrics/index.ts
````typescript
// Export all lyrics-related constants
export { PRESET_CONFIGS } from './presets';
export { THEME_CONFIGS, THEME_LYRICS } from './themes';
````

## File: src/data/lyrics/presets.ts
````typescript
import type { PresetType, MusicMood } from '../../types';

interface PresetConfig {
  title: (name: string) => string;
  mood: MusicMood;
  lyrics: (name: string) => string;
  description: string;
}

export const PRESET_CONFIGS: Record<PresetType, PresetConfig> = {
  playing: {
    title: (name: string) => `${name}'s Playtime Song`,
    mood: 'energetic',
    lyrics: (name: string) => 
      `Jump and bounce, let's play around,\n` +
      `${name}'s having fun, hear the happy sound!\n` +
      `Clap your hands and spin with glee,\n` +
      `Playing games, just you and me!\n\n` +
      `Toys and blocks and so much more,\n` +
      `${name}'s learning what fun is for!\n` +
      `Giggles, smiles, and lots of play,\n` +
      `Making memories every day!`,
    description: 'Energetic melody for playtime activities'
  },
  eating: {
    title: (name: string) => `${name}'s Mealtime Song`,
    mood: 'playful',
    lyrics: (name: string) =>
      `Yummy yummy in ${name}'s tummy,\n` +
      `Eating food that's oh so yummy!\n` +
      `One more bite, it tastes so nice,\n` +
      `Healthy food will make you rise!\n\n` +
      `Open wide, here comes the spoon,\n` +
      `${name} will grow up big real soon!\n` +
      `Munching, crunching, what a treat,\n` +
      `Mealtime makes our day complete!`,
    description: 'Encouraging melody for mealtime'
  },
  sleeping: {
    title: (name: string) => `${name}'s Bedtime Lullaby`,
    mood: 'calm',
    lyrics: (name: string) =>
      `Sweet dreams, little ${name}, close your eyes,\n` +
      `Stars are twinkling in the night skies.\n` +
      `Soft and cozy in your bed,\n` +
      `Rest your precious sleepy head.\n\n` +
      `Moonbeams dancing, soft and bright,\n` +
      `Watching over you tonight.\n` +
      `Drift away to dreamland sweet,\n` +
      `Until morning we shall meet.`,
    description: 'Soothing lullaby for bedtime'
  },
  pooping: {
    title: (name: string) => `${name}'s Flush Time Song`,
    mood: 'playful',
    lyrics: (name: string) =>
      `It's potty time for ${name} today,\n` +
      `Learning new things along the way!\n` +
      `Sitting proud upon the throne,\n` +
      `You can do this on your own!\n\n` +
      `Push push, little ${name}, you're doing great,\n` +
      `This is something to celebrate!\n` +
      `When you're done, we'll wash our hands,\n` +
      `You're the star of potty land!`,
    description: 'Playful melody for potty training'
  }
};
````

## File: src/data/lyrics/themes.ts
````typescript
import type { ThemeType } from '../../types';

interface ThemeConfig {
  lyrics: (name: string) => string;
  description: string;
  prompt: string;
}

export const THEME_CONFIGS: Record<ThemeType, ThemeConfig> = {
  pitchDevelopment: {
    lyrics: (name) =>
      `Up and down goes ${name}'s voice,\n` +
      `Like a bird making musical choice.\n` +
      `High notes soar and low notes play,\n` +
      `${name}'s singing brightens every day!\n\n` +
      `Do Re Mi, can you see?\n` +
      `${name}'s learning music, one, two, three!\n` +
      `Notes and scales, never fails,\n` +
      `Making music tell sweet tales!`,
    description: 'Melodic patterns for pitch recognition training',
    prompt: 'Create a children\'s song focused on pitch recognition and vocal development'
  },
  cognitiveSpeech: {
    lyrics: (name) =>
      `Listen close as ${name} speaks,\n` +
      `Words and sounds like mountain peaks.\n` +
      `Syllables dance, letters play,\n` +
      `${name}'s voice grows stronger every day!\n\n` +
      `Speak and sing, let words ring,\n` +
      `${name}'s voice makes everything swing!\n` +
      `Clear and bright, pure delight,\n` +
      `Learning language day and night!`,
    description: 'Clear rhythmic patterns for speech development',
    prompt: 'Create a children\'s song that encourages speech development and cognitive learning'
  },
  sleepRegulation: {
    lyrics: (name) =>
      `Hush now ${name}, drift and dream,\n` +
      `Float away on starlight's beam.\n` +
      `Gentle waves of sleepy sighs,\n` +
      `Carry you through peaceful skies.\n\n` +
      `Rest your head, time for bed,\n` +
      `Dreams are waiting to be read.\n` +
      `Close your eyes, paradise,\n` +
      `Sleep until the sun does rise.`,
    description: 'Gentle lullaby with soothing patterns',
    prompt: 'Create a gentle lullaby to help with sleep regulation'
  },
  socialEngagement: {
    lyrics: (name) =>
      `Hello friends, ${name} is here,\n` +
      `Bringing smiles and lots of cheer!\n` +
      `Wave your hands and say hello,\n` +
      `Making friendships as we go!\n\n` +
      `Share and care, show you're there,\n` +
      `${name}'s learning how to be aware!\n` +
      `Kind and true, me and you,\n` +
      `Building bonds both old and new!`,
    description: 'Interactive melody for social bonding',
    prompt: 'Create a children\'s song that promotes social interaction and emotional development'
  },
  indianClassical: {
    lyrics: (name) =>
      `Om Shanti ${name}, peaceful and bright,\n` +
      `Like morning ragas at first light.\n` +
      `Gentle swaras guide the way,\n` +
      `As ${name} learns to sing and play.\n\n` +
      `Peaceful rhythms, soft and slow,\n` +
      `Help ${name}'s inner light to grow.\n` +
      `Ancient wisdom, new and pure,\n` +
      `Making melodies to endure.`,
    description: 'Peaceful Indian classical melody with gentle ragas and traditional elements',
    prompt: 'Create a children\'s song incorporating Indian classical music elements'
  },
  westernClassical: {
    lyrics: (name) =>
      `${name} dances with Mozart's grace,\n` +
      `Classical beauty fills this place.\n` +
      `Gentle strings and flutes so sweet,\n` +
      `Make ${name}'s melody complete!\n\n` +
      `Bach and more, music's door,\n` +
      `${name}'s learning what to explore!\n` +
      `Pure and bright, day and night,\n` +
      `Classical dreams take their flight!`,
    description: 'Adapted classical melodies for babies',
    prompt: 'Create a children\'s song incorporating Western classical music elements'
  }
};

// For backward compatibility
export const THEME_LYRICS = Object.fromEntries(
  Object.entries(THEME_CONFIGS).map(([key, config]) => [key, config.lyrics])
) as Record<ThemeType, (name: string) => string>;
````

## File: src/hooks/useAuthModal.ts
````typescript
import { useState } from 'react';

export function useAuthModal() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
  };

  return {
    isAuthModalOpen,
    authMode,
    handleOpenAuth,
    handleCloseAuth
  };
}
````

## File: src/hooks/useEmailSignup.ts
````typescript
import { useState, useCallback, useEffect } from 'react';

export function useEmailSignup() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    console.log('Opening email signup form');
    setIsOpen(true);
  }, []);
  
  const handleClose = useCallback(() => {
    console.log('Closing email signup form');
    setIsOpen(false);
  }, []);

  // Debug log when state changes
  useEffect(() => {
    console.log('Email signup form isOpen state changed:', isOpen);
  }, [isOpen]);

  return {
    isOpen,
    handleOpen,
    handleClose,
  };
}
````

## File: src/hooks/usePresetSongs.ts
````typescript
import { useState, useEffect, useCallback, MouseEvent, useMemo } from 'react';
import type { PresetType, Song } from '../types';
import { useSongStore } from '../store/songStore';
import { SongStateService } from '../services/songStateService';
import { useAudioStore } from '../store/audioStore';
import { useAuthStore } from '../store/authStore';
import { PRESET_CONFIGS } from '../data/lyrics';

export default function usePresetSongs() {
  const { user, profile } = useAuthStore();
  const { songs, generatingSongs, createSong } = useSongStore();
  const { isPlaying: _isPlaying, playAudio } = useAudioStore();
  
  // Filter only preset songs
  const [presetSongs, setPresetSongs] = useState<Song[]>([]);
  
  // Track current variation index for each preset type
  const [variationIndices, setVariationIndices] = useState<Record<PresetType, number>>({
    playing: 0,
    sleeping: 0,
    eating: 0,
    pooping: 0
  });
  
  // Generate song names based on baby name using useMemo to avoid dependency issues
  const songNames = useMemo(() => {
    return profile?.babyName
      ? Object.fromEntries(
          Object.entries(PRESET_CONFIGS).map(([type, config]) => [
            type,
            config.title(profile.babyName!)
          ])
        )
      : {};
  }, [profile?.babyName]);

  // Update filtered songs when the songs state changes
  useEffect(() => {
    // Filter only preset songs
    const filteredPresetSongs = songs.filter(song => 
      song.song_type === 'preset' && song.preset_type !== undefined
    );
    
    setPresetSongs(filteredPresetSongs);
  }, [songs]);

  // Check if a preset type is currently generating
  const isPresetTypeGenerating = useCallback((type: PresetType): boolean => {
    // Check if any song of this type is in the global generating set
    return songs.some(song => 
      song.preset_type === type && 
      song.id && 
      generatingSongs.has(song.id)
    );
  }, [songs, generatingSongs]);

  // Handle preset card click
  const handlePresetClick = useCallback((type: PresetType) => {
    // If user or profile is missing, we can't proceed
    if (!user?.id || !profile?.babyName) {
      console.error('User or profile not loaded');
      return;
    }

    const currentSong = SongStateService.getSongForPresetType(songs, type);
    const isGenerating = SongStateService.isPresetTypeGenerating(songs, type);
    const hasFailed = currentSong ? SongStateService.hasFailed(currentSong) : false;
    
    // If the song is already generating, do nothing
    if (isGenerating) {
      return;
    }
    
    // If the song is ready (has audio URL), play it
    if (currentSong && currentSong.audio_url) {
      playAudio(currentSong.audio_url);
      return;
    }
    
    // Log the action being taken
    console.log(`Handling click for ${type} preset:`, {
      currentSong: currentSong ? {
        id: currentSong.id,
        name: currentSong.name,
        hasFailed,
        hasAudio: !!currentSong.audio_url
      } : 'none',
      action: hasFailed ? 'retrying' : 'generating new'
    });
    
    // Generate a new song
    createSong({
      name: songNames[type as keyof typeof songNames],
      mood: PRESET_CONFIGS[type].mood,
      songType: 'preset',
      preset_type: type,
      lyrics: PRESET_CONFIGS[type].lyrics(profile.babyName),
      gender: profile.gender
    });
  }, [songs, createSong, playAudio, user, profile, songNames]);

  const handlePlay = useCallback((audioUrl: string) => {
    playAudio(audioUrl);
  }, [playAudio]);

  const handleVariationChange = useCallback((
    e: MouseEvent<HTMLDivElement>,
    type: PresetType,
    direction: 'next' | 'prev'
  ) => {
    e.stopPropagation(); // Prevent card click
    
    const { variationCount, song } = SongStateService.getPresetTypeStateMetadata(
      songs,
      type
    );
    
    if (!variationCount || variationCount <= 1 || !song?.variations) return;
    
    // Get current index for this type
    const currentIndex = variationIndices[type] || 0;
    
    // Calculate new index
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % variationCount
      : (currentIndex - 1 + variationCount) % variationCount;
    
    // Update variation index
    setVariationIndices(prev => ({
      ...prev,
      [type]: newIndex
    }));
    
    // Play the audio if available
    if (song.variations[newIndex]?.audio_url) {
      playAudio(song.variations[newIndex].audio_url);
    }
  }, [songs, playAudio, variationIndices]);

  return {
    songs: presetSongs,
    handlePresetClick,
    handlePlay,
    handleVariationChange,
    isPresetTypeGenerating,
    currentVariationIndices: variationIndices
  };
}
````

## File: src/hooks/useRealtime.ts
````typescript
import { useEffect } from 'react';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';

export function useRealtime() {
  const user = useAuthStore(state => state.user);
  const setupSubscription = useSongStore(state => state.setupSubscription);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (user?.id) {
      unsubscribe = setupSubscription();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, setupSubscription]);
}
````

## File: src/hooks/useResetGenerating.ts
````typescript
import { useState, useCallback } from 'react';
import { useSongStore } from '../store/songStore';

/**
 * Hook to provide functionality for resetting songs stuck in generating state
 */
export function useResetGenerating() {
  const [isResetting, setIsResetting] = useState(false);
  const { generatingSongs, resetGeneratingState } = useSongStore();
  
  const hasStuckSongs = generatingSongs.size > 0;
  
  const resetStuckSongs = useCallback(async () => {
    if (!hasStuckSongs) return;
    
    setIsResetting(true);
    try {
      await resetGeneratingState();
    } catch (error) {
      console.error('Failed to reset generating state:', error);
    } finally {
      setIsResetting(false);
    }
  }, [hasStuckSongs, resetGeneratingState]);
  
  return {
    hasStuckSongs,
    isResetting,
    resetStuckSongs,
    stuckSongCount: generatingSongs.size
  };
}

export default useResetGenerating;
````

## File: src/hooks/useSongGenerationTimer.ts
````typescript
import { useState, useEffect } from 'react';

// Define timeout directly here (5 minutes in milliseconds)
const SONG_TIMEOUT_DURATION = 5 * 60 * 1000;

// Convert milliseconds to seconds for UI display
const TIMEOUT_SECONDS = Math.floor(SONG_TIMEOUT_DURATION / 1000);

/**
 * Hook for managing song generation timer
 * Uses the same timeout duration as the server-side timeout
 * @param isGenerating Whether a song is currently being generated
 * @returns Timer state and helper functions
 */
export function useSongGenerationTimer(isGenerating: boolean) {
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS);
  const [progress, setProgress] = useState(0);
  
  // Reset and start timer when generation starts
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isGenerating) {
      // Reset timer when starting generation
      setTimeLeft(TIMEOUT_SECONDS);
      setProgress(0);
      
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev > 0 ? prev - 1 : 0;
          // Calculate progress percentage (0-100)
          setProgress(((TIMEOUT_SECONDS - newTime) / TIMEOUT_SECONDS) * 100);
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isGenerating]);
  
  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return {
    timeLeft,
    progress,
    formattedTime: formatTime(),
    totalTime: TIMEOUT_SECONDS
  };
}
````

## File: src/lib/claude.ts
````typescript
import Anthropic from '@anthropic-ai/sdk';

interface ValidatedResponse {
  text: string;
  quality: {
    length: number;
    hasName: boolean
  };
}

export class ClaudeAPI {
  private static client: Anthropic;

  private static getClient(): Anthropic {
    if (!this.client) {
      if (!import.meta.env.VITE_CLAUDE_API_KEY) {
        throw new Error('Claude API key is not configured');
      }
      this.client = new Anthropic({
        apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
        dangerouslyAllowBrowser: true // Required for browser environments
      });
    }
    return this.client;
  }

  private static validateResponse(text: string, prompt: string): ValidatedResponse {
    const trimmedText = text.trim();
    
    // Clean the response text
    const cleanedText = trimmedText
      // First remove any text before a colon at the start
      .replace(/^[^:\n]+:\s*/m, '')
      // Then clean up any remaining explanatory text
      .replace(/^(Here are|Here's|These are|I've created|The lyrics for|This is a|This song)[^:\n]*\n/gim, '')
      // Remove any empty lines at the start
      .replace(/^\s*\n/, '')
      .trim();
    
    // Check if response contains the name from the prompt
    const nameMatch = prompt.match(/for\s+(\w+)/);
    const expectedName = nameMatch ? nameMatch[1] : null;
    const hasName = expectedName ? cleanedText.includes(expectedName) : true;

    return {
      text: cleanedText.length > 3000 ? cleanedText.slice(0, 3000) : cleanedText,
      quality: {
        length: cleanedText.length,
        hasName
      }
    };
  }

  static async makeRequest(userPrompt: string, systemPrompt?: string): Promise<ValidatedResponse> {
    console.log('Making Claude API request:', {
      userPromptLength: userPrompt.length,
      hasSystemPrompt: !!systemPrompt
    });

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const client = this.getClient();
      
      // Construct the messages array for the API request
      const messagesParams = [];
      
      // Add system prompt if provided
      if (systemPrompt) {
        messagesParams.push({
          role: 'system' as const, // Type assertion to satisfy Anthropic SDK types
          content: systemPrompt
        });
      }
      
      // Add user prompt
      messagesParams.push({
        role: 'user' as const, // Type assertion to satisfy Anthropic SDK types
        content: userPrompt
      });
      
      const response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: messagesParams,
        temperature: 0.7
      });

      clearTimeout(timeoutId);

      // Extract the text content from the response
      const rawResponse = typeof response.content[0].text === 'string' 
        ? response.content[0].text 
        : '';
      
      // Validate and process the response
      const validatedResponse = this.validateResponse(rawResponse, userPrompt);
      
      // Log validation results
      console.log('Claude response validation:', {
        length: validatedResponse.quality.length,
        hasName: validatedResponse.quality.hasName,
        truncated: validatedResponse.text.length < rawResponse.length
      });

      return validatedResponse;
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      // Check if it's an abort error (timeout)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Claude API request timed out after 30 seconds');
        throw new Error('Claude API request timed out. Please try again.');
      }
      
      // Handle Anthropic API errors
      if (fetchError instanceof Anthropic.APIError) {
        console.error('Claude API error:', fetchError);
        throw new Error(
          fetchError.status === 401
            ? 'Invalid API key'
            : fetchError.status === 429
            ? 'Rate limit exceeded'
            : fetchError.status >= 500
            ? 'Claude API service error'
            : `Claude API error: ${fetchError.message}`
        );
      }
      
      // Rethrow the error to be handled by the caller
      throw fetchError;
    }
  }
}
````

## File: src/lib/piapi.ts
````typescript
import { MusicGenerationParams } from '../types';
import { LyricGenerationService } from '../services/lyricGenerationService';
import { SongPromptService } from '../services/songPromptService';

const API_URL = 'https://api.piapi.ai/api/v1';
const API_KEY = import.meta.env.VITE_PIAPI_KEY;

const PIAPI_LIMITS = {
  PROMPT_MAX_LENGTH: 3000,
  TAGS_MAX_LENGTH: 200,
};

// Edge Function URL with anon key for authentication
const WEBHOOK_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/piapi-webhook`;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

export const createMusicGenerationTask = async ({
  theme,
  mood,
  userInput,
  name,
  gender,
  ageGroup,
  tempo,
  isInstrumental,
  songType,
  voice,
  preset_type,
}: MusicGenerationParams): Promise<string> => {
  const babyName = name || 'little one';

  // Get base description and title using SongPromptService
  const baseDescription = SongPromptService.getBaseDescription({
    theme,
    mood,
    songType,
    presetType: preset_type,
    voice,
    isInstrumental
  });

  const title = SongPromptService.generateTitle({
    theme,
    mood,
    babyName,
    isInstrumental,
    songType,
    presetType: preset_type
  });

  // Generate lyrics if needed
  let generatedLyrics = '';
  if (!isInstrumental) {
    try {
      generatedLyrics = await LyricGenerationService.generateLyrics({
        babyName,
        theme,
        mood,
        tempo,
        ageGroup,
        userInput,
        songType,
        presetType: preset_type,
        gender
      });
    } catch (error) {
      console.error('Lyrics generation failed, using fallback:', error);
      generatedLyrics = await LyricGenerationService.getFallbackLyrics({
        babyName,
        theme,
        mood,
        presetType: preset_type,
        songType,
        gender
      });
    }
  }

  const description = `${baseDescription}`;
  
  const truncateToLimit = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) : text;
  };
  
  // Use generated lyrics as the prompt for music generation
  const promptWithLyrics = generatedLyrics || '';

  // ##### Calls API to generate music #####
  const requestBody = {
    model: 'music-s',
    task_type: 'generate_music_custom',
    config: {
      webhook_config: {
        endpoint: WEBHOOK_URL,
        secret: import.meta.env.VITE_WEBHOOK_SECRET,
        include_output: true,
      },
    },
    input: {
      title: title,
      prompt: truncateToLimit(promptWithLyrics, PIAPI_LIMITS.PROMPT_MAX_LENGTH),
      tags: truncateToLimit(description, PIAPI_LIMITS.TAGS_MAX_LENGTH),
      make_instrumental: isInstrumental || false,
      negative_tags: 'rock, metal, aggressive, harsh',
    },
  };

  // Log the complete input being sent to PIAPI
  console.log('================ PIAPI REQUEST ================');
  console.log('Song Type:', songType);
  console.log('Theme:', theme);
  console.log('Mood:', mood);
  console.log('Preset Type:', preset_type);
  console.log('Voice:', voice);
  console.log('Gender:', gender);
  console.log('Is Instrumental:', isInstrumental);
  console.log('Base Description:', baseDescription);
  console.log('Title:', title);
  console.log('Prompt (Lyrics):', promptWithLyrics.substring(0, 200) + (promptWithLyrics.length > 200 ? '...' : ''));
  console.log('Tags:', requestBody.input.tags);
  console.log('Make Instrumental:', requestBody.input.make_instrumental);
  console.log('Full Request Body:', JSON.stringify(requestBody, (key, value) => 
    key === 'secret' ? '***' : value, 2));
  console.log('===============================================');

  try {
    const response = await fetch(`${API_URL}/task`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      let errorMessage = 'Failed to create music generation task';

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // If parsing fails, use the raw error text if it exists
        console.error('Failed to parse error response:', parseError);
        errorMessage = errorText || errorMessage;
      }

      // Check for common API key issues
      if (response.status === 401 || errorMessage.includes('auth') || errorMessage.includes('key')) {
        console.error('API KEY ISSUE DETECTED:', {
          status: response.status,
          message: errorMessage,
          apiKeyLength: API_KEY ? API_KEY.length : 0,
          apiKeyDefined: !!API_KEY
        });
      }

      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        message: errorMessage,
        url: API_URL,
        apiKeyDefined: !!API_KEY,
        webhookUrlDefined: !!WEBHOOK_URL,
        requestBody: {
          ...requestBody,
          config: {
            ...requestBody.config,
            webhook_config: {
              ...requestBody.config.webhook_config,
              secret: '***'
            }
          }
        }
      });

      // Provide user-friendly error messages based on status codes
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error(
          'Music generation service is temporarily unavailable. Please try again later.'
        );
      } else {
        throw new Error(`Failed to create music: ${errorMessage}`);
      }
    }

    const data = await response.json();

    if (!data.data?.task_id) {
      console.error('Missing task_id in response:', data);
      throw new Error('Failed to start music generation: No task ID returned');
    }
    return data.data.task_id as string;
  } catch (error) {
    console.error('Music generation request failed:', error);
    throw error;
  }
};
````

## File: src/lib/supabase.ts
````typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// Check for environment variables
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
  // Return a dummy client that will show appropriate UI messages
  throw new Error('Please click "Connect to Supabase" to set up your database connection');
}

if (!supabaseKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  throw new Error('Please click "Connect to Supabase" to set up your database connection');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to clear browser storage (can be run from console)
export const clearSupabaseStorage = () => {
  try {
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.refreshToken');
    sessionStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.refreshToken');
    console.log('Supabase storage cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing Supabase storage:', error);
    return false;
  }
};

// Function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection test successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    return { success: false, error };
  }
};

// Function to check if a user exists
export const checkUserExists = async (email: string) => {
  try {
    console.log('Checking if user exists:', email);
    
    // Use the auth.admin.listUsers endpoint with a filter
    // Note: This requires service role key, so it's better to implement this on the server side
    // For client-side, we'll use a workaround by trying to reset the password
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    
    // If there's no error or the error is not about the user not existing,
    // then the user likely exists
    if (!error || !error.message.includes('User not found')) {
      console.log('User likely exists');
      return { exists: true };
    }
    
    console.log('User does not exist');
    return { exists: false };
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return { exists: false, error };
  }
};

// Make the functions available globally for debugging
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).clearSupabaseStorage = clearSupabaseStorage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testSupabaseConnection = testSupabaseConnection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).checkUserExists = checkUserExists;
}
````

## File: src/pages/Dashboard.tsx
````typescript
import PresetSongs from '../components/PresetSongs';
import MusicGenerator from '../components/MusicGenerator';
import SongList from '../components/SongList';
import { useErrorStore } from '../store/errorStore';
import { useRealtime } from '../hooks/useRealtime';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/authStore';
import MiniStreak from '../components/dashboard/MiniStreak';
import DetailedStreak from '../components/dashboard/DetailedStreak';

export default function Dashboard() {
  const error = useErrorStore(state => state.error);
  const { profile, initialized } = useAuthStore();
  useRealtime();

  const streakDays = 5;
  const dailyGoal = 3;
  const songsToday = 2;

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="scroll-container">
      {error && (
        <div className="fixed top-16 left-0 right-0 z-50 p-4 bg-red-500/90 backdrop-blur-sm text-white text-center">
          {error}
        </div>
      )}
      <section className="pt-20 pb-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-background-dark to-black opacity-50"></div>
        
        {/* Header with Mini Streak */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-4 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {profile?.babyName ? `Welcome back, ${profile.babyName}'s Parent! 👋` : 'Welcome back! 👋'}
            </h1>
            <p className="text-white/70">
              Let's create some magical melodies together
            </p>
          </div>
          <div className="flex justify-center">
            <MiniStreak streakDays={streakDays} />
          </div>
        </div>

        <PresetSongs />
        <MusicGenerator />
        
        <div className="scroll-optimize">
          <div className="mt-16 max-w-2xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-white to-secondary 
                        bg-clip-text text-transparent mb-8 text-center">
              Your Melodies
              <span className="block text-base text-white/60 font-normal mt-2">
                Your collection of personalized songs
              </span>
            </h2>
            <SongList />
          </div>

          {/* Detailed Streak Section */}
          <div className="mt-24 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Your Progress
            </h2>
            <DetailedStreak
              streakDays={streakDays}
              dailyGoal={dailyGoal}
              songsToday={songsToday}
            />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
````

## File: src/pages/Landing.tsx
````typescript
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import ProblemSolution from '../components/landing/ProblemSolution';
import VideoEvidence from '../components/landing/VideoEvidence';
import ResearchInstitutions from '../components/landing/ResearchInstitutions';
import Benefits from '../components/landing/Benefits';
import CTASection from '../components/landing/CTASection';
import AuthModal from '../components/auth/AuthModal';
import EmailSignupForm from '../components/EmailSignupForm';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/authStore';
import { useAuthModal } from '../hooks/useAuthModal';
import { useEmailSignup } from '../hooks/useEmailSignup';

export default function Landing() {
  const { user: _user } = useAuthStore();
  const { isAuthModalOpen, authMode, handleOpenAuth, handleCloseAuth } = useAuthModal();
  const { isOpen: isEmailSignupOpen, handleOpen: handleOpenEmailSignup, handleClose: handleCloseEmailSignup } = useEmailSignup();
  
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
  
  // Create a wrapper function that handles both cases
  const handleAction = () => {
    if (isSignupDisabled) {
      handleOpenEmailSignup();
    } else {
      handleOpenAuth('signup');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-radial from-background-dark via-background-dark to-black">
      <div className="absolute inset-0 bg-stars bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5"></div>
      
      <Hero onOpenAuth={handleAction} />
      <ProblemSolution />
      <VideoEvidence />
      <ResearchInstitutions />
      <Features />
      <Benefits />
      <CTASection onOpenAuth={handleAction} />
      <Footer />
      
      {isSignupDisabled ? (
        <EmailSignupForm
          isOpen={isEmailSignupOpen}
          onClose={handleCloseEmailSignup}
        />
      ) : (
        <AuthModal
          isOpen={isAuthModalOpen}
          defaultMode={authMode}
          onClose={handleCloseAuth}
        />
      )}
    </div>
  );
}
````

## File: src/pages/Methodology.tsx
````typescript
import { Brain, ArrowLeft, ArrowRight, Zap, Music2, Heart, Star, Sparkles, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';
import AuthModal from '../components/auth/AuthModal';
import { useAuthModal } from '../hooks/useAuthModal';
import EmailSignupForm from '../components/EmailSignupForm';
import { useEmailSignup } from '../hooks/useEmailSignup';

export default function Methodology() {
  const { isAuthModalOpen, authMode, handleOpenAuth, handleCloseAuth } = useAuthModal();
  const { isOpen: isEmailSignupOpen, handleOpen: handleOpenEmailSignup, handleClose: handleCloseEmailSignup } = useEmailSignup();
  
  // Handle auth depending on whether signup is disabled
  const handleAuthClick = () => {
    if (import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true') {
      handleOpenEmailSignup();
    } else {
      handleOpenAuth('signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-background-dark via-background-dark to-black pt-20 pb-32">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-[0.07]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8
                   transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </a>

        {/* Parent-Friendly Summary Section */}
        <div className="card p-8 mb-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10
                      border-white/10 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-white/40">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            The Science Made Simple
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: Zap,
                title: "Enhanced Brain Development",
                description: "Music strengthens neural connections, improving your baby's learning abilities"
              },
              {
                icon: Heart,
                title: "Emotional Well-being",
                description: "Scientifically crafted melodies reduce stress and promote emotional security"
              }
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4 p-4 bg-white/5 rounded-xl">
                <Icon className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium text-white mb-1">{title}</h3>
                  <p className="text-sm text-white/70">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleAuthClick}
              className="btn-primary text-sm px-6 py-3 flex items-center gap-2"
            >
              {import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true' ? 'Join the Waitlist' : 'Try It Free'}
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <a href="#detailed-research" className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white
                                               rounded-md hover:bg-white/5 transition-all duration-300">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Research</span>
            </a>
          </div>
        </div>

        <div id="detailed-research" className="prose prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Our Methodology
          </h1>

          <h2 className="text-xl font-semibold mb-4">1. Overview</h2>
          <p className="text-white/80 mb-8">
            Early auditory experiences play a critical role in cognitive, linguistic, and emotional development. Research indicates that structured musical exposure enhances neural plasticity, speech processing, emotional regulation, and attention span in infants. Our approach integrates scientifically validated principles from auditory neuroscience, cognitive psychology, and ethnomusicology to create music that aligns with the developmental needs of infants.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Cognitive and Neural Foundations</h2>
          <h3 className="text-lg font-medium mb-3">2.1 Music and Neuroplasticity in Infants</h3>
          <p className="text-white/80 mb-4">
            Infants are born with a high degree of neuroplasticity, meaning their brains adapt rapidly to sensory inputs. Research from the University of Washington (2016) suggests that exposure to rhythmic auditory patterns enhances the infant brain's ability to process speech, recognize patterns, and predict auditory sequences.
          </p>
          <p className="text-white/80 mb-4">Key Findings:</p>
          <ul className="list-disc pl-6 mb-6 text-white/80">
            <li>Structured musical exposure improves synaptic efficiency in auditory and prefrontal cortices.</li>
            <li>Early rhythm training correlates with stronger phonological awareness, a precursor to language acquisition.</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">2.2 Absolute Pitch and Early Auditory Encoding</h3>
          <p className="text-white/80 mb-4">
            Studies by Diana Deutsch (2013) and NCBI (2016) confirm that infants exposed to distinct pitch-based melodies exhibit a higher likelihood of developing absolute pitch perception. Absolute pitch contributes to:
          </p>
          <ul className="list-disc pl-6 mb-8 text-white/80">
            <li>Enhanced memory recall and musical ability.</li>
            <li>Greater speech intonation sensitivity, aiding multilingual acquisition.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">3. Emotional and Behavioral Impact of Music</h2>
          <h3 className="text-lg font-medium mb-3">3.1 Music for Emotional Regulation</h3>
          <p className="text-white/80 mb-4">
            Infants respond physiologically and behaviorally to different types of sound. Research from the National Center for Biotechnology Information (NCBI, 2019) indicates that:
          </p>
          <ul className="list-disc pl-6 mb-8 text-white/80">
            <li>Lullabies with slow, repetitive melodies reduce cortisol (stress hormone) levels in infants.</li>
            <li>Rhythmic, predictable patterns activate the limbic system, enhancing emotional security.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">4. Cultural and Musical Framework</h2>
          <h3 className="text-lg font-medium mb-3">4.1 The Role of Indian Classical Music in Cognitive Development</h3>
          <p className="text-white/80 mb-4">
            Indian classical music, particularly raga-based melodies, follows a structured system of pitch and microtonal variations. Neuroscientific studies on raga music suggest:
          </p>
          <ul className="list-disc pl-6 mb-6 text-white/80">
            <li>Raga Yaman and Raga Mohanam enhance focus and emotional depth.</li>
            <li>Carnatic rhythmic cycles (Tala systems) improve predictive timing and attention span.</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">4.2 Western Classical Music and Structured Learning</h3>
          <p className="text-white/80 mb-4">
            Research on Mozart Effect and Beethoven's structured compositions highlights:
          </p>
          <ul className="list-disc pl-6 mb-8 text-white/80">
            <li>Harmonic progressions aid spatial-temporal reasoning.</li>
            <li>Baroque compositions (Bach, Vivaldi) enhance logical pattern recognition.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">5. Methodology in Music Composition</h2>
          <p className="text-white/80 mb-4">Our musical design follows a four-step scientific process:</p>

          {/* Visual Process Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="card p-6 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Music2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Sound Selection</h3>
              <p className="text-sm text-white/70">Pure tones and soft harmonics for optimal pitch perception, using high-frequency instruments babies naturally prefer.</p>
            </div>
            <div className="card p-6 bg-gradient-to-br from-secondary/10 to-transparent">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Emotional Design</h3>
              <p className="text-sm text-white/70">Carefully structured melodies that promote emotional security and reduce stress hormones.</p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">5.2 Tempo and Rhythm Structuring</h3>
          <ul className="list-disc pl-6 mb-6 text-white/80">
            <li>60-80 BPM mimics caregiver speech patterns, aiding in language recognition.</li>
            <li>Structured pauses improve auditory discrimination and attention regulation.</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">5.3 Emotional Conditioning Through Music</h3>
          <ul className="list-disc pl-6 mb-6 text-white/80">
            <li>Soft, repetitive lullabies encourage serotonin release, promoting relaxation.</li>
            <li>Energetic, rhythmic tracks activate dopaminergic pathways, supporting motor development.</li>
          </ul>
          
          {/* Subtle Mid-content CTA */}
          <div className="my-12 p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 
                        rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-8">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-white mb-2">Experience the Science in Action</h4>
                <p className="text-sm text-white/70">
                  See how our research-backed approach can enhance your baby's development through music.
                </p>
              </div>
              <button
                onClick={handleAuthClick}
                className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl
                         transition-all duration-300 flex items-center gap-2 group"
              >
                {import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true' ? 'Join Waitlist' : 'Try Now'}
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">5.4 Adaptive Playlists for Developmental Stages</h3>
          <ul className="list-disc pl-6 mb-8 text-white/80">
            <li>0-6 months: Soothing, high-frequency tones for auditory mapping.</li>
            <li>6-12 months: More rhythm-driven pieces for motor and language synchronization.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">6. Evidence-Based Approach</h2>
          <p className="text-white/80 mb-4">
            Our methodology is informed by peer-reviewed research from the following institutions:
          </p>
          <div className="grid gap-4 mb-8">
            {[
              {
                institution: "University of Washington (2016)",
                description: "Groundbreaking research on music enhancing infant neural responses to speech",
                icon: Brain,
                color: "text-sky-400"
              },
              {
                institution: "Harvard University",
                description: "Comprehensive studies on music and neural connectivity in early development",
                icon: Sparkles,
                color: "text-rose-400"
              },
              {
                institution: "NCBI Studies",
                description: "Multiple studies on phonological development, cortisol reduction, and emotional regulation",
                icon: Heart,
                color: "text-green-400"
              },
              {
                institution: "Diana Deutsch (2013)",
                description: "Pioneering research on early pitch perception and cognitive development",
                icon: Music2,
                color: "text-purple-400"
              },
              {
                institution: "Mozart Effect Research",
                description: "Studies demonstrating significant improvements in spatial reasoning abilities",
                icon: Star,
                color: "text-amber-400"
              }
            ].map(({ institution, description, icon: Icon, color }) => (
              <div key={institution} 
                   className="flex items-start gap-4 p-4 bg-white/5 rounded-xl
                            hover:bg-white/10 transition-all duration-300">
                <Icon className={`w-6 h-6 ${color} shrink-0 mt-1`} />
                <div>
                  <h3 className="text-white font-medium mb-1">{institution}</h3>
                  <p className="text-white/70 text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <h2 className="text-xl font-semibold mb-4">7. Conclusion</h2>
          <p className="text-white/80 mb-12">
            Our music is designed using scientifically validated principles to support early cognitive development, emotional well-being, and linguistic skills in infants. By integrating music cognition research, neuroscience, and cultural diversity, we provide an evidence-based approach to fostering holistic growth through sound.
          </p>

          {/* Final CTA */}
          <div className="card p-6 mb-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5
                        border-white/10 text-center">
            <p className="text-white/90 mb-4">
              Ready to give your baby the gift of scientifically-crafted music?
            </p>
            <button
              onClick={handleAuthClick}
              className="btn-primary text-sm px-6 py-3 flex items-center gap-2 mx-auto"
            >
              {import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true' ? 'Join the Waitlist' : 'Create Your First Song'}
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
          
        </div>
        <div className="mt-16">
          <Footer />
        </div>
        
        {import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true' ? (
          <EmailSignupForm
            isOpen={isEmailSignupOpen}
            onClose={handleCloseEmailSignup}
          />
        ) : (
          <AuthModal
            isOpen={isAuthModalOpen}
            defaultMode={authMode}
            onClose={handleCloseAuth}
          />
        )}
      </div>
    </div>
  );
}
````

## File: src/services/lyricGenerationService.ts
````typescript
import type {
  ThemeType,
  MusicMood,
  Tempo,
  AgeGroup,
  PresetType,
} from '../types';
import { ClaudeAPI } from '../lib/claude';
import { PRESET_CONFIGS, THEME_CONFIGS } from '../data/lyrics';
import { supabase } from '../lib/supabase';

const SYSTEM_PROMPT = `You are a professional children's songwriter specializing in creating engaging, 
age-appropriate lyrics. Your task is to create lyrics based on the following requirements:

1. Name: ALWAYS use the child's name exactly as provided
2. Length: Maximum 2900 characters
3. Language: Simple, child-friendly words
4. Tone: Positive and uplifting
5. Theme: Follow provided mood/theme
6. Format: Plain text with line breaks
7. Song should last 2-3 mins

Output only the lyrics, no explanations or additional text.`;


interface LyricGenerationParams {
  babyName: string;
  ageGroup?: AgeGroup;
  theme?: ThemeType;
  mood?: MusicMood;
  tempo?: Tempo;
  userInput?: string;
  songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  presetType?: PresetType;
  gender?: string;
}

// Age-specific modifiers for prompts
const AGE_MODIFIERS: Record<AgeGroup, string> = {
  '0-6': 'Keep it very simple and repetitive.',
  '7-12': 'Use simple words and clear patterns.',
  '13-24': 'Include more complex words and concepts.',
};

// Mood-specific style guidance
const MOOD_STYLES: Record<MusicMood, string> = {
  calm: 'Use soothing and peaceful language.',
  playful: 'Make it fun and bouncy.',
  learning: 'Focus on educational elements.',
  energetic: 'Include active and dynamic words.',
};

// Tempo-specific guidance
const TEMPO_MODIFIERS: Record<Tempo, string> = {
  slow: 'Keep a gentle, slow rhythm.',
  medium: 'Maintain a moderate, steady pace.',
  fast: 'Create an upbeat, quick rhythm.',
};

export class LyricGenerationService {
  static async generateLyrics(params: LyricGenerationParams): Promise<string> {
    console.log('LyricGenerationService.generateLyrics called with:', {
      ...params,
      userInput: params.userInput ? 'provided' : 'not provided',
      gender: params.gender || 'not provided'
    });

    // Validate required parameters
    if (!params.babyName) {
      throw new Error('Baby name is required for lyric generation');
    }

    // Set a timeout for the entire lyric generation process
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Lyric generation timed out after 45 seconds'));
      }, 45000); // 45 second timeout
    });

    try {
      // Ensure Claude API key is configured
      if (!import.meta.env.VITE_CLAUDE_API_KEY) {
        console.warn('Claude API key not found, using fallback lyrics');
        return this.getFallbackLyrics(params);
      }

      const {
        babyName,
        ageGroup,
        theme,
        mood,
        tempo,
        userInput,
        songType,
        presetType,
        gender
      } = params;

      // Ensure clean baby name
      const name = babyName.trim();

      // Build the user prompt
      let lyricsBasePrompt = '';

      // Determine the base song description
      if (songType === 'preset' && presetType && PRESET_CONFIGS[presetType]) {
        lyricsBasePrompt = `Create a ${PRESET_CONFIGS[presetType].description} for ${name}`;
      } else if (songType === 'theme' && theme && THEME_CONFIGS[theme]) {
        lyricsBasePrompt = `${THEME_CONFIGS[theme].prompt} for ${name}`;
      } else if (songType === 'theme-with-input' && theme) {
        lyricsBasePrompt = `${THEME_CONFIGS[theme].prompt} for ${name}`;
      } else if (songType === 'from-scratch') {
        if (!mood) {
          throw new Error('Mood is required for songs built from scratch');
        }
        lyricsBasePrompt = `Write engaging children's song lyrics for ${name}. Make it age-appropriate and fun.`;
      } else {
        throw new Error('Invalid song type');
      }

      // Add age-specific modifications if available
      if (ageGroup) {
        lyricsBasePrompt += ' ' + AGE_MODIFIERS[ageGroup];
      }

      // Add mood style if specified
      if (mood) {
        lyricsBasePrompt += ' ' + MOOD_STYLES[mood];
      }

      // Add tempo guidance if specified
      if (tempo) {
        lyricsBasePrompt += ' ' + TEMPO_MODIFIERS[tempo];
      }

      // Add gender-specific guidance if provided
      if (gender) {
        if (gender === 'boy') {
          lyricsBasePrompt += ` Use male pronouns (he/him) and boy-appropriate language for ${name}.`;
        } else if (gender === 'girl') {
          lyricsBasePrompt += ` Use female pronouns (she/her) and girl-appropriate language for ${name}.`;
        } else {
          lyricsBasePrompt += ` Use gender-neutral pronouns (they/them) for ${name}.`;
        }
      }

      // Add user's custom input if provided
      if (userInput) {
        lyricsBasePrompt += `\n\nIncorporate these ideas: ${userInput}`;
      }

      // Construct the complete prompt with system instructions and user request
      const completePrompt = `${SYSTEM_PROMPT}\n\n${lyricsBasePrompt}`;

      try {
        if (!completePrompt?.trim()) {
          throw new Error('Prompt is required for lyrics generation');
        }

        console.log('Sending lyrics prompt to Claude:', {
          systemPrompt: SYSTEM_PROMPT.slice(0, 100) + '...\n',
          lyricsBasePromptStart: lyricsBasePrompt.slice(0, 150) + '...\n',
          hasName: lyricsBasePrompt.includes(name),
          promptLength: completePrompt.length
        });

        // Race between the API call and the timeout
        const lyrics = await Promise.race([
          ClaudeAPI.makeRequest(completePrompt),
          timeoutPromise
        ]);
        
        // Log quality metrics
        console.log('Lyrics generation quality:', lyrics.quality);
        
        // If the response doesn't contain the baby's name, log a warning
        if (!lyrics.quality.hasName) {
          console.warn('Generated lyrics may not contain baby name:', {
            name,
            length: lyrics.quality.length
          });
        }

        return lyrics.text;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Lyric generation failed:', {
          error: errorMessage,
          params: {
            hasName: !!babyName,
            theme,
            mood,
            isPreset: songType === 'preset',
            songType,
            hasUserInput: !!userInput,
          },
        });

        // Use fallback lyrics but preserve error for monitoring
        if (err instanceof Error) {
          try {
            await logLyricGenerationError(errorMessage, params);
          } catch (logError) {
            console.error('Failed to log lyric generation error:', {
              originalError: errorMessage,
              logError,
            });
            // Continue with fallback lyrics even if logging fails
          }
        }

        // Use backup lyrics from our data files
        return this.getFallbackLyrics(params);
      }
    } catch (error) {
      console.error('Lyric generation process failed completely:', error);
      return this.getFallbackLyrics(params);
    }
  }

  static async getFallbackLyrics(params: {
    babyName: string;
    theme?: ThemeType;
    mood?: MusicMood;
    presetType?: PresetType;
    songType?: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    gender?: string;
  }): Promise<string> {
    const { babyName, theme, mood, presetType, songType, gender } = params;
    const name = babyName.trim();
    
    try {
      console.log('Getting fallback lyrics for:', {
        name,
        theme,
        mood,
        presetType,
        songType,
        gender
      });
      
      // Add gender-specific pronouns
      let pronoun = 'they';
      let possessivePronoun = 'their';
      
      if (gender === 'boy') {
        pronoun = 'he';
        possessivePronoun = 'his';
      } else if (gender === 'girl') {
        pronoun = 'she';
        possessivePronoun = 'her';
      }
      
      // For preset songs, use the preset config
      if (songType === 'preset' && presetType && PRESET_CONFIGS[presetType]) {
        console.log('Using preset fallback lyrics for:', presetType);
        const lyrics = PRESET_CONFIGS[presetType].lyrics(name);
        return lyrics
          .replace(/\{pronoun\}/g, pronoun)
          .replace(/\{possessive\}/g, possessivePronoun);
      }
      
      // For theme songs, use the theme config
      if ((songType === 'theme' || songType === 'theme-with-input') && theme && THEME_CONFIGS[theme]) {
        console.log('Using theme fallback lyrics for:', theme);
        const lyrics = THEME_CONFIGS[theme].lyrics(name);
        return lyrics
          .replace(/\{pronoun\}/g, pronoun)
          .replace(/\{possessive\}/g, possessivePronoun);
      }
      
      console.log('Using custom fallback lyrics');
      // For custom songs, use a mood-based template
      const fallbackLyrics = songType === 'from-scratch' && mood
        ? `Let's make ${mood} music together,\n` +
          `${name} leads the way.\n` +
          `With ${pronoun} dancing and singing,\n` +
          `${possessivePronoun} smile shines so bright.\n` +
          `With melodies flowing,\n` +
          `Creating magic today!`
        : `Twinkle twinkle little star,\n` +
          `${name} wonders who you are.\n` +
          `Up above the world so high,\n` +
          `Like a diamond in the sky.\n` +
          `Twinkle twinkle little star,\n` +
          `${name} knows just how special you are.`;
      
      return fallbackLyrics;
    } catch (error) {
      console.error('Error generating fallback lyrics:', error);
      // Ultimate fallback if everything else fails
      return `Twinkle twinkle little star,\n` +
        `${name} wonders who you are.\n` +
        `Up above the world so high,\n` +
        `Like a diamond in the sky.\n` +
        `Twinkle twinkle little star,\n` +
        `${name} knows just how special you are.`;
    }
  }
}

export const logLyricGenerationError = async (
  error: string,
  params: LyricGenerationParams
) => {
  try {
    await supabase.from('lyric_generation_errors').insert([
      {
        error_message: error,
        theme: params.theme,
        mood: params.mood,
        song_type: params.songType,
        preset_type: params.presetType,
        has_user_input: !!params.userInput,
      }
    ]);
  } catch (logError) {
    console.error('Failed to log lyric generation error:', {
      originalError: error,
      logError,
    });
  }
};
````

## File: src/services/profileService.ts
````typescript
import { supabase } from '../lib/supabase';
import { DEFAULT_LANGUAGE } from '../types';
import type { Language, UserProfile, AgeGroup } from '../types';

interface ProfileUpdateParams {
  userId: string;
  babyName: string;
  preferredLanguage?: Language;
  birthMonth?: number;
  birthYear?: number;
  ageGroup?: AgeGroup;
  gender?: string;
}

export class ProfileService {
  static async updateProfile({ 
    userId, 
    babyName, 
    preferredLanguage,
    birthMonth,
    birthYear,
    ageGroup,
    gender
  }: ProfileUpdateParams): Promise<UserProfile> {
    const trimmedBabyName = babyName.trim();
    
    console.log('Starting profile update:', { 
      userId, 
      newName: trimmedBabyName,
      preferredLanguage,
      birthMonth,
      birthYear,
      ageGroup,
      gender
    });
    
    // Basic validation
    if (!userId) throw new Error('User ID is required');
    if (!trimmedBabyName) throw new Error('Baby name is required');
    if (gender === undefined) {
      console.log('Gender not provided, will not update gender field');
    }

    // First update the profile in the database
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(
        {
          baby_name: trimmedBabyName,
          ...(preferredLanguage && { preferred_language: preferredLanguage }),
          ...(birthMonth && { birth_month: birthMonth }),
          ...(birthYear && { birth_year: birthYear }),
          ...(ageGroup && { age_group: ageGroup }),
          ...(gender !== undefined && { gender })
        }
      )
      .eq('id', userId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    if (!profile) {
      throw new Error('Failed to update profile - no data returned');
    }

    // Return profile response immediately
    const profileResponse = {
      id: profile.id,
      email: profile.email,
      isPremium: profile.is_premium,
      dailyGenerations: profile.daily_generations,
      lastGenerationDate: profile.last_generation_date,
      babyName: profile.baby_name,
      preferredLanguage: profile.preferred_language || DEFAULT_LANGUAGE,
      gender: profile.gender
    };

    return profileResponse;
  }
}
````

## File: src/services/songPromptService.ts
````typescript
import { MusicMood, ThemeType, PresetType, VoiceType } from '../types';
import { PRESET_CONFIGS } from '../data/lyrics/presets';
import { THEME_CONFIGS } from '../data/lyrics/themes';

export class SongPromptService {
  static getThemeDescription(theme: ThemeType): string {
    const prompts = {
      pitchDevelopment: 'Melodic patterns for pitch recognition training',
      cognitiveSpeech: 'Clear rhythmic patterns for speech development',
      sleepRegulation: 'Gentle lullaby with soothing patterns',
      socialEngagement: 'Interactive melody for social bonding',
      indianClassical: 'Peaceful Indian classical melody with gentle ragas and traditional elements',
      westernClassical: 'Adapted classical melodies for babies',
    };

    if (!theme || !prompts[theme]) {
      throw new Error(`Invalid theme: ${theme}`);
    }

    return prompts[theme];
  }

  static getMoodPrompt(mood: MusicMood): string {
    return `Create a ${mood} children's song that is engaging and age-appropriate`;
  }

  static getThemePrompt(theme: ThemeType): string {
    switch (theme) {
      case 'pitchDevelopment':
        return 'Create a children\'s song focused on pitch recognition and vocal development';
      case 'cognitiveSpeech':
        return 'Create a children\'s song that encourages speech development and cognitive learning';
      case 'sleepRegulation':
        return 'Create a gentle lullaby to help with sleep regulation';
      case 'socialEngagement':
        return 'Create a children\'s song that promotes social interaction and emotional development';
      case 'indianClassical':
        return 'Create a children\'s song incorporating Indian classical music elements';
      case 'westernClassical':
        return 'Create a children\'s song incorporating Western classical music elements';
      default:
        return 'Create an engaging children\'s song';
    }
  }

  static generateTitle(params: {
    theme?: ThemeType;
    mood?: MusicMood;
    babyName: string;
    isInstrumental?: boolean;
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType;
  }): string {
    const { theme, mood, babyName, isInstrumental: _isInstrumental, songType, presetType } = params;
    const version = Math.floor(Math.random() * 10) + 1;
    
    // Define theme and mood names outside case blocks
    const themeNames = {
      pitchDevelopment: "Musical Journey",
      cognitiveSpeech: "Speaking Adventure",
      sleepRegulation: "Sleepy Time",
      socialEngagement: "Friendship Song",
      indianClassical: "Indian Melody",
      westernClassical: "Classical Journey"
    };
    
    const moodNames = {
      calm: "Peaceful",
      playful: "Playful",
      learning: "Learning",
      energetic: "Energetic"
    };
    
    switch (songType) {
      case 'preset':
        if (!presetType) {
          throw new Error('Preset type is required for preset songs');
        }
        return `${babyName}'s ${PRESET_CONFIGS[presetType].title(babyName)} (v${version})`;

      case 'theme':
      case 'theme-with-input':
        if (!theme) {
          throw new Error('Theme is required for theme-based songs');
        }
        return `${babyName}'s ${themeNames[theme]} (v${version})`;

      case 'from-scratch':
        if (!mood) {
          throw new Error('Mood is required for from-scratch songs');
        }
        return `${babyName}'s ${moodNames[mood]} Adventure (v${version})`;

      default:
        return `${babyName}'s Special Song (v${version})`;
    }
  }

  static getBaseDescription(params: {
    theme?: ThemeType;
    mood?: MusicMood;
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType;
    voice?: VoiceType;
    isInstrumental?: boolean;
  }): string {
    const { theme, mood, songType, presetType, voice, isInstrumental } = params;

    // First, consistently check songType
    let baseDescription = '';
    switch (songType) {
      case 'preset':
        if (!presetType || !PRESET_CONFIGS[presetType]) {
          throw new Error(`Invalid preset type: ${presetType}`);
        }
        baseDescription = PRESET_CONFIGS[presetType].description;
        break;

      case 'theme':
      case 'theme-with-input':
        if (!theme || !THEME_CONFIGS[theme]) {
          throw new Error(`Invalid theme: ${theme}`);
        }
        baseDescription = THEME_CONFIGS[theme].description;
        break;

      case 'from-scratch':
        if (!mood) {
          throw new Error('Mood is required for from-scratch songs');
        }
        baseDescription = this.getMoodPrompt(mood);
        break;

      default:
        throw new Error('Invalid song configuration');
    }

    // Append voice tag if not instrumental
    const finalVoice = !isInstrumental ? (voice || 'softFemale') : undefined;
    if (finalVoice) {
      baseDescription += ` In the song, use the voice: ${finalVoice}`;
    }

    return baseDescription;
  }
}
````

## File: src/services/songService.ts
````typescript
import { supabase } from '../lib/supabase';
import { createMusicGenerationTask } from '../lib/piapi';
import { PRESET_CONFIGS } from '../data/lyrics';
import { getPresetType } from '../utils/presetUtils';
import { DEFAULT_LANGUAGE } from '../types';
import type {
  Song,
  MusicMood,
  ThemeType,
  PresetType,
  Tempo,
  VoiceType,
  AgeGroup,
  SongVariation
} from '../types';

// Define a type to bridge database schema columns and Song interface
type DatabaseSong = {
  id: string;
  name: string;
  theme?: ThemeType;
  mood?: MusicMood;
  voice_type?: VoiceType;
  tempo?: Tempo;
  song_type?: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  lyrics?: string | null;
  created_at: string;
  user_id: string;
  audio_url?: string | null;
  user_lyric_input?: string | null;
  preset_type?: PresetType | null;
  is_instrumental?: boolean;
  retryable?: boolean;
  error?: string | null;
  task_id?: string | null;
  variations?: DatabaseSongVariation[];
  status?: string;
};

// Define a type for database song variations
type DatabaseSongVariation = {
  id: string;
  song_id: string;
  audio_url: string;
  title?: string;
  created_at: string;
  metadata?: {
    tags?: string;
    prompt?: string;
  };
};

/**
 * Converts a database song to the Song interface format
 * @param dbSong The database song record
 * @returns A song that matches the Song interface
 */
export function mapDatabaseSongToSong(dbSong: DatabaseSong): Song {
  // Convert database variations to SongVariation format if present
  const variations: SongVariation[] | undefined = dbSong.variations?.map(v => ({
    id: v.id,
    songId: v.song_id,
    audio_url: v.audio_url,
    title: v.title,
    created_at: new Date(v.created_at),
    metadata: v.metadata
  }));

  return {
    id: dbSong.id,
    name: dbSong.name,
    theme: dbSong.theme,
    mood: dbSong.mood,
    voice: dbSong.voice_type,
    lyrics: dbSong.lyrics || undefined,
    audio_url: dbSong.audio_url || undefined,
    createdAt: new Date(dbSong.created_at),
    userId: dbSong.user_id,
    retryable: dbSong.retryable,
    variations,
    error: dbSong.error || undefined,
    task_id: dbSong.task_id || undefined,
    song_type: dbSong.song_type,
    preset_type: dbSong.preset_type || undefined
  };
}

export class SongService {
  /**
   * Updates a song with an error status
   * @param songId The ID of the song to update
   * @param errorMessage The error message to set
   * @param retryable Whether the song can be retried
   */
  static async updateSongWithError(songId: string, errorMessage: string, retryable: boolean = true): Promise<void> {
    if (!songId) return;
    
    try {
      const { error } = await supabase
        .from('songs')
        .update({
          error: errorMessage,
          retryable: retryable,
          task_id: null // Clear task_id to indicate it's no longer in the queue
        })
        .eq('id', songId);
        
      if (error) {
        console.error(`Failed to update song ${songId} with error:`, error);
      }
    } catch (err) {
      console.error(`Error updating song ${songId} with error:`, err);
    }
  }

  /**
   * Starts song generation for a song record that already exists in the database
   * @param dbSong The database song record to generate
   * @param babyName The baby's name for personalization
   * @returns The task ID for the generation task
   */
  static async startSongGeneration(dbSong: DatabaseSong, babyName: string): Promise<string> {
    if (!dbSong.id) {
      throw new Error('Song ID is required to start generation');
    }
    
    try {
      // Get profile data if needed
      let ageGroup: AgeGroup | undefined;
      let gender: string | undefined;
      
      if (dbSong.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('age_group, gender')
          .eq('id', dbSong.user_id)
          .single();
          
        ageGroup = profile?.age_group as AgeGroup | undefined;
        gender = profile?.gender as string | undefined;
      }
      
      // Create task
      const taskId = await createMusicGenerationTask({
        theme: dbSong.theme,
        mood: dbSong.mood,
        tempo: dbSong.tempo,
        isInstrumental: !!dbSong.is_instrumental,
        voice: dbSong.voice_type,
        userInput: dbSong.user_lyric_input || undefined,
        songType: dbSong.song_type || 'preset',
        preset_type: dbSong.preset_type || undefined,
        name: babyName,
        gender,
        ageGroup
      });
      
      if (!taskId) {
        throw new Error('Failed to create music generation task');
      }
      
      // Update song with task ID
      const { error: updateError } = await supabase
        .from('songs')
        .update({
          task_id: taskId,
          error: null,
          retryable: false
        })
        .eq('id', dbSong.id);
        
      if (updateError) {
        throw updateError;
      }
      
      return taskId;
    } catch (error) {
      console.error(`Failed to start generation for song ${dbSong.id}:`, error);
      
      // Update song with error
      await this.updateSongWithError(
        dbSong.id,
        'Failed to start music generation. Please try again.'
      );
      
      throw error;
    }
  }

  static async loadUserSongs(userId: string): Promise<Song[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data: dbSongs, error } = await supabase
      .from('songs')
      .select(
        `
        *,
        variations:song_variations(*)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Convert database songs to Song interface format
    return (dbSongs || []).map(dbSong => mapDatabaseSongToSong(dbSong as DatabaseSong));
  }

  static async deleteUserSongs(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // First get all songs for this user to clear their timeouts
    const { data: songs, error: fetchError } = await supabase
      .from('songs')
      .select('id')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Failed to fetch songs for timeout clearing:', fetchError);
    } else if (songs && songs.length > 0) {
      // No need to clear timeouts anymore
      console.log(`Deleting ${songs.length} songs for user ${userId}`);
    }

    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Retries generation for a failed song
   * @param songId The ID of the song to retry
   * @param userId The user ID
   * @param babyName The baby's name
   */
  static async retrySongGeneration(songId: string, userId: string, babyName: string): Promise<Song> {
    console.log(`Retrying song generation for song ${songId}`);
    
    try {
      // First, get the song details
      const { data: dbSong, error: fetchError } = await supabase
        .from('songs')
        .select('*')
        .eq('id', songId)
        .eq('user_id', userId)
        .single();
      
      if (fetchError || !dbSong) {
        console.error('Failed to fetch song for retry:', fetchError);
        throw new Error('Failed to fetch song details');
      }

      // 1. Reset the song state and clear variations
      const resetSong = await this.prepareForRegeneration(songId);
      
      // 2. Start song generation
      const taskId = await this.startSongGeneration(resetSong as DatabaseSong, babyName);
      
      // 3. Update the song with the new task ID
      await this.updateSongWithTaskId(songId, taskId);
      
      // 4. Return updated song object
      return {
        ...mapDatabaseSongToSong(resetSong),
        task_id: taskId,
        error: undefined,
        retryable: false
      };
    } catch (error) {
      console.error('Error retrying song generation:', error);
      
      // Update the song with the error
      await this.updateSongWithError(
        songId, 
        'Failed to retry song generation. Please try again later.'
      );
      
      throw error;
    }
  }

  /**
   * Determines the appropriate mood for a song based on its type and parameters
   * @param params Parameters to determine the mood
   * @returns The determined mood or undefined if API should choose
   */
  private static determineMood(params: {
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType | null;
    mood?: MusicMood | null;
  }): MusicMood | undefined {
    const { songType, presetType, mood } = params;

    // For presets: use the preset's defined mood
    if (songType === 'preset' && presetType && PRESET_CONFIGS[presetType]) {
      return PRESET_CONFIGS[presetType].mood;
    }

    // For themes: let API choose based on theme
    if (songType === 'theme' || songType === 'theme-with-input') {
      return undefined;
    }

    // For custom songs: use user-selected mood
    return mood || undefined;
  }

  static async createSong(params: {
    userId: string;
    name: string;
    babyName: string;
    songParams: {
      tempo?: Tempo;
      voice?: VoiceType;
      theme?: ThemeType;
      mood?: MusicMood;
      userInput?: string;
      isInstrumental?: boolean;
      songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
      preset_type?: PresetType;
    };
  }): Promise<Song> {
    const { userId, name, babyName, songParams } = params;
    const { theme, mood, userInput, tempo, songType, isInstrumental, voice, preset_type: presetTypeParam } = songParams;

    console.log('Creating song with params:', {
      userId,
      name,
      songParams: {
        theme,
        mood,
        userInput: userInput ? `"${userInput}"` : 'not provided',
        tempo,
        isInstrumental,
        voice,
        songType,
        preset_type: presetTypeParam
      },
    });

    if (!userId || !name) {
      throw new Error('User ID and name are required');
    }

    // Get preset type if applicable
    const presetType = songType === 'preset' ? (presetTypeParam || getPresetType(name)) : undefined;

    console.log('Preset detection:', {
      name,
      songType,
      presetType,
      hasConfig: presetType ? !!PRESET_CONFIGS[presetType] : false,
    });

    // For non-preset/non-theme songs, require mood
    if (songType === 'from-scratch' && !mood) {
      throw new Error('Either theme or mood is required');
    }

    // Determine the appropriate mood
    const determinedMood = this.determineMood({
      songType,
      presetType,
      mood
    });

    console.log('Creating song record:', {
      name,
      theme,
      mood: determinedMood,
      voice_type: isInstrumental ? null : voice,
      tempo,
      song_type: songType,
      preset_type: presetType || null,
      is_instrumental: isInstrumental || false,
      user_lyric_input: userInput || null,
      userInput_raw: userInput,
    });

    // Create initial song record
    const { data: dbSong, error: createError } = await supabase
      .from('songs')
      .insert([{
        name,
        theme,
        mood: determinedMood || undefined,
        voice_type: isInstrumental ? null : voice,
        tempo,
        song_type: songType,
        lyrics: undefined,
        user_lyric_input: userInput || undefined,
        preset_type: presetType || undefined,
        is_instrumental: isInstrumental || false,
        user_id: userId,
        retryable: false, // Only set to true when an error occurs
      }])
      .select()
      .single();

    if (createError) {
      console.error('Failed to create song record:', {
        error: createError,
        params: {
          name,
          theme,
          mood: determinedMood,
          songType,
          hasUserInput: !!userInput
        }
      });
      throw createError;
    }

    console.log('Created song record:', {
      id: dbSong.id,
      name: dbSong.name,
      songType,
      hasUserInput: !!userInput
    });

    // Start generation
    let taskId;
    try {
      taskId = await this.startSongGeneration(dbSong as DatabaseSong, babyName);
    } catch (error) {
      console.error('Failed to start song generation:', error);
      throw error;
    }

    // Convert database song to Song interface
    const song = mapDatabaseSongToSong(dbSong as DatabaseSong);
    
    return {
      ...song,
      task_id: taskId
    };
  }

  static async regeneratePresetSongs(userId: string, babyName: string, isSilent: boolean = false) {
    if (!isSilent) {
      console.log('Starting preset song regeneration:', { userId, babyName });
    }

    try {
      // Delete existing preset songs first
      const { error: deleteError } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', userId)
        .or('name.ilike.%playtime%,name.ilike.%mealtime%,name.ilike.%bedtime%,name.ilike.%potty%');

      if (deleteError) throw deleteError;

      // Create new preset songs in parallel
      const presetPromises = Object.entries(PRESET_CONFIGS).map(([type, config]) => 
        this.createSong({
          userId,
          name: config.title(babyName),
          babyName,
          songParams: {
            mood: config.mood,
            songType: 'preset',
            preset_type: type as PresetType
          }
        })
      );

      await Promise.all(presetPromises);
      
      if (!isSilent) {
        console.log('Preset song regeneration completed successfully');
      }
    } catch (error) {
      if (!isSilent) {
        console.error('Failed to regenerate preset songs:', error);
      }
      // Don't throw - let the error be handled by the UI layer if needed
    }
  }

  /**
   * Generates preset songs for a user during the sign-up process
   * @param babyName The baby's name to use in song generation
   * @param email The email to use for profile creation
   * @returns The user ID
   */
  static async generatePresetSongsForNewUser(babyName: string, email: string): Promise<string> {
    console.log('Starting preset song generation for new user:', { babyName, email });
    
    // Generate a UUID for the user
    let userId;
    try {
      userId = crypto.randomUUID();
    } catch (error) {
      console.error('crypto.randomUUID() not available, using fallback:', error);
      userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    console.log(`Generated user ID: ${userId}`);
    
    try {
      // First check if a profile with this email already exists
      const { data: existingProfile, error: queryError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (queryError) {
        console.error('Error checking for existing profile:', queryError);
      } else if (existingProfile) {
        console.log(`Found existing profile with ID ${existingProfile.id} for email ${email}`);
        return existingProfile.id;
      }
      
      // Create a simple profile with just name and email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: userId,
          baby_name: babyName,
          email: email,
          created_at: new Date().toISOString(),
          preset_songs_generated: false,
          preferred_language: DEFAULT_LANGUAGE
        }])
        .select('*')
        .single();

      if (profileError) {
        // If it's a duplicate key error, try to fetch the existing profile
        if (profileError.code === '23505') {
          console.log('Duplicate key error, trying to fetch existing profile');
          const { data: retryProfile, error: retryError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();
            
          if (retryError) {
            console.error('Error fetching existing profile on retry:', retryError);
            throw new Error(`Failed to fetch existing profile: ${retryError.message}`);
          }
          
          if (retryProfile) {
            console.log(`Found existing profile on retry with ID ${retryProfile.id}`);
            return retryProfile.id;
          }
        }
        
        console.error('Failed to create profile:', profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }
      
      console.log('Successfully created profile:', profile);
      
      // Start generating preset songs in the background
      this.startPresetSongGeneration(userId, babyName);
      
      return userId;
    } catch (error) {
      console.error('Error in generatePresetSongsForNewUser:', error);
      throw error;
    }
  }
  
  /**
   * Starts generating preset songs in the background
   * This is separated from the profile creation to keep the code clean
   * @param userId The user ID to associate the songs with
   * @param babyName The baby's name to use in song generation
   */
  private static startPresetSongGeneration(userId: string, babyName: string): void {
    // Small delay to ensure profile is fully created before starting song generation
    setTimeout(() => {
      // Generate each preset song type
      Object.entries(PRESET_CONFIGS).forEach(([type, config]) => {
        this.createSong({
          userId,
          name: config.title(babyName),
          babyName,
          songParams: {
            mood: config.mood,
            songType: 'preset',
            preset_type: type as PresetType,
          }
        }).then(() => {
          console.log(`Successfully created preset song ${type} for user ${userId}`);
        }).catch(error => {
          console.error(`Failed to create preset song ${type} for user ${userId}:`, {
            message: error.message,
            code: error.code
          });
          // Don't throw - we want to continue with sign-up even if song generation fails
        });
      });
    }, 100);
  }

  /**
   * Updates a song's basic state fields to reset it
   * @param songId The ID of the song to reset
   * @param customFields Optional custom fields to update along with the reset
   * @returns The updated database song
   */
  static async resetSongState(songId: string, customFields: Partial<DatabaseSong> = {}): Promise<DatabaseSong> {
    console.log(`Resetting song state for song ${songId}`);
    
    try {
      // Standard reset fields that clear the song state
      const resetFields = {
        error: null,
        retryable: false,
        audio_url: null,
        task_id: null // Clear this so we don't think it's still generating
      };

      // Combine reset fields with any custom fields
      const updateFields = {
        ...resetFields,
        ...customFields
      };

      // Update the song with reset fields
      const { data: updatedSong, error: updateError } = await supabase
        .from('songs')
        .update(updateFields)
        .eq('id', songId)
        .select('*')
        .single();
        
      if (updateError) {
        console.error('Error resetting song state:', updateError);
        throw new Error('Failed to reset song state');
      }

      if (!updatedSong) {
        throw new Error('Song not found after reset');
      }
      
      return updatedSong as DatabaseSong;
    } catch (error) {
      console.error(`Error in resetSongState for song ${songId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes all variations associated with a song
   * @param songId The ID of the song to clear variations for
   */
  static async clearSongVariations(songId: string): Promise<void> {
    console.log(`Clearing variations for song ${songId}`);
    
    try {
      // Check if variations exist
      const { data: variations, error: variationsError } = await supabase
        .from('song_variations')
        .select('id')
        .eq('song_id', songId);
        
      if (variationsError) {
        console.error(`Error checking variations for song ${songId}:`, variationsError);
        throw new Error('Failed to check for existing variations');
      }

      // If variations exist, delete them
      if (variations && variations.length > 0) {
        console.log(`Deleting ${variations.length} variations for song ${songId}`);
        
        const { error: deleteVariationsError } = await supabase
          .from('song_variations')
          .delete()
          .eq('song_id', songId);
        
        if (deleteVariationsError) {
          console.error(`Error deleting variations for song ${songId}:`, deleteVariationsError);
          throw new Error('Failed to delete variations');
        }
      }
    } catch (error) {
      console.error(`Error in clearSongVariations for song ${songId}:`, error);
      throw error;
    }
  }

  /**
   * Prepares a song for regeneration by resetting state and clearing variations
   * @param songId The ID of the song to prepare
   * @param customFields Optional custom fields to update
   * @returns The updated song
   */
  static async prepareForRegeneration(songId: string, customFields: Partial<DatabaseSong> = {}): Promise<DatabaseSong> {
    try {
      // First reset the song state
      const updatedSong = await this.resetSongState(songId, customFields);
      
      // Then clear any variations
      await this.clearSongVariations(songId);
      
      return updatedSong;
    } catch (error) {
      console.error(`Error preparing song ${songId} for regeneration:`, error);
      throw error;
    }
  }

  /**
   * Updates a song with a task ID for tracking the generation
   * @param songId The ID of the song to update
   * @param taskId The task ID to set
   * @returns The updated song
   */
  static async updateSongWithTaskId(songId: string, taskId: string): Promise<void> {
    console.log(`Updating song ${songId} with task ID ${taskId}`);
    
    try {
      const { error } = await supabase
        .from('songs')
        .update({ task_id: taskId })
        .eq('id', songId);
        
      if (error) {
        console.error(`Error updating song ${songId} with task ID:`, error);
        throw new Error('Failed to update song with task ID');
      }
    } catch (error) {
      console.error(`Error in updateSongWithTaskId for song ${songId}:`, error);
      throw error;
    }
  }
}
````

## File: src/services/songStateService.ts
````typescript
import { supabase } from '../lib/supabase';
import type { PresetType, Song } from '../types';

/**
 * Enum representing the possible states of a song
 */
export enum SongState {
  GENERATING = 'generating',
  READY = 'ready',
  FAILED = 'failed',
  INITIAL = 'initial'
}

/**
 * SongStateService handles all logic related to determining a song's state
 * for consistent UI rendering and business logic throughout the application.
 */
export class SongStateService {
  /**
   * Gets the current state of a song
   */
  static getSongState(song: Song | undefined): SongState {
    if (!song) return SongState.INITIAL;
    
    if (song.audio_url) return SongState.READY;
    if (song.error || song.retryable) return SongState.FAILED;
    if (song.task_id) return SongState.GENERATING;
    
    return SongState.INITIAL;
  }

  /**
   * Determines if a song is currently generating
   */
  static isGenerating(song: Song | undefined): boolean {
    if (!song) return false;
    
    // If the song has an error or is retryable, it's not generating
    if (song.error || song.retryable) return false;
    
    // If the song has an audio URL, it's not generating
    if (song.audio_url) return false;
    
    // A song is generating if it has a task_id, no audio_url, and no error
    return !!song.task_id;
  }

  /**
   * Determines if a song is in the queue
   * This is used for tracking tasks in the subscription handler
   */
  static isInQueue(song: Song | undefined): boolean {
    if (!song) return false;
    
    // A song is in the queue if it has a task_id, no audio_url, and no error
    return !!song.task_id && !song.audio_url && !song.error;
  }

  /**
   * Determines if a song is ready to play
   */
  static isReady(song: Song | undefined): boolean {
    return !!song?.audio_url;
  }

  /**
   * Determines if a song has failed generation
   */
  static hasFailed(song: Song | undefined): boolean {
    if (!song) return false;
    return !!song.error || !!song.retryable;
  }

  /**
   * Determines if a song is completed (has an audio URL)
   */
  static isCompleted(song: Song | undefined): boolean {
    return this.isReady(song);
  }

  /**
   * Determines if a song can be retried
   */
  static canRetry(song: Song | undefined): boolean {
    if (!song) return false;
    return this.hasFailed(song);
  }

  /**
   * Determines if a song is a preset song
   */
  static isPresetSong(song: Song | undefined): boolean {
    if (!song) return false;
    return song.song_type === 'preset' && !!song.preset_type;
  }

  /**
   * Gets the most appropriate song for a preset type from a collection of songs
   */
  static getSongForPresetType(songs: Song[], presetType: PresetType): Song | undefined {
    // Get all songs for this preset type
    const presetSongs = songs.filter(song => 
      song.preset_type === presetType && song.song_type === 'preset'
    );
    
    if (presetSongs.length === 0) return undefined;
    
    // Return the most recently created song for this preset type
    return presetSongs.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    })[0];
  }

  /**
   * Determines if any song with a given preset type exists and is generating
   */
  static isPresetTypeGenerating(
    songs: Song[],
    presetType: PresetType
  ): boolean {
    const song = this.getSongForPresetType(songs, presetType);
    return song ? this.isGenerating(song) : false;
  }

  /**
   * Determines if a song has variations
   */
  static hasVariations(song: Song | undefined): boolean {
    if (!song) return false;
    return !!song.variations && song.variations.length > 0;
  }

  /**
   * Gets the number of variations a song has
   */
  static getVariationCount(song: Song | undefined): number {
    if (!song?.variations) return 0;
    return song.variations.length;
  }

  /**
   * Gets an appropriate status label for display
   */
  static getStatusLabel(
    song: Song | undefined, 
    isGenerating: boolean
  ): string {
    if (!song) {
      return isGenerating ? 'Generating...' : 'Generate';
    }
    
    if (isGenerating) return 'Generating...';
    
    if (song.error) return 'Retry';
    if (song.audio_url) return 'Play';
    
    return 'Generate';
  }

  /**
   * Gets UI metadata for preset type state
   */
  static getPresetTypeStateMetadata(
    songs: Song[],
    presetType: PresetType
  ): {
    isGenerating: boolean;
    hasFailed: boolean;
    canRetry: boolean;
    isReady: boolean;
    hasVariations: boolean;
    variationCount: number;
    statusLabel: string;
    song: Song | undefined;
    isCompleted: boolean;
    state: SongState;
  } {
    // Find the most relevant song for this preset type
    const song = this.getSongForPresetType(songs, presetType);
    
    // Determine states
    const isGenerating = song ? this.isGenerating(song) : false;
    const hasFailed = this.hasFailed(song);
    const canRetry = this.canRetry(song);
    const isReady = this.isReady(song);
    const hasVariations = this.hasVariations(song);
    const variationCount = this.getVariationCount(song);
    const statusLabel = this.getStatusLabel(song, isGenerating);
    const isCompleted = this.isCompleted(song);
    const state = this.getSongState(song);

    return {
      isGenerating,
      hasFailed,
      canRetry,
      isReady,
      hasVariations,
      variationCount,
      statusLabel,
      song,
      isCompleted,
      state
    };
  }

  /**
   * Updates a song with an error message
   */
  static async updateSongWithError(songId: string, errorMessage: string): Promise<void> {
    if (!songId) return;
    
    try {
      const { error } = await supabase
        .from('songs')
        .update({ 
          error: errorMessage,
          retryable: true,
          task_id: null // Clear task_id to prevent stuck generation
        })
        .eq('id', songId);
        
      if (error) {
        console.error(`Failed to update song ${songId} with error:`, error);
      }
    } catch (err) {
      console.error(`Error updating song ${songId} with error:`, err);
    }
  }
}
````

## File: src/store/song/handlers/songSubscriptionHandlers.ts
````typescript
// @breadcrumbs
// - src/store/song/handlers/songSubscriptionHandlers.ts: Handlers for song subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import type { Song } from '../../../types';
import type { SongState } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SongStateService, SongState as SongStateEnum } from '../../../services/songStateService';

interface SongPayload {
  id: string;
  name: string;
  song_type: string;
  error?: string | null;
  audio_url?: string | null;
  task_id?: string;
  user_id: string;
}

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

/**
 * Handles song updates from the Supabase realtime subscription
 * This is the central handler for all song state changes
 */
export async function handleSongUpdate(
  newSong: SongPayload,
  oldSong: SongPayload,
  set: SetState,
  get: GetState,
  supabase: SupabaseClient
) {
  // Detect significant state changes
  const hasNewError = !oldSong.error && newSong.error;
  const hasNewAudio = oldSong.audio_url !== newSong.audio_url && !!newSong.audio_url;
  const hasTaskIdChange = oldSong.task_id !== newSong.task_id;
  const hasTaskIdCleared = oldSong.task_id && !newSong.task_id;
  
  // Log task_id changes specifically
  if (hasTaskIdChange) {
    console.log(`Task ID change for song ${newSong.id}:`, {
      before: oldSong.task_id || 'none',
      after: newSong.task_id || 'none',
      cleared: hasTaskIdCleared,
      hasAudio: !!newSong.audio_url
    });
  }
  
  // More detailed debugging for audio_url changes
  if (hasNewAudio) {
    console.log('AUDIO URL CHANGE DETECTED:', {
      songId: newSong.id,
      songName: newSong.name,
      oldUrl: oldSong.audio_url || 'none',
      newUrl: newSong.audio_url,
      taskId: {
        before: oldSong.task_id || 'none',
        after: newSong.task_id || 'none',
        cleared: hasTaskIdCleared
      },
      preset_type: (newSong as SongPayload & { preset_type?: string }).preset_type || 'n/a'
    });
  }

  // Track task IDs for processing state
  if (newSong.task_id && !get().processingTaskIds.has(newSong.task_id)) {
    set({
      processingTaskIds: new Set([...get().processingTaskIds, newSong.task_id])
    });
  }

  // Handle songs in queue
  if (SongStateService.isInQueue(newSong as unknown as Song) && newSong.task_id && !get().queuedTaskIds.has(newSong.task_id)) {
    set({
      queuedTaskIds: new Set([...get().queuedTaskIds, newSong.task_id])
    });
  }

  // Fetch the complete song with variations
  const { data: updatedSong, error: fetchError } = await supabase
    .from('songs')
    .select('*, variations:song_variations(*)')
    .eq('id', oldSong.id)
    .single();
  
  // Handle case where song might have been deleted
  if (fetchError || !updatedSong) {
    console.log(`Song ${oldSong.id} not found in database, cleaning up UI state`);
    
    // Clean up UI state for this song
    const newGenerating = new Set(get().generatingSongs);
    newGenerating.delete(oldSong.id);
    
    // Clean up task IDs if applicable
    const newProcessingTaskIds = new Set(get().processingTaskIds);
    if (oldSong.task_id) {
      newProcessingTaskIds.delete(oldSong.task_id);
    }
    
    // Clean up retrying state if applicable
    const newRetrying = new Set(get().retryingSongs);
    newRetrying.delete(oldSong.id);
    
    // Remove song from songs array
    set({
      songs: get().songs.filter(song => song.id !== oldSong.id),
      generatingSongs: newGenerating,
      processingTaskIds: newProcessingTaskIds,
      retryingSongs: newRetrying
    });
    
    return;
  }

  // Get the song's current state using the enhanced SongStateService
  const songState = SongStateService.getSongState(updatedSong as Song);
  
  // Always clear retrying state if song has a new audio_url or error
  if (hasNewAudio || hasNewError) {
    const newRetrying = new Set(get().retryingSongs);
    newRetrying.delete(updatedSong.id);
    set({ retryingSongs: newRetrying });
  }
  
  // Handle state-specific updates
  switch (songState) {
    case SongStateEnum.READY:
      // Song is ready to play (has audio_url)
      if (hasNewAudio) {
        console.log(`Song ${updatedSong.id} is now ready to play with audio_url: ${updatedSong.audio_url}`);
        
        // Replace the entire song object instead of just updating audio_url
        // This ensures all fields from the database are applied (especially task_id)
        set({
          songs: get().songs.map((song) =>
            song.id === updatedSong.id ? updatedSong as Song : song
          )
        });
        
        // Log the complete updated song state for debugging
        console.log(`Updated song state in store:`, {
          id: updatedSong.id,
          hasAudioUrl: !!updatedSong.audio_url,
          hasTaskId: !!updatedSong.task_id,
          hasError: !!updatedSong.error
        });
      }
      
      // Clear all processing states
      updateSongProcessingState(updatedSong.id, updatedSong.task_id, false, false, set, get);
      break;
      
    case SongStateEnum.FAILED:
      // Song has failed (has error)
      if (hasNewError) {
        console.log(`Song ${updatedSong.id} has failed with error: ${updatedSong.error}`);
      }
      
      // Clear generating state but keep retryable if applicable
      updateSongProcessingState(updatedSong.id, updatedSong.task_id, false, !!updatedSong.retryable, set, get);
      
      // Set error state
      set({ error: updatedSong.error || null });
      break;
      
    case SongStateEnum.GENERATING:
      // Song is generating (has task_id)
      if (hasTaskIdChange && updatedSong.task_id) {
        console.log(`Song ${updatedSong.id} is now generating with task_id: ${updatedSong.task_id}`);
        
        // Add to generating songs if not already there
        if (!get().generatingSongs.has(updatedSong.id)) {
          set({
            generatingSongs: new Set([...get().generatingSongs, updatedSong.id])
          });
        }
      }
      break;
      
    default:
      // Initial or unknown state
      // Clear generating state to be safe
      updateSongProcessingState(updatedSong.id, updatedSong.task_id, false, false, set, get);
      break;
  }

  // Update the song in the songs array
  set({
    songs: get().songs.map((song) =>
      song.id === oldSong.id ? updatedSong as Song : song
    )
  });
}

/**
 * Helper function to update a song's processing state
 */
function updateSongProcessingState(
  songId: string,
  taskId: string | null | undefined,
  isGenerating: boolean,
  isRetrying: boolean,
  set: SetState,
  get: GetState
): void {
  // Update generating state
  const newGenerating = new Set(get().generatingSongs);
  if (isGenerating) {
    newGenerating.add(songId);
  } else {
    newGenerating.delete(songId);
  }
  
  // Update retrying state
  const newRetrying = new Set(get().retryingSongs);
  if (isRetrying) {
    newRetrying.add(songId);
  } else {
    newRetrying.delete(songId);
  }
  
  // Update task processing state
  const newProcessingTaskIds = new Set(get().processingTaskIds);
  if (taskId) {
    if (isGenerating) {
      newProcessingTaskIds.add(taskId);
    } else {
      newProcessingTaskIds.delete(taskId);
    }
  }
  
  // Update all states at once
  set({
    generatingSongs: newGenerating,
    retryingSongs: newRetrying,
    processingTaskIds: newProcessingTaskIds
  });
}
````

## File: src/store/song/handlers/variationSubscriptionHandlers.ts
````typescript
// @breadcrumbs
// - src/store/song/handlers/variationSubscriptionHandlers.ts: Handlers for variation subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import type { Song } from '../../../types';
import type { SongState } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';

interface VariationPayload {
  song_id: string;
}

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

export async function handleVariationInsert(
  variation: VariationPayload,
  set: SetState,
  get: GetState,
  supabase: SupabaseClient
) {
  // Reload the entire song to get updated variations
  const { data: updatedSong } = await supabase
    .from('songs')
    .select('*, variations:song_variations(*)')
    .eq('id', variation.song_id)
    .single();
    
  if (!updatedSong) {
    return;
  }

  set({
    songs: get().songs.map((song) => {
      if (song.id === variation.song_id) {
        return updatedSong as Song;
      }
      return song;
    }),
  });
}
````

## File: src/store/song/actions.ts
````typescript
// @breadcrumbs
// - src/store/song/actions.ts: Actions for the song store
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/supabase.ts (database)

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import { SongService } from '../../services/songService';
import { SongStateService } from '../../services/songStateService';
import type { Song, PresetType } from '../../types';
import type { SongState, CreateSongParams } from './types';
import { getPresetType as _getPresetType } from '../../utils/presetUtils';
import { mapDatabaseSongToSong } from '../../services/songService';

// Create a typed setter and getter for the zustand store
type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

export const createSongActions = (set: SetState, get: GetState) => ({
  loadSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: songsData, error } = await supabase
        .from('songs')
        .select('*, variations:song_variations(*)')
        .eq('user_id', useAuthStore.getState().user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Clear any generating songs that don't exist in the database
      const newProcessingTaskIds = new Set([...get().processingTaskIds]);
      const newQueuedTaskIds = new Set([...get().queuedTaskIds]);
      
      // Remove task IDs associated with songs that don't exist
      songsData?.forEach(song => {
        if (song.task_id) {
          // Keep task IDs for existing songs
          if (!newProcessingTaskIds.has(song.task_id)) {
            newProcessingTaskIds.add(song.task_id);
          }
        }
      });
      
      // Filter out task IDs that aren't associated with any song
      for (const taskId of newProcessingTaskIds) {
        const songExists = songsData?.some(song => song.task_id === taskId);
        if (!songExists) {
          newProcessingTaskIds.delete(taskId);
          newQueuedTaskIds.delete(taskId);
        }
      }

      // Update generating songs based on SongStateService
      const updatedGeneratingSongs = new Set<string>();
      songsData?.forEach(song => {
        if (SongStateService.isGenerating(song as Song)) {
          updatedGeneratingSongs.add(song.id);
        }
      });

      console.log('State reconciliation:', {
        dbSongs: songsData?.length || 0,
        previousGenerating: get().generatingSongs.size,
        newGenerating: updatedGeneratingSongs.size,
        previousTaskIds: get().processingTaskIds.size,
        newTaskIds: newProcessingTaskIds.size
      });
      
      set({ 
        songs: songsData as Song[] || [],
        generatingSongs: updatedGeneratingSongs,
        processingTaskIds: newProcessingTaskIds,
        queuedTaskIds: newQueuedTaskIds
      });
    } catch (error) {
      console.error('Error loading songs:', error);
      set({ error: 'Failed to load your songs.' });
    } finally {
      set({ isLoading: false });
    }
  },

  createSong: async ({ name, mood, theme, userInput, tempo, isInstrumental, voice, songType, preset_type }: CreateSongParams): Promise<Song> => {
    console.log('songStore.createSong called with:', {
      name,
      mood,
      theme,
      userInput: userInput ? `"${userInput}"` : 'not provided',
      songType,
      preset_type,
      isInstrumental,
      voice
    });

    const currentPresetType: PresetType | null = preset_type || null;
    let createdSong: Song | undefined;
    
    try {
      const user = useAuthStore.getState().user;
      const profile = useAuthStore.getState().profile;

      if (!user || !profile) {
        throw new Error('User must be logged in to create songs');
      }

      if (!profile.babyName) {
        throw new Error('Baby name is required to create songs');
      }

      // If this is a preset song, check if one is already generating
      if (currentPresetType && songType === 'preset') {
        console.log('Processing preset song of type:', currentPresetType);
        
        // Find all songs of this preset type
        const existingSongs = get().songs.filter(s => 
          s.song_type === 'preset' && s.preset_type === currentPresetType
        );
        
        console.log(`Found ${existingSongs.length} existing songs for preset type ${currentPresetType}`);
        
        // Check if any are currently generating
        // Use SongStateService for consistent state management
        const isGenerating = existingSongs.some(song => 
          SongStateService.isGenerating(song)
        );
        
        if (isGenerating) {
          console.log(`A song of type ${currentPresetType} is already generating, skipping`);
          throw new Error(`${currentPresetType} song is already being generated`);
        }

        // Instead of deleting, update the existing song if it exists
        if (existingSongs.length > 0) {
          // Get the most recent song for this preset type
          const existingSong = existingSongs.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          })[0];

          console.log(`Updating existing song ${existingSong.id} (${existingSong.name}) for preset type ${currentPresetType}`);
          
          try {
            // Create database song format with the correct fields for updates
            const customFields = {
              name: name || existingSong.name,
              theme: theme || existingSong.theme,
              mood: mood || existingSong.mood
            };
            
            // 1. Reset the song state and clear variations using SongService
            const resetSong = await SongService.prepareForRegeneration(existingSong.id, customFields);
            
            // 2. Create database song format with the correct fields for generation
            const dbSongForGeneration = {
              ...resetSong,
              tempo: tempo || (resetSong as any).tempo,
              is_instrumental: isInstrumental !== undefined ? isInstrumental : (resetSong as any).is_instrumental,
              voice_type: voice || (resetSong as any).voice_type,
              user_lyric_input: userInput || (resetSong as any).user_lyric_input
            };
            
            // 3. Start generation
            const taskId = await SongService.startSongGeneration(dbSongForGeneration as any, profile.babyName);
            
            // 4. Update the task ID
            await SongService.updateSongWithTaskId(existingSong.id, taskId);
            
            // 5. Convert to Song format
            const updatedSong = {
              ...mapDatabaseSongToSong(resetSong),
              task_id: taskId
            };
            
            // 6. Update UI state
            set({
              songs: get().songs.map(s => s.id === existingSong.id ? updatedSong : s),
              generatingSongs: new Set([...get().generatingSongs, existingSong.id])
            });
            
            return updatedSong;
          } catch (error) {
            console.error(`Error updating preset song ${existingSong.id}:`, error);
            throw new Error(`Failed to update preset song: ${error}`);
          }
        }
      }

      // Create the song using SongService - add a log to mark this transition clearly
      console.log(`Proceeding to create new song for ${currentPresetType || 'custom theme'}`);
      createdSong = await SongService.createSong({
        userId: user.id,
        name,
        babyName: profile.babyName,
        songParams: {
          theme,
          mood,
          tempo,
          isInstrumental,
          songType,
          voice,
          userInput,
          preset_type: currentPresetType || undefined
        }
      });

      if (!createdSong) {
        throw new Error('Failed to create song record');
      }

      console.log('Song created successfully:', {
        id: createdSong.id,
        name: createdSong.name,
        preset_type: createdSong.preset_type
      });

      // Update UI state
      set({
        songs: [createdSong, ...get().songs],
        generatingSongs: new Set([...get().generatingSongs, createdSong.id])
      });

      return createdSong;
    } catch (error) {
      // Update song with error state if it was created
      if (createdSong?.id) {
        try {
          // First, check if the song still exists in the database
          const { data: songExists, error: checkError } = await supabase
            .from('songs')
            .select('id')
            .eq('id', createdSong!.id)
            .single();
            
          if (checkError || !songExists) {
            console.log(`Song ${createdSong!.id} no longer exists in database, cleaning up UI state only`);
            // Song doesn't exist in DB, just clean up UI state
            set({
              songs: get().songs.filter(song => song.id !== createdSong!.id),
              generatingSongs: new Set([...get().generatingSongs].filter(id => id !== createdSong!.id))
            });
          } else {
            // Song exists, update it with error
            await supabase
              .from('songs')
              .update({ 
                error: 'Failed to start music generation',
                task_id: null // Clear task ID to prevent stuck state
              })
              .eq('id', createdSong!.id);

            set({
              generatingSongs: new Set([...get().generatingSongs].filter(id => id !== createdSong!.id))
            });
          }
        } catch (updateError) {
          console.error('Failed to update song error state:', updateError);
          // Still clean up UI state even if update fails
          set({
            generatingSongs: new Set([...get().generatingSongs].filter(id => id !== createdSong!.id))
          });
        }
      }

      throw error instanceof Error ? error : new Error('Failed to create song');
    }
  },

  deleteAllSongs: async () => {
    try {
      set({ isDeleting: true, error: null });
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('User must be logged in to delete songs');
      }
      
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      set({ 
        songs: [], 
        generatingSongs: new Set(),
        processingTaskIds: new Set(),
        queuedTaskIds: new Set()
      });
    } catch (error) {
      console.error('Error deleting songs:', error);
      set({ error: 'Failed to delete your songs.' });
    } finally {
      set({ isDeleting: false });
    }
  },

  retrySong: async (songId: string) => {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    const userId = user.id;
    const profile = useAuthStore.getState().profile;
    const babyName = profile?.babyName || 'Baby';
    
    try {
      set({ error: null });
      
      // Mark the song as retrying
      const songStore = get();
      songStore.setRetrying(songId, true);
      
      // Call the SongService to retry the song generation
      await SongService.retrySongGeneration(songId, userId, babyName);
      
      // The song update will be handled by the subscription handler
    } catch (error) {
      console.error('Failed to retry song generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to retry song generation';
      set({ error: errorMessage });
      
      // Clear the retrying state
      const songStore = get();
      songStore.setRetrying(songId, false);
    }
  },

  resetGeneratingState: async () => {
    console.log('Resetting all generating state');
    
    try {
      // Get all songs that are currently marked as generating in the UI
      const generatingSongIds = [...get().generatingSongs];
      
      if (generatingSongIds.length > 0) {
        console.log(`Clearing generating state for ${generatingSongIds.length} songs`);
        
        // Update any songs in the database that still have task IDs
        const { data: songsWithTaskIds, error: fetchError } = await supabase
          .from('songs')
          .select('id, task_id')
          .in('id', generatingSongIds)
          .not('task_id', 'is', null);
          
        if (!fetchError && songsWithTaskIds && songsWithTaskIds.length > 0) {
          console.log(`Found ${songsWithTaskIds.length} songs with task IDs in database, clearing them`);
          
          // Update songs to clear task IDs and mark as failed
          const { error: updateError } = await supabase
            .from('songs')
            .update({ 
              task_id: null,
              error: 'Generation was interrupted or failed to complete',
              retryable: true
            })
            .in('id', songsWithTaskIds.map(song => song.id));
            
          if (updateError) {
            console.error('Failed to update songs in database:', updateError);
          }
        }
      }
      
      // Reset all UI state related to generating songs
      set({
        generatingSongs: new Set(),
        processingTaskIds: new Set(),
        queuedTaskIds: new Set()
      });
      
      console.log('Successfully reset generating state');
    } catch (error) {
      console.error('Error resetting generating state:', error);
    }
  }
});
````

## File: src/store/song/subscriptions.ts
````typescript
// @breadcrumbs
// - src/store/song/subscriptions.ts: Real-time subscriptions for song updates
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/supabase.ts (database)
// - Children:
//   - src/store/song/handlers/songSubscriptionHandlers.ts (song handlers)
//   - src/store/song/handlers/variationSubscriptionHandlers.ts (variation handlers)

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import type { SongState } from './types';
import { handleSongUpdate } from './handlers/songSubscriptionHandlers';
import { handleVariationInsert } from './handlers/variationSubscriptionHandlers';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

interface SongPayload {
  id: string;
  name: string;
  song_type: string;
  error?: string | null;
  audio_url?: string | null;
  task_id?: string;
  status?: string;
  user_id: string;
}

interface VariationPayload {
  song_id: string;
}

// Update the type with the correct constraint
type RealtimePayload<T extends object> = RealtimePostgresChangesPayload<T>;

export const createSongSubscriptions = (set: SetState, get: GetState) => {
  const setupSubscription = () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    supabase.getChannels().forEach(channel => channel.unsubscribe());
    
    // Subscribe to both songs and variations changes
    const songsSubscription = supabase
      .channel('songs-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          // Use type assertion to ensure TypeScript knows the structure
          const typedPayload = payload as RealtimePayload<SongPayload>;
          const { new: newSong, old: oldSong } = typedPayload;
          
          // Add null checks and type assertions
          if (!oldSong || !newSong || !('id' in oldSong) || !('id' in newSong)) {
            return;
          }
          
          // Remove the presetSongsProcessing parameter or update the handler function
          await handleSongUpdate(
            newSong as SongPayload,
            oldSong as SongPayload,
            set,
            get,
            supabase
          );
        }
      )
      .subscribe();
      
    const variationsSubscription = supabase
      .channel('variations-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public', 
          table: 'song_variations'
        },
        async (payload) => {
          // Use type assertion to ensure TypeScript knows the structure
          const typedPayload = payload as RealtimePayload<VariationPayload>;
          const { new: variation } = typedPayload;
          
          // Add null check and type assertion
          if (!variation || !('song_id' in variation)) {
            return;
          }
          
          await handleVariationInsert(
            variation as VariationPayload,
            set,
            get,
            supabase
          );
        }
      )
      .subscribe();

    // Clean up subscription when user changes
    return () => {
      songsSubscription.unsubscribe();
      variationsSubscription.unsubscribe();
    };
  };

  return { setupSubscription };
};
````

## File: src/store/song/types.ts
````typescript
// @breadcrumbs
// - src/store/song/types.ts: Types for song store state and actions
// - Parent: src/store/songStore.ts
// - Related: src/types/index.ts (base types)

import type { Song, MusicMood, ThemeType, PresetType, Tempo, VoiceType } from '../../types';

export type StateUpdater = (state: SongState) => Partial<SongState>;

export interface SongState {
  // State
  songs: Song[];
  isLoading: boolean;
  generatingSongs: Set<string>;
  retryingSongs: Set<string>;
  processingTaskIds: Set<string>;
  queuedTaskIds: Set<string>; // Tasks that are in the queue (have task_id, no audio_url, no error)
  isDeleting: boolean;
  error: string | null;

  // Actions
  setState: (updater: StateUpdater) => void;
  clearGeneratingState: (songId: string) => void;
  setRetrying: (songId: string, isRetrying: boolean) => void;
  loadSongs: () => Promise<void>;
  createSong: (params: CreateSongParams) => Promise<Song>;
  deleteAllSongs: () => Promise<void>;
  setupSubscription: () => void;
  resetGeneratingState: () => Promise<void>;
}

export interface CreateSongParams {
  name: string;
  // For themed songs (songType === 'theme' | 'theme-with-input'):
  // - mood and tempo are optional as they are determined by the API based on the theme
  // For custom songs (songType === 'from-scratch'):
  // - mood and tempo are required to specify the exact characteristics
  mood?: MusicMood;
  theme?: ThemeType;
  userInput?: string; // User's input text to help generate lyrics
  tempo?: Tempo;
  isInstrumental?: boolean;
  voice?: VoiceType;
  songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  preset_type?: PresetType; // Type of preset song when songType is 'preset'
  lyrics?: string; // The lyrics to use for the song
  gender?: string; // Baby's gender for personalized lyrics
}
````

## File: src/store/appStore.ts
````typescript
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Song, ThemeType, UserProfile, PresetType, Language } from '../types';
import type { User } from '@supabase/supabase-js';
import { SongService } from '../services/songService';
import { ProfileService } from '../services/profileService';

// Types
type StateUpdater = (state: AppState) => Partial<AppState>;
// We define AppStore type for documentation purposes, but it's not used directly in this file

interface AppState {
  // Core state
  user: User | null;
  profile: UserProfile | null;
  songs: Song[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  generatingSongs: Set<string>;
  presetSongTypes: Set<PresetType>;
  
  // Actions
  setState: (updater: StateUpdater) => void;
  clearError: () => void;
  
  // Auth
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, babyName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  
  // Songs
  createSong: (params: {
    name: string;
    theme: ThemeType;
    lyrics?: string;
  }) => Promise<Song | null>;
  deleteAllSongs: () => Promise<void>;
  
  // Profile
  updateProfile: (params: { babyName: string; preferredLanguage?: Language }) => Promise<void>;
}

export const useAppStore = create<AppState>((
  set: (partial: Partial<AppState> | ((state: AppState) => Partial<AppState>)) => void,
  get: () => AppState
) => ({
  // Initial state
  user: null,
  profile: null,
  songs: [],
  isLoading: false,
  error: null,
  generatingSongs: new Set<string>(),
  presetSongTypes: new Set<PresetType>(),

  // State helpers
  setState: (updater: StateUpdater) => set(updater),
  clearError: () => set({ error: null }),

  // Auth actions
  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const profile = await ProfileService.updateProfile({
        userId: data.user.id,
        babyName: ''
      });
      const songs = await SongService.loadUserSongs(data.user.id);
        
      set({ 
        user: data.user,
        profile,
        songs,
        error: null 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Sign in failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string, babyName: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const profile = await ProfileService.updateProfile({
        userId: data.user!.id,
        babyName
      });

      await SongService.regeneratePresetSongs(data.user!.id, babyName);

      set({ 
        user: data.user,
        profile,
        error: null 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Sign up failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ 
      user: null, 
      profile: null, 
      songs: [],
      generatingSongs: new Set(),
      presetSongTypes: new Set()
    });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ user: null, profile: null });
        return;
      }

      const profile = await ProfileService.updateProfile({
        userId: session.user.id,
        babyName: ''
      });
      const songs = await SongService.loadUserSongs(session.user.id);

      set({ 
        user: session.user,
        profile,
        songs
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load user' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Song actions
  createSong: async ({ name, theme }) => {
    const { user, profile } = get();
    
    if (!user || !profile) {
      set({ error: 'You must be logged in to create a song' });
      return null;
    }

    try {
      const song = await SongService.createSong({
        userId: user.id,
        name,
        babyName: profile.babyName,
        songParams: {
          theme,
          songType: 'theme'
        }
      });

      set(state => ({
        songs: [song, ...state.songs],
        generatingSongs: new Set([...state.generatingSongs, song.id])
      }));

      return song;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create song' });
      return null;
    }
  },

  deleteAllSongs: async () => {
    const { user } = get();
    if (!user) throw new Error('Must be signed in');

    try {
      await SongService.deleteUserSongs(user.id);
      set({ songs: [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete songs' });
    }
  },

  // Profile actions
  updateProfile: async (params: { babyName: string; preferredLanguage?: Language }) => {
    const { user } = get();
    
    if (!user) {
      set({ error: 'You must be logged in to update your profile' });
      return;
    }

    try {
      const updatedProfile = await ProfileService.updateProfile({
        userId: user.id,
        babyName: params.babyName,
        preferredLanguage: params.preferredLanguage
      });

      set({ profile: updatedProfile });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update profile' });
    }
  }
}));
````

## File: src/store/audioStore.ts
````typescript
import { create } from 'zustand';

interface AudioState {
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  currentUrl: string | null;
  stopAllAudio: () => void;
  playAudio: (url: string) => void;
  pauseAudio: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentAudio: null,
  isPlaying: false,
  currentUrl: null,

  stopAllAudio: () => {
    const { currentAudio } = get();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    set({ isPlaying: false, currentUrl: null });
  },

  playAudio: (url: string) => {
    const { currentAudio, currentUrl, stopAllAudio } = get();
    
    // If it's the same URL and audio exists, toggle play/pause
    if (url === currentUrl && currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play();
        set({ isPlaying: true });
      } else {
        currentAudio.pause();
        set({ isPlaying: false });
      }
      return;
    }

    // Stop any currently playing audio
    stopAllAudio();

    // Create and play new audio
    const audio = new Audio(url);
    audio.addEventListener('ended', () => {
      set({ isPlaying: false });
    });

    audio.play();
    set({ 
      currentAudio: audio, 
      currentUrl: url,
      isPlaying: true 
    });
  },

  pauseAudio: () => {
    const { currentAudio } = get();
    if (currentAudio) {
      currentAudio.pause();
      set({ isPlaying: false });
    }
  }
}));
````

## File: src/store/authStore.ts
````typescript
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useSongStore } from './songStore';
import { useErrorStore } from './errorStore';
import { ProfileService } from '../services/profileService';
import { SongService } from '../services/songService';
import { type User } from '@supabase/supabase-js';
import { DEFAULT_LANGUAGE } from '../types';
import type { UserProfile, Language, AgeGroup } from '../types';
import type { PresetType as _PresetType } from '../types';
import { PRESET_CONFIGS as _PRESET_CONFIGS } from '../data/lyrics';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  initialized: boolean;
  isLoading: boolean;
  
  // Add loadProfile to the interface
  loadProfile: () => Promise<void>;
  
  updateProfile: (updates: { 
    babyName: string; 
    preferredLanguage?: Language;
    birthMonth?: number;
    birthYear?: number;
    ageGroup?: AgeGroup;
    gender?: string;
  }) => Promise<UserProfile>; // Change return type to match implementation
  
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, babyName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void | (() => void)>; // Fix return type to match implementation
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  initialized: false,
  isLoading: false,
  loadProfile: async () => {
    const user = get().user;
    if (!user) return;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      await supabase.auth.signOut();
      set({ user: null, profile: null });
      return;
    }

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;
    let retryCount = 0;
    
    while (retryCount < MAX_RETRIES) {
      try {
        // Add a small delay before retries (but not on first attempt)
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
        }

        // Verify session is still valid before each attempt
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          throw new Error('Session expired during profile load');
        }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          is_premium,
          daily_generations,
          last_generation_date,
          baby_name,
          preferred_language,
          created_at
        `)
        .eq('id', user.id)
        .single();
      
      if (error) {
        // If the profile doesn't exist, force logout
        if (error.code === 'PGRST116' || error.message.includes('contains 0 rows')) {
          await supabase.auth.signOut();
          set({ 
            user: null, 
            profile: null
          });
          return;
        }
        throw error;
      }

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          isPremium: profile.is_premium,
          dailyGenerations: profile.daily_generations,
          lastGenerationDate: profile.last_generation_date,
          babyName: profile.baby_name,
          preferredLanguage: profile.preferred_language || DEFAULT_LANGUAGE
        };
      
        set({ profile: userProfile });
        return;
      } else {
        throw new Error('No profile data received');
      }
      } catch (err) {
        retryCount++;

        if (retryCount === MAX_RETRIES) {
          set({ 
            isLoading: false 
          });
          throw err;
        }
      }
    }
  },
  
  updateProfile: async ({ babyName: newBabyName, preferredLanguage, birthMonth, birthYear, ageGroup, gender }) => {
    const user = get().user;
    if (!user) throw new Error('Not authenticated');
    const errorStore = useErrorStore.getState();
    const currentProfile = get().profile;

    console.log('Starting profile update with data:', {
      newBabyName,
      preferredLanguage,
      birthMonth,
      birthYear,
      ageGroup,
      gender
    });

    errorStore.clearError();

    if (!newBabyName) {
      throw new Error('Baby name is required');
    }

    try {
      const trimmedNewName = newBabyName.trim();
      if (!trimmedNewName) {
        throw new Error('Baby name is required');
      }

      // Ensure gender is explicitly passed
      const updatedProfile = await ProfileService.updateProfile({
        userId: user.id,
        babyName: trimmedNewName,
        preferredLanguage,
        birthMonth,
        birthYear,
        ageGroup,
        gender
      });

      console.log('Profile updated successfully:', updatedProfile);

      // Update profile state immediately
      set({ profile: updatedProfile });

      // Start preset song regeneration in the background
      SongService.regeneratePresetSongs(user.id, trimmedNewName)
        .catch(error => {
          console.error('Background preset song regeneration failed:', error);
          // Don't surface this error to the user since profile update succeeded
        });

      return updatedProfile;
    } catch (error) {
      console.error('Profile update failed:', error);
      // Revert local state on error
      if (currentProfile) {
        set({ profile: currentProfile });
      }
      errorStore.setError(error instanceof Error ? error.message : 'Failed to update profile');
      throw error;
    }
  },
  signIn: async (email: string, password: string) => {
    set({ initialized: false });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.session) {
        throw new Error('No session returned after sign in');
      }
      
      // Get the user data immediately after sign in
      set({ user: data.user });
      
      // Load the profile
      await get().loadProfile(); 
      set({ initialized: true });
    } finally {
      set({ initialized: true });
    }
  },
  signUp: async (email: string, password: string, babyName: string) => {
    set({ initialized: false });
    
    if (!email.trim() || !password.trim() || !babyName.trim()) {
      throw new Error('All fields are required');
    }

    try {
      console.log('Starting signup process...');
      
      // Verify Supabase client is configured
      if (!supabase) {
        console.error('Supabase client not initialized');
        throw new Error('Authentication service configuration error. Please try again later.');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            babyName: babyName.trim(),
            preferredLanguage: DEFAULT_LANGUAGE
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        
        // Handle specific error types
        if (error.message.includes('Database error saving new user')) {
          console.log('Attempting to check if user already exists...');
          
          // Try to sign in with the provided credentials to check if user exists
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: email.trim().toLowerCase(),
              password
            });
            
            if (!signInError && signInData.user) {
              console.log('User already exists, signing in instead');
              set({ user: signInData.user });
              await get().loadProfile();
              set({ initialized: true });
              return;
            } else {
              console.log('User does not exist, this is a different database error');
              throw new Error('Unable to create account due to a database error. Please try again later.');
            }
          } catch (signInErr) {
            console.error('Error checking if user exists:', signInErr);
            throw new Error('Unable to create account. The email might already be in use or there was a database error.');
          }
        }
        
        throw error;
      }
      
      if (!data.user) {
        console.error('No user returned after sign up');
        throw new Error('No user returned after sign up');
      }
      
      console.log('User created successfully, setting up profile...');
      
      // Set user state immediately
      set({ user: data.user });

      const trimmedBabyName = babyName.trim();
      const userId = data.user.id;
      
      // Create or update profile in a single transaction
      try {
        // Create or update the profile
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert([{ 
            id: userId,
            baby_name: trimmedBabyName,
            email: email.trim().toLowerCase(),
            created_at: new Date().toISOString(),
            preset_songs_generated: true,
            preferred_language: DEFAULT_LANGUAGE,
            gender: undefined // Set default gender to undefined, user will provide during onboarding
          }]);
          
        if (upsertError) {
          console.error('Error creating/updating profile:', upsertError);
        }
      } catch (profileError) {
        console.error('Error in profile creation:', profileError);
      }

      // Generate preset songs in the background (don't await)
      SongService.regeneratePresetSongs(userId, trimmedBabyName, true)
        .catch((error) => {
          console.error('Error generating preset songs:', error);
        });

      // Immediately load the profile to ensure it's in the state
      await get().loadProfile();

      set({ initialized: true });
    } catch (error) {
      set({ initialized: true });
      throw error;
    }
  },
  signOut: async () => {
    set({ initialized: false });
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
  
      // Clear all state
      set({ 
        user: null, 
        profile: null,
        initialized: true
      });
  
      // Clear other stores
      useSongStore.getState().setState(_state => ({
        songs: [],
        generatingSongs: new Set(),
        presetSongTypes: new Set(),
        processingTaskIds: new Set()
      }));
  
      useErrorStore.getState().clearError();
  
    } catch (error) {
      // Force clear state even if sign out fails
      set({ 
        user: null, 
        profile: null,
        initialized: true
      });
      throw error;
    }
  },
  loadUser: async () => {
    try {
      // First try to get an existing session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      set({ initialized: false });
      
      if (sessionError) {
        await supabase.auth.signOut();
        set({ user: null, profile: null, initialized: true });
        return;
      }
      
      if (!session) {
        set({ user: null, profile: null, initialized: true });
        return;
      }
      
      const user = session.user;
      set({ user });
      
      if (user) {
        await get().loadProfile();
      }
      set({ initialized: true });
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        
        if (event === 'SIGNED_OUT') {
          set({ user: null, profile: null });
          return;
        }

        if (!session) {
          set({ user: null, profile: null });
          return;
        }

        const newUser = session.user;
        set({ user: newUser });

        if (newUser) {
          try {
            await get().loadProfile();
          } catch {
            // If profile load fails, sign out and reset state
            await supabase.auth.signOut();
            set({ user: null, profile: null });
          }
        }
      });
      
      return () => subscription.unsubscribe();

    } catch {
      await supabase.auth.signOut();
      set({ 
        user: null, 
        profile: null,
        initialized: true
      });
    }
  }
}));
````

## File: src/store/errorStore.ts
````typescript
import { create } from 'zustand';

interface ErrorState {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
````

## File: src/store/songStore.ts
````typescript
// @breadcrumbs
// - src/store/songStore.ts: Main song store with state management
// - Children:
//   - src/store/song/types.ts (types)
//   - src/store/song/actions.ts (actions)
//   - src/store/song/subscriptions.ts (subscriptions)
// - Related: src/store/authStore.ts (user state)

import { create } from 'zustand';
import type { SongState } from './song/types';
import { createSongActions } from './song/actions';
import { createSongSubscriptions } from './song/subscriptions';

export const useSongStore = create<SongState>((set, get) => {
  const actions = createSongActions(set, get);
  const subscriptions = createSongSubscriptions(set, get);

  return {
    // Initial state
    songs: [],
    isLoading: false,
    generatingSongs: new Set<string>(),
    retryingSongs: new Set<string>(),
    processingTaskIds: new Set<string>(),
    queuedTaskIds: new Set<string>(),
    isDeleting: false,
    error: null,

    // State helpers
    setState: (updater) => set(updater),
    clearGeneratingState: (songId: string) => {
      set(state => {
        const newGenerating = new Set(state.generatingSongs);
        newGenerating.delete(songId);
        return { generatingSongs: newGenerating };
      });
    },

    setRetrying: (songId: string, isRetrying: boolean) => {
      set(state => {
        const newRetrying = new Set(state.retryingSongs);
        if (isRetrying) {
          newRetrying.add(songId);
        } else {
          newRetrying.delete(songId);
        }
        return { retryingSongs: newRetrying };
      });
    },

    // Actions
    ...actions,

    // Subscriptions
    setupSubscription: subscriptions.setupSubscription
  };
});
````

## File: src/types/index.ts
````typescript
export type MusicMood = 'calm' | 'playful' | 'learning' | 'energetic';
export type VoiceType = 'softFemale' | 'calmMale';
export type ThemeType = 
  | 'pitchDevelopment' 
  | 'cognitiveSpeech' 
  | 'sleepRegulation'
  | 'socialEngagement' 
  | 'indianClassical' 
  | 'westernClassical';

export type Tempo = 'slow' | 'medium' | 'fast';

export type AgeGroup = '0-6' | '7-12' | '13-24';
export type PresetType = 'playing' | 'eating' | 'sleeping' | 'pooping';
export type Language = 'en' | 'hi';

// Default language for the application - single source of truth
export const DEFAULT_LANGUAGE: Language = 'en';

export interface MusicGenerationParams {
  theme?: ThemeType;
  mood?: MusicMood;
  lyrics?: string;
  name?: string;
  gender?: string;
  ageGroup?: AgeGroup;
  tempo?: Tempo;
  isInstrumental?: boolean;
  songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  voice?: VoiceType;
  preset_type?: PresetType;
  userInput?: string;
}

export interface Song {
  id: string;
  name: string;
  mood?: MusicMood;
  theme?: ThemeType;
  voice?: VoiceType;
  lyrics?: string;
  audio_url?: string;  // Using snake_case to match database convention
  createdAt: Date;
  userId: string;
  retryable?: boolean;
  variations?: SongVariation[];
  error?: string;
  task_id?: string;
  song_type?: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  preset_type?: PresetType;
}

export interface SongVariation {
  id: string;
  songId: string;
  audio_url: string;
  title?: string;
  metadata?: {
    tags?: string;
    prompt?: string;
  };
  created_at: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  isPremium: boolean;
  dailyGenerations: number;
  lastGenerationDate: Date;
  babyName: string;
  preferredLanguage: Language;
  birthMonth?: number;
  birthYear?: number;
  ageGroup?: AgeGroup;
  gender?: string;
}

// Define BabyProfile type that contains the baby-related subset of profile data
// This keeps related data clearly structured while avoiding duplication
export type BabyProfile = {
  babyName: string;
  birthMonth?: number;
  birthYear?: number;
  ageGroup?: AgeGroup;
  preferredLanguage?: Language;
  gender?: string;
};
````

## File: src/utils/presetUtils.ts
````typescript
import { PresetType } from '../types';

/**
 * Determines the preset type from a song name
 * @param name The song name to check
 * @returns The preset type if it's a preset song, null otherwise
 */
export const getPresetType = (name: string): PresetType | null => {
  if (!name) return null;
  
  const lowerName = name.toLowerCase();
  if (lowerName.includes('playtime')) return 'playing';
  if (lowerName.includes('mealtime')) return 'eating';
  if (lowerName.includes('bedtime')) return 'sleeping';
  if (lowerName.includes('potty')) return 'pooping';
  return null;
};
````

## File: src/utils/validation.ts
````typescript
export function isValidEmail(email: string): boolean {
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
````

## File: src/App.tsx
````typescript
import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import { useEffect, useState, Suspense } from 'react';
import { useAuthStore } from './store/authStore'; 
import { useSongStore } from './store/songStore';

function App() {
  const { user, initialized } = useAuthStore();
  const { loadSongs, setupSubscription } = useSongStore();
  const [path, setPath] = useState(window.location.pathname);

  // Handle client-side navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && (target as HTMLAnchorElement).href.startsWith(window.location.origin)) {
        e.preventDefault();
        const newPath = new URL((target as HTMLAnchorElement).href).pathname;
        window.history.pushState({}, '', newPath);
        setPath(newPath);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Set up song subscription and load songs when user is authenticated
  useEffect(() => {
    if (user) {
      setupSubscription();
      loadSongs().catch(error => {
        console.error('Failed to load songs:', error);
      });
    }
  }, [user, setupSubscription, loadSongs]);

  // Show loading spinner while auth state is initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <Header />
      <Suspense fallback={null}>
        {path === '/methodology' ? (
          <Methodology />
        ) : (
          user ? <Dashboard /> : <Landing />
        )}
      </Suspense>
    </div>
  );
}

export default App;
````

## File: src/index.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gradient-to-b from-neutral-950 to-neutral-900 text-white min-h-screen;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary/90 hover:bg-primary text-white px-6 py-3 rounded-xl 
           transition-all duration-300 ease-out transform hover:scale-[1.02]
           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-neutral-900;
  }
  
  .btn-secondary {
    @apply bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl
           transition-all duration-300 ease-out backdrop-blur-sm
           focus:outline-none focus:ring-2 focus:ring-white/30;
  }

  .btn-methodology {
    @apply bg-white/10 text-white/80 hover:text-white px-6 py-3 rounded-xl
           transition-all duration-300 ease-out backdrop-blur-sm
           focus:outline-none focus:ring-2 focus:ring-white/30
           border border-white/10 hover:border-white/20
           hover:bg-[#7A7A8C]/20;
  }

  .card {
    @apply bg-white/[0.07] backdrop-blur-lg rounded-2xl border border-white/[0.05]
           shadow-xl transition-all duration-300 hover:border-white/[0.1];
  }

  .input {
    @apply bg-white/[0.07] border border-white/[0.1] rounded-xl px-4 py-2
           text-white placeholder-white/40 focus:outline-none focus:ring-2
           focus:ring-primary/50 transition-all duration-300;
  }

  .fade-in {
    @apply animate-[fadeIn_0.5s_ease-out];
  }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fixed-button {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.animate-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.hexagon-container {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.hexagon-inner {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.scroll-optimize {
  transform: translateZ(0);
}

.scroll-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
````

## File: src/main.tsx
````typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { useAuthStore } from './store/authStore';
import './index.css';

// Initialize auth state
useAuthStore.getState().loadUser();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
````

## File: src/vite-env.d.ts
````typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIAPI_KEY: string
  readonly VITE_WEBHOOK_SECRET: string
  readonly VITE_SUPABASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
````

## File: supabase/functions/piapi-webhook/index.ts
````typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface AudioClip {
  id: string;
  audio_url: string;
  title?: string;
  metadata?: {
    tags?: string;
    prompt?: string;
  };
}

const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

console.log('Edge Function started:', {
  hasWebhookSecret: !!WEBHOOK_SECRET,
  hasSupabaseUrl: !!SUPABASE_URL,
  hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY,
  timestamp: new Date().toISOString()
});

serve(async (req) => {
  try {
    // Log incoming request
    console.log('Webhook received:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    });

    // Verify webhook secret
    const secret = req.headers.get('x-webhook-secret');
    if (secret !== Deno.env.get('WEBHOOK_SECRET')) {
      console.error('Invalid webhook secret');
      throw new Error('Invalid webhook secret');
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log('Webhook body:', JSON.stringify(body, null, 2));
    } catch (error) {
      console.error('Failed to parse webhook body:', error);
      throw new Error('Invalid webhook body');
    }

    // Extract task details
    const { task_id, status, error: taskError, output } = body;
    if (!task_id) {
      console.error('Missing task_id in webhook');
      throw new Error('Missing task_id');
    }

    console.log('Processing webhook:', {
      task_id,
      status,
      error: taskError,
      hasOutput: !!output
    });

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Log status update in a clear format
    console.log('\n#######################');
    console.log('# Status now:', status);
    console.log('# Task ID:', task_id);
    console.log('# Progress:', output?.progress || 'N/A');
    console.log('#######################\n');
    
    // Log status update in a clear format
    console.log('\n##### Status now:', status, '#####\n');
    const errorMessage = taskError?.message || body?.error_message;

    // Log status for debugging
    console.log('Task status update:', {
      taskId: task_id,
      status,
      hasOutput: !!output,
      hasError: !!taskError || !!errorMessage,
      progress: output?.progress
    });

    console.log('Webhook received:', {
      taskId: task_id,
      status,
      hasOutput: !!output,
      clipCount: output?.clips ? Object.keys(output.clips).length : 0
    });

    // Find the song by task_id
    const { data: songs, error: findError } = await supabase
      .from('songs')
      .select('id, task_id, audio_url, error')
      .eq('task_id', task_id.toString())
      .maybeSingle();

    if (findError) {
      throw findError;
    }

    if (!songs) {
      throw new Error(`Song not found for task_id: ${task_id}`);
    }

    console.log('Found song:', {
      songId: songs.id,
      taskId: songs.task_id
    });

    if (output?.clips) {
      console.log('Task completed successfully');
      
      // Handle completed status
      const clip = Object.values(output.clips)[0] as AudioClip;
      
      console.log('Processing audio clips:', {
        songId: songs.id,
        hasAudio: !!clip?.audio_url,
        audioUrl: clip?.audio_url ? clip.audio_url.substring(0, 30) + '...' : 'none'
      });
      
      if (clip?.audio_url) {
        try {
          console.log(`Received audio URL from API for song with task: ${task_id}`, new Date().toISOString());
          
          // First, check the current state of the song to avoid race conditions
          const { data: currentSong, error: checkError } = await supabase
            .from('songs')
            .select('id, task_id, audio_url, error')
            .eq('id', songs.id)
            .single();
            
          if (checkError) {
            console.error('Error checking song current state:', checkError);
            throw checkError;
          }
          
          // If the song already has an audio URL, don't update it
          if (currentSong?.audio_url) {
            console.log(`Song ${songs.id} already has audio URL, skipping update`);
            return new Response(JSON.stringify({ success: true, status: 'already_updated' }), {
              headers: { 'Content-Type': 'application/json' },
              status: 200
            });
          }
          
          // Update the song with the audio URL - condition ONLY on song ID for reliability
          // This ensures the update happens even if task_id changed
          console.log(`Updating song ${songs.id} with audio URL - START`, new Date().toISOString());
          const updateStart = Date.now();
          
          // PRIORITY UPDATE: First update just the audio_url field to ensure it's set ASAP
          const { error: quickUpdateError } = await supabase
            .from('songs')
            .update({ audio_url: clip.audio_url })
            .eq('id', songs.id);
            
          if (quickUpdateError) {
            console.error('Failed quick audio URL update:', quickUpdateError);
            throw quickUpdateError;
          }
          
          console.log(`Quick audio URL update completed in ${Date.now() - updateStart}ms`, new Date().toISOString());
          
          // Then update the remaining fields in a separate call
          const { error: updateError } = await supabase
            .from('songs')
            .update({ 
              error: null,
              task_id: null // Clear task_id to indicate it's no longer in the queue
            })
            .eq('id', songs.id);

          if (updateError) {
            console.error('Failed to update song state fields:', updateError);
            // Don't throw here - audio URL was already updated
          }
          
          console.log(`Successfully updated song with audio URL in ${Date.now() - updateStart}ms:`, {
            songId: songs.id,
            taskId: task_id,
            state: 'completed',
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          console.error('Error processing audio URL update:', err);
          // Don't rethrow - we want to return success even if there was an error
          // This prevents the API from retrying the webhook call
        }
      } else {
        console.warn(`Task completed but no audio URL found for song ${songs.id}`);
      }
    }
    else if (taskError) {
      console.log('Task failed with error');
      
      let errorMsg = taskError.message || 'Music generation failed';
      let retryable = false;

      // Handle specific error cases
      if (errorMsg.includes("doesn't have enough credits")) {
        errorMsg = 'Service temporarily unavailable. Please try again.';
        retryable = true;
      } else if (errorMsg.includes('suno api status: 429')) {
        errorMsg = 'Too many requests. Please wait a moment and try again.';
        retryable = true;
      }

      console.log('Task failed:', {
        taskId: task_id,
        error: errorMsg,
        retryable
      });

      try {
        // First check if the song already has an audio URL
        const { data: currentSong, error: checkError } = await supabase
          .from('songs')
          .select('id, audio_url')
          .eq('id', songs.id)
          .single();
          
        if (checkError) {
          console.error('Error checking song before marking as failed:', checkError);
          throw checkError;
        }
        
        // If the song already has an audio URL, don't mark it as failed
        if (currentSong?.audio_url) {
          console.log(`Song ${songs.id} already has audio URL, not marking as failed`);
          return new Response(JSON.stringify({ success: true, status: 'already_completed' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
          });
        }

        // Update the song with the error
        console.log(`Marking song ${songs.id} as failed with error: ${errorMsg}`);
        const { error: updateError } = await supabase
          .from('songs')
          .update({ 
            error: errorMsg,
            retryable,
            audio_url: null,
            task_id: null // Clear task_id to indicate it's no longer in the queue
          })
          .eq('id', songs.id);

        if (updateError) {
          console.error('Failed to update song with error:', updateError);
          throw updateError;
        }
        
        console.log(`Successfully marked song ${songs.id} as failed`);
      } catch (err) {
        console.error('Error handling song failure:', err);
        // Don't rethrow to ensure the webhook doesn't retry
      }
    }
    else {
      console.log('Unhandled task status:', { taskId: task_id, status });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook error:', {
      error: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
      details: err,
      timestamp: new Date().toISOString()
    });
    
    // Don't expose detailed error information in the response
    return new Response(JSON.stringify({ 
      error: 'An error occurred processing the webhook',
      status: 'error'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: err instanceof Error && err.message.includes('not found') ? 404 : 500
    });
  }
})
````

## File: supabase/migrations/20250210084713_ivory_stream.sql
````sql
/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `is_premium` (boolean)
      - `daily_generations` (integer)
      - `last_generation_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to read/update their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  is_premium boolean DEFAULT false,
  daily_generations integer DEFAULT 0,
  last_generation_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
````

## File: supabase/migrations/20250210085258_navy_temple.sql
````sql
/*
  # Create songs table and related functionality

  1. New Tables
    - `songs`
      - `id` (uuid, primary key)
      - `name` (text)
      - `mood` (text)
      - `instrument` (text)
      - `voice_type` (text, nullable)
      - `lyrics` (text, nullable)
      - `audio_url` (text, nullable)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `songs` table
    - Add policies for authenticated users to manage their songs
*/

CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mood text NOT NULL,
  instrument text NOT NULL,
  voice_type text,
  lyrics text,
  audio_url text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own songs
CREATE POLICY "Users can view own songs"
  ON songs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own songs
CREATE POLICY "Users can insert own songs"
  ON songs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own songs
CREATE POLICY "Users can update own songs"
  ON songs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own songs
CREATE POLICY "Users can delete own songs"
  ON songs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
````

## File: supabase/migrations/20250210102620_humble_oasis.sql
````sql
/*
  # Add error column to songs table

  1. Changes
    - Add `error` column to `songs` table to track generation errors
    - Make column nullable to only store errors when they occur
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'error'
  ) THEN
    ALTER TABLE songs ADD COLUMN error text;
  END IF;
END $$;
````

## File: supabase/migrations/20250210210424_lingering_wildflower.sql
````sql
/*
  # Add task_id column to songs table

  1. Changes
    - Add task_id column to songs table for webhook correlation
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'task_id'
  ) THEN
    ALTER TABLE songs ADD COLUMN task_id text;
  END IF;
END $$;
````

## File: supabase/migrations/20250210221235_purple_pebble.sql
````sql
/*
  # Add support for song variations

  1. New Tables
    - `song_variations`
      - `id` (uuid, primary key)
      - `song_id` (uuid, references songs)
      - `audio_url` (text)
      - `title` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `song_variations` table
    - Add policies for authenticated users to manage their variations
*/

CREATE TABLE IF NOT EXISTS song_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid REFERENCES songs NOT NULL,
  audio_url text NOT NULL,
  title text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE song_variations ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own song variations
CREATE POLICY "Users can view own song variations"
  ON song_variations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_variations.song_id
    AND songs.user_id = auth.uid()
  ));

-- Allow users to insert variations for their own songs
CREATE POLICY "Users can insert own song variations"
  ON song_variations
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_variations.song_id
    AND songs.user_id = auth.uid()
  ));

-- Allow users to update their own song variations
CREATE POLICY "Users can update own song variations"
  ON song_variations
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_variations.song_id
    AND songs.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM songs
    WHERE songs.id = song_variations.song_id
    AND songs.user_id = auth.uid()
  ));
````

## File: supabase/migrations/20250211175629_fierce_waterfall.sql
````sql
/*
  # Add cascade delete for song variations

  1. Changes
    - Add ON DELETE CASCADE to song_variations foreign key
    - This ensures variations are automatically deleted when a song is deleted

  2. Security
    - Maintains existing RLS policies
    - Safe operation as variations should not exist without parent songs
*/

-- Drop existing foreign key constraint
ALTER TABLE song_variations 
  DROP CONSTRAINT IF EXISTS song_variations_song_id_fkey;

-- Re-add with cascade delete
ALTER TABLE song_variations 
  ADD CONSTRAINT song_variations_song_id_fkey 
  FOREIGN KEY (song_id) 
  REFERENCES songs(id) 
  ON DELETE CASCADE;
````

## File: supabase/migrations/20250211185720_long_shadow.sql
````sql
/*
  # Add baby name to profiles

  1. Changes
    - Add baby_name column to profiles table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'baby_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN baby_name text;
  END IF;
END $$;
````

## File: supabase/migrations/20250211185721_fierce_island.sql
````sql
/*
  # Add preset songs table

  1. New Tables
    - `preset_songs`
      - `id` (uuid, primary key)
      - `type` (text) - Type of preset (playing, eating, sleeping, pooping)
      - `lyrics_template` (text) - Template with {name} placeholder
      - `mood` (text)
      - `instrument` (text)
      - `voice_type` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on preset_songs table
    - Add policy for authenticated users to read presets
*/

CREATE TABLE IF NOT EXISTS preset_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  lyrics_template text NOT NULL,
  mood text NOT NULL,
  instrument text NOT NULL,
  voice_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE preset_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read preset songs"
  ON preset_songs FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial preset songs
INSERT INTO preset_songs (type, lyrics_template, mood, instrument, voice_type) VALUES
  ('playing', 'Bounce and play, {name}''s having fun today! Jump and spin, let the games begin! {name}''s smile lights up the way, as we play all through the day!', 'playful', 'piano', 'softFemale'),
  ('eating', 'Yummy yummy in {name}''s tummy, eating food that''s oh so yummy! Open wide, food inside, growing strong with every bite!', 'calm', 'harp', 'softFemale'),
  ('sleeping', 'Sweet dreams little {name}, close your eyes and drift away. Stars are twinkling up above, wrapped in warmth and endless love.', 'calm', 'strings', 'softFemale'),
  ('pooping', 'Push push little {name}, let it all come out to play! Every day we do our part, making pooping into art!', 'playful', 'piano', 'softFemale');
````

## File: supabase/migrations/20250211190439_late_temple.sql
````sql
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preset_songs_generated'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preset_songs_generated boolean DEFAULT false;
  END IF;
END $$;
````

## File: supabase/migrations/20250211193819_shiny_coral.sql
````sql
/*
  # Add language preference to profiles

  1. Changes
    - Add preferred_language column to profiles table with default 'English'
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_language text DEFAULT 'English';
  END IF;
END $$;
````

## File: supabase/migrations/20250211233356_fierce_cloud.sql
````sql
/*
  # Update preset songs structure and data
  
  1. Changes
    - Make instrument column nullable
    - Update preset songs with new configuration
    - Remove instrument requirement
    - Update mood settings
  
  2. Security
    - Maintains existing RLS policies
*/

-- First, modify the table structure to make instrument nullable
ALTER TABLE preset_songs ALTER COLUMN instrument DROP NOT NULL;

-- Clear existing preset songs
TRUNCATE TABLE preset_songs;

-- Insert updated preset songs without instrument requirement
INSERT INTO preset_songs (type, lyrics_template, mood, voice_type) VALUES
  (
    'playing',
    'Bounce and play, {name}''s having fun today! Jump and spin, let the games begin!',
    'energetic',
    'softFemale'
  ),
  (
    'eating',
    'Yummy yummy in {name}''s tummy, eating food that''s oh so yummy!',
    'playful',
    'softFemale'
  ),
  (
    'sleeping',
    'Sweet dreams little {name}, close your eyes and drift away.',
    'calm',
    'softFemale'
  ),
  (
    'pooping',
    'Push push little {name}, let it all come out to play!',
    'playful',
    'softFemale'
  );
````

## File: supabase/migrations/20250211233423_rustic_math.sql
````sql
/*
  # Fix Profile RLS Policies
  
  1. Changes
    - Drop existing RLS policies for profiles table
    - Add new policies that properly handle profile creation and updates
    - Ensure authenticated users can manage their own profiles
  
  2. Security
    - Maintains data isolation between users
    - Allows profile creation for new users
    - Restricts profile access to owners only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies with proper permissions
CREATE POLICY "Users can manage own profile"
  ON profiles
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow profile creation during signup
CREATE POLICY "Users can create their profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
````

## File: supabase/migrations/20250211233856_autumn_plain.sql
````sql
/*
  # User Cleanup Migration

  1. Changes
    - Add function to clean up user data when deleting from auth.users
    - Add trigger to automatically run cleanup when a user is deleted
    
  2. Security
    - Function runs with security definer to ensure proper permissions
    - Cascading deletes handle related records
*/

-- Function to clean up user data when a user is deleted
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS trigger AS $$
BEGIN
  -- Delete profile (which will cascade to songs and variations)
  DELETE FROM public.profiles WHERE id = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run cleanup when a user is deleted
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_deletion();
````

## File: supabase/migrations/20250212033025_holy_rain.sql
````sql
/*
  # Remove preset_songs table and update songs tracking

  1. Changes
    - Drop preset_songs table as configurations are now in code
    - Add preset_type column to songs table for better tracking
    - Add is_preset boolean flag to songs table
  
  2. Security
    - Maintain existing RLS policies
*/

-- Drop the preset_songs table as it's no longer needed
DROP TABLE IF EXISTS preset_songs;

-- Add tracking columns to songs table
DO $$ 
BEGIN
  -- Add preset_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'preset_type'
  ) THEN
    ALTER TABLE songs ADD COLUMN preset_type text;
  END IF;

  -- Add is_preset flag if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'is_preset'
  ) THEN
    ALTER TABLE songs ADD COLUMN is_preset boolean DEFAULT false;
  END IF;
END $$;
````

## File: supabase/migrations/20250212074154_red_harbor.sql
````sql
/*
  # Fix instrument constraint

  1. Changes
    - Make instrument column nullable in songs table
    - Add default instrument for existing rows
*/

-- First set a default instrument for any existing rows
UPDATE songs 
SET instrument = 'piano' 
WHERE instrument IS NULL;

-- Then make the column nullable
ALTER TABLE songs 
ALTER COLUMN instrument DROP NOT NULL;
````

## File: supabase/migrations/20250212082359_mute_meadow.sql
````sql
/*
  # Delete all data and users
  
  1. Changes
    - Delete all data in the correct order to handle foreign key constraints
    - Delete all users from auth.users
    - Reset sequences
  
  2. Notes
    - Handles foreign key constraints properly
    - Safe to run multiple times
    - Cascading deletion through proper order
*/

-- First delete song variations (they depend on songs)
DELETE FROM public.song_variations;

-- Then delete songs (they depend on users)
DELETE FROM public.songs;

-- Then delete profiles (they depend on users)
DELETE FROM public.profiles;

-- Finally delete all users
DELETE FROM auth.users;

-- Reset sequences
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART;
````

## File: supabase/migrations/20250216081442_fragrant_temple.sql
````sql
/*
  # Delete last 2 users and associated data

  1. Changes
    - Deletes the last 2 users created in the system
    - Cascades deletion to all associated data (profiles, songs, variations)
  
  2. Security
    - Uses row level security policies already in place
    - Maintains referential integrity through cascading deletes
*/

-- Get the IDs of the last 2 users created
WITH last_users AS (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 2
)
-- Delete the users (will cascade to profiles, songs, and variations)
DELETE FROM auth.users 
WHERE id IN (SELECT id FROM last_users);
````

## File: supabase/migrations/20250216081622_throbbing_butterfly.sql
````sql
/*
  # Thorough cleanup of last 2 users and associated data
  
  1. Deletes the last 2 users created and all their associated data
  2. Uses explicit cascading deletes to ensure complete cleanup
  3. Includes verification steps
*/

-- First delete song variations (they depend on songs)
DELETE FROM public.song_variations
WHERE song_id IN (
  SELECT s.id 
  FROM public.songs s
  WHERE s.user_id IN (
    SELECT id 
    FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 2
  )
);

-- Then delete songs (they depend on users)
DELETE FROM public.songs 
WHERE user_id IN (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 2
);

-- Then delete profiles (they depend on users)
DELETE FROM public.profiles
WHERE id IN (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 2
);

-- Finally delete the users
DELETE FROM auth.users
WHERE id IN (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 2
);
````

## File: supabase/migrations/20250216082214_square_wood.sql
````sql
/*
  # Add cascade delete for user data

  1. Changes
    - Add ON DELETE CASCADE to profiles foreign key
    - Add ON DELETE CASCADE to songs foreign key
    - Add ON DELETE CASCADE to song_variations foreign key
  
  2. Security
    - Maintains RLS policies
    - Ensures data is properly cleaned up when a user is deleted
*/

-- Update profiles foreign key
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Update songs foreign key
ALTER TABLE songs
  DROP CONSTRAINT IF EXISTS songs_user_id_fkey,
  ADD CONSTRAINT songs_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Update song_variations foreign key
ALTER TABLE song_variations
  DROP CONSTRAINT IF EXISTS song_variations_song_id_fkey,
  ADD CONSTRAINT song_variations_song_id_fkey
    FOREIGN KEY (song_id)
    REFERENCES songs(id)
    ON DELETE CASCADE;
````

## File: supabase/migrations/20250216083215_bitter_villa.sql
````sql
/*
  # Check existing users
  
  This migration checks for existing users in the database.
*/

-- Select all users and their profiles
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.baby_name,
  p.preferred_language
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;
````

## File: supabase/migrations/20250216083400_navy_mud.sql
````sql
/*
  # Check users state
  
  This migration checks the current state of users and their profiles.
*/

-- First, show all users
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data,
  p.baby_name,
  p.preferred_language,
  p.created_at as profile_created_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;

-- Then show any orphaned profiles (profiles without users)
SELECT p.*
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE u.id IS NULL;

-- Show any duplicate emails
SELECT email, COUNT(*) as count
FROM auth.users
GROUP BY email
HAVING COUNT(*) > 1;
````

## File: supabase/migrations/20250216083545_tiny_sun.sql
````sql
/*
  # Clean up users and profiles

  1. Changes
    - Delete any orphaned profiles (profiles without users)
    - Delete any users without profiles
    - Delete any duplicate email registrations
*/

-- First, delete any orphaned profiles
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- Then delete any users without profiles
DELETE FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Finally, for any duplicate emails, keep only the most recent registration
WITH duplicates AS (
  SELECT email, array_agg(id ORDER BY created_at DESC) as ids
  FROM auth.users
  GROUP BY email
  HAVING COUNT(*) > 1
)
DELETE FROM auth.users
WHERE id IN (
  SELECT unnest(ids[2:]) -- Keep first (most recent) ID, delete others
  FROM duplicates
);
````

## File: supabase/migrations/20250216083811_restless_dream.sql
````sql
-- First, get all auth users
WITH auth_users AS (
  SELECT id, email, created_at
  FROM auth.users
),
-- Find any inconsistencies
inconsistent_users AS (
  SELECT au.id, au.email
  FROM auth_users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE p.id IS NULL
)
-- Remove any auth users without profiles
DELETE FROM auth.users
WHERE id IN (
  SELECT id FROM inconsistent_users
);

-- Verify email uniqueness
DELETE FROM auth.users a
    USING auth.users b
    WHERE a.email = b.email 
    AND a.created_at < b.created_at;

-- Clean up any orphaned profiles
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);
````

## File: supabase/migrations/20250216083904_sunny_hall.sql
````sql
/*
  # Clean up orphaned data

  1. Data Cleanup
    - Remove song variations without valid songs
    - Remove songs without valid users
    - Remove profiles without valid users
    - Remove auth users without profiles
    - Remove duplicate email registrations

  2. Verification
    - Verify all relationships are valid
    - Ensure referential integrity
*/

-- First, remove any song variations without valid songs
DELETE FROM public.song_variations
WHERE song_id NOT IN (SELECT id FROM public.songs);

-- Remove songs without valid users
DELETE FROM public.songs
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Remove profiles without valid users
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- Remove auth users without profiles
DELETE FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- For any duplicate emails, keep only the most recent registration
WITH duplicates AS (
  SELECT email, array_agg(id ORDER BY created_at DESC) as ids
  FROM auth.users
  GROUP BY email
  HAVING COUNT(*) > 1
)
DELETE FROM auth.users
WHERE id IN (
  SELECT unnest(ids[2:]) -- Keep first (most recent) ID, delete others
  FROM duplicates
);

-- Final verification: Remove any remaining orphaned data
DO $$ 
BEGIN
  -- Remove any remaining song variations without valid songs
  DELETE FROM public.song_variations
  WHERE song_id NOT IN (SELECT id FROM public.songs);

  -- Remove any remaining songs without valid users
  DELETE FROM public.songs
  WHERE user_id NOT IN (SELECT id FROM auth.users);

  -- Remove any remaining profiles without valid users
  DELETE FROM public.profiles
  WHERE id NOT IN (SELECT id FROM auth.users);
END $$;
````

## File: supabase/migrations/20250216084301_navy_snowflake.sql
````sql
-- First, delete all song variations
DELETE FROM public.song_variations;

-- Then delete all songs
DELETE FROM public.songs;

-- Then delete all profiles
DELETE FROM public.profiles;

-- Finally delete all users from auth.users
DELETE FROM auth.users;

-- Reset sequences if any
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART;

-- Verify cleanup
DO $$ 
BEGIN
  -- Verify no orphaned song variations exist
  ASSERT (SELECT COUNT(*) FROM public.song_variations) = 0, 
    'Song variations table should be empty';

  -- Verify no orphaned songs exist
  ASSERT (SELECT COUNT(*) FROM public.songs) = 0,
    'Songs table should be empty';

  -- Verify no orphaned profiles exist
  ASSERT (SELECT COUNT(*) FROM public.profiles) = 0,
    'Profiles table should be empty';

  -- Verify no users exist
  ASSERT (SELECT COUNT(*) FROM auth.users) = 0,
    'Users table should be empty';
END $$;
````

## File: supabase/migrations/20250216084749_solitary_thunder.sql
````sql
-- Delete the test user and all associated data
DO $$ 
BEGIN
  -- First delete song variations for this user's songs
  DELETE FROM public.song_variations
  WHERE song_id IN (
    SELECT s.id 
    FROM public.songs s
    WHERE s.user_id IN (
      SELECT id 
      FROM auth.users 
      WHERE email = 'test@test.com'
    )
  );

  -- Then delete songs
  DELETE FROM public.songs 
  WHERE user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'test@test.com'
  );

  -- Then delete profile
  DELETE FROM public.profiles
  WHERE id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'test@test.com'
  );

  -- Finally delete the user
  DELETE FROM auth.users
  WHERE email = 'test@test.com';
END $$;
````

## File: supabase/migrations/20250216084843_gentle_torch.sql
````sql
-- Delete the test user and all associated data
DO $$ 
BEGIN
  -- First delete song variations for this user's songs
  DELETE FROM public.song_variations
  WHERE song_id IN (
    SELECT s.id 
    FROM public.songs s
    WHERE s.user_id = '3a8b4aea-8542-46b6-b97a-bbb2a2e042fa'
  );

  -- Then delete songs
  DELETE FROM public.songs 
  WHERE user_id = '3a8b4aea-8542-46b6-b97a-bbb2a2e042fa';

  -- Then delete profile
  DELETE FROM public.profiles
  WHERE id = '3a8b4aea-8542-46b6-b97a-bbb2a2e042fa';

  -- Finally delete the user
  DELETE FROM auth.users
  WHERE id = '3a8b4aea-8542-46b6-b97a-bbb2a2e042fa';
END $$;
````

## File: supabase/migrations/20250216090822_young_manor.sql
````sql
/*
  # Clean Database State

  1. Changes
    - Delete all data from all tables
    - Reset sequences
    - Verify cleanup

  2. Safety Measures
    - Uses cascading deletes to maintain referential integrity
    - Verifies all tables are empty after cleanup
*/

-- First delete all song variations
DELETE FROM public.song_variations;

-- Then delete all songs
DELETE FROM public.songs;

-- Then delete all profiles
DELETE FROM public.profiles;

-- Finally delete all users from auth.users
DELETE FROM auth.users;

-- Reset sequences if any
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART;

-- Verify cleanup
DO $$ 
BEGIN
  -- Verify no song variations exist
  ASSERT (SELECT COUNT(*) FROM public.song_variations) = 0, 
    'Song variations table should be empty';

  -- Verify no songs exist
  ASSERT (SELECT COUNT(*) FROM public.songs) = 0,
    'Songs table should be empty';

  -- Verify no profiles exist
  ASSERT (SELECT COUNT(*) FROM public.profiles) = 0,
    'Profiles table should be empty';

  -- Verify no users exist
  ASSERT (SELECT COUNT(*) FROM auth.users) = 0,
    'Users table should be empty';

  RAISE NOTICE 'Database cleanup complete - all tables are empty';
END $$;
````

## File: supabase/migrations/20250216090848_frosty_sun.sql
````sql
/*
  # Clean Database State

  1. Changes
    - Delete all data from all tables in the correct order
    - Reset sequences
    - Verify cleanup

  2. Safety Measures
    - Uses cascading deletes to maintain referential integrity
    - Verifies all tables are empty after cleanup
*/

-- First delete all song variations
DELETE FROM public.song_variations;

-- Then delete all songs
DELETE FROM public.songs;

-- Then delete all profiles
DELETE FROM public.profiles;

-- Finally delete all users from auth.users
DELETE FROM auth.users;

-- Reset sequences if any
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART;

-- Verify cleanup
DO $$ 
BEGIN
  -- Verify no song variations exist
  ASSERT (SELECT COUNT(*) FROM public.song_variations) = 0, 
    'Song variations table should be empty';

  -- Verify no songs exist
  ASSERT (SELECT COUNT(*) FROM public.songs) = 0,
    'Songs table should be empty';

  -- Verify no profiles exist
  ASSERT (SELECT COUNT(*) FROM public.profiles) = 0,
    'Profiles table should be empty';

  -- Verify no users exist
  ASSERT (SELECT COUNT(*) FROM auth.users) = 0,
    'Users table should be empty';

  RAISE NOTICE 'Database cleanup complete - all tables are empty';
END $$;
````

## File: supabase/migrations/20250216090937_heavy_rain.sql
````sql
/*
  # Clean Database State

  1. Changes
    - Delete all data from all tables in the correct order
    - Reset sequences
    - Verify cleanup

  2. Safety Measures
    - Uses cascading deletes to maintain referential integrity
    - Verifies all tables are empty after cleanup
*/

-- First delete all song variations
DELETE FROM public.song_variations;

-- Then delete all songs
DELETE FROM public.songs;

-- Then delete all profiles
DELETE FROM public.profiles;

-- Finally delete all users from auth.users
DELETE FROM auth.users;

-- Reset sequences if any
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART;

-- Verify cleanup
DO $$ 
BEGIN
  -- Verify no song variations exist
  ASSERT (SELECT COUNT(*) FROM public.song_variations) = 0, 
    'Song variations table should be empty';

  -- Verify no songs exist
  ASSERT (SELECT COUNT(*) FROM public.songs) = 0,
    'Songs table should be empty';

  -- Verify no profiles exist
  ASSERT (SELECT COUNT(*) FROM public.profiles) = 0,
    'Profiles table should be empty';

  -- Verify no users exist
  ASSERT (SELECT COUNT(*) FROM auth.users) = 0,
    'Users table should be empty';

  RAISE NOTICE 'Database cleanup complete - all tables are empty';
END $$;
````

## File: supabase/migrations/20250216091423_amber_mouse.sql
````sql
/*
  # Add Baby Profile Fields

  1. Changes
    - Add birth_month and birth_year columns to profiles table
    - Add age_group column to profiles table
    - Update existing profiles with default values
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to profiles table
DO $$ 
BEGIN
  -- Add birth_month if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_month'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_month integer;
  END IF;

  -- Add birth_year if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_year'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_year integer;
  END IF;

  -- Add age_group if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'age_group'
  ) THEN
    ALTER TABLE profiles ADD COLUMN age_group text;
  END IF;
END $$;
````

## File: supabase/migrations/20250216091643_square_cloud.sql
````sql
/*
  # Add Baby Profile Columns

  1. New Columns
    - `birth_month` (integer) - Baby's birth month
    - `birth_year` (integer) - Baby's birth year
    - `age_group` (text) - Age group category (0-6, 7-12, 13-24 months)

  2. Changes
    - Adds new columns to profiles table for tracking baby age information
    - Includes validation for month and year values
*/

DO $$ 
BEGIN
  -- Add birth_month if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_month'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_month integer CHECK (birth_month BETWEEN 1 AND 12);
  END IF;

  -- Add birth_year if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_year'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_year integer CHECK (birth_year >= 2020);
  END IF;

  -- Add age_group if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'age_group'
  ) THEN
    ALTER TABLE profiles ADD COLUMN age_group text CHECK (age_group IN ('0-6', '7-12', '13-24'));
  END IF;
END $$;
````

## File: supabase/migrations/20250216220716_silver_river.sql
````sql
/*
  # Add birth details to profiles

  1. Changes
    - Add birth_month column (integer, 1-12)
    - Add birth_year column (integer, >= 2020)
    - Add age_group column (text, with valid values)
    - Add constraints to ensure data validity
*/

DO $$ 
BEGIN
  -- Add birth_month if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_month'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_month integer CHECK (birth_month BETWEEN 1 AND 12);
  END IF;

  -- Add birth_year if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'birth_year'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_year integer CHECK (birth_year >= 2020);
  END IF;

  -- Add age_group if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'age_group'
  ) THEN
    ALTER TABLE profiles ADD COLUMN age_group text CHECK (age_group IN ('0-6', '7-12', '13-24'));
  END IF;
END $$;
````

## File: supabase/migrations/20250216224920_small_valley.sql
````sql
/*
  # Add song status tracking

  1. New Columns
    - `status` - Track song generation status (pending/processing/completed/failed/staged)
    - `retryable` - Flag for retryable errors
  
  2. Changes
    - Add status column with valid states
    - Add retryable boolean flag
    - Add default status value
*/

DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'status'
  ) THEN
    -- Create enum type for status if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_type WHERE typname = 'song_status'
    ) THEN
      CREATE TYPE song_status AS ENUM (
        'pending',
        'processing',
        'completed',
        'failed',
        'staged'
      );
    END IF;

    ALTER TABLE songs ADD COLUMN status song_status DEFAULT 'pending';
  END IF;

  -- Add retryable flag if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'retryable'
  ) THEN
    ALTER TABLE songs ADD COLUMN retryable boolean DEFAULT false;
  END IF;

  -- Update existing songs without status
  UPDATE songs 
  SET status = CASE
    WHEN audio_url IS NOT NULL THEN 'completed'::song_status
    WHEN error IS NOT NULL THEN 'failed'::song_status
    ELSE 'pending'::song_status
  END
  WHERE status IS NULL;
END $$;
````

## File: supabase/migrations/20250216225307_warm_stream.sql
````sql
/*
  # Update song statuses

  1. Changes
    - Update all songs with audio_url to 'completed' status
    - Update all songs with error to 'failed' status
    - Set remaining songs to 'pending'
*/

-- Update song statuses based on their current state
UPDATE songs 
SET status = CASE
  WHEN audio_url IS NOT NULL THEN 'completed'::song_status
  WHEN error IS NOT NULL THEN 'failed'::song_status
  ELSE 'pending'::song_status
END
WHERE status IS NULL OR (status = 'pending' AND audio_url IS NOT NULL);

-- Set retryable flag for specific error messages
UPDATE songs
SET retryable = true
WHERE error LIKE '%credits%' OR error LIKE '%429%' OR error LIKE '%too many requests%';
````

## File: supabase/migrations/20250216225549_rapid_plain.sql
````sql
/*
  # Add status tracking for song variations

  1. Changes
    - Add status column to song_variations table
    - Add retryable flag to song_variations table
    - Update existing variations with appropriate statuses
*/

DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'song_variations' AND column_name = 'status'
  ) THEN
    ALTER TABLE song_variations ADD COLUMN status song_status DEFAULT 'pending';
  END IF;

  -- Add retryable flag if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'song_variations' AND column_name = 'retryable'
  ) THEN
    ALTER TABLE song_variations ADD COLUMN retryable boolean DEFAULT false;
  END IF;

  -- Update existing variations
  UPDATE song_variations 
  SET status = CASE
    WHEN audio_url IS NOT NULL THEN 'completed'::song_status
    ELSE 'pending'::song_status
  END
  WHERE status IS NULL;
END $$;
````

## File: supabase/migrations/20250217001623_copper_math.sql
````sql
/*
  # Delete user with email new@new.com

  1. Overview
    - Safely deletes user with email new@new.com and all associated data
    - Handles deletion in correct order to maintain referential integrity
    - Uses transaction to ensure atomicity

  2. Operations
    - Delete song variations
    - Delete songs
    - Delete profile
    - Delete user
*/

BEGIN;

-- First delete song variations for this user's songs
DELETE FROM public.song_variations
WHERE song_id IN (
  SELECT s.id 
  FROM public.songs s
  WHERE s.user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'new@new.com'
  )
);

-- Then delete songs
DELETE FROM public.songs 
WHERE user_id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'new@new.com'
);

-- Then delete profile
DELETE FROM public.profiles
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'new@new.com'
);

-- Finally delete the user
DELETE FROM auth.users
WHERE email = 'new@new.com';

COMMIT;
````

## File: supabase/migrations/20250217015148_light_cake.sql
````sql
-- Add a new migration to ensure all songs have proper audio URLs
DO $$ 
BEGIN
  -- First, ensure all songs with variations have their main audio_url set
  UPDATE songs s
  SET audio_url = (
    SELECT audio_url 
    FROM song_variations sv 
    WHERE sv.song_id = s.id 
    ORDER BY sv.created_at ASC 
    LIMIT 1
  )
  WHERE EXISTS (
    SELECT 1 
    FROM song_variations sv 
    WHERE sv.song_id = s.id
  )
  AND (s.audio_url IS NULL OR s.audio_url = '');

  -- Update status for songs with audio URLs
  UPDATE songs
  SET status = 'completed'
  WHERE audio_url IS NOT NULL AND status != 'completed';

  -- Update status for variations
  UPDATE song_variations
  SET status = 'completed'
  WHERE audio_url IS NOT NULL AND status != 'completed';
END $$;
````

## File: supabase/migrations/20250217015700_crystal_wildflower.sql
````sql
/*
  # Add pending status handling
  
  1. Changes
    - Add explicit pending status handling for songs in queue
    - Update existing songs to have correct pending status
    - Add status transition tracking
  
  2. Status Flow
    staged -> pending -> processing -> completed/failed
*/

-- Update songs that are queued but not yet processing
UPDATE songs
SET status = 'pending'
WHERE task_id IS NOT NULL 
  AND audio_url IS NULL 
  AND error IS NULL
  AND status NOT IN ('processing', 'completed', 'failed');

-- Update any staged songs that have task IDs to pending
UPDATE songs 
SET status = 'pending'
WHERE status = 'staged' 
  AND task_id IS NOT NULL;

-- Ensure songs without task IDs stay in staged state
UPDATE songs
SET status = 'staged'
WHERE task_id IS NULL 
  AND audio_url IS NULL
  AND error IS NULL;
````

## File: supabase/migrations/20250217015936_plain_temple.sql
````sql
/*
  # Add webhook status logging

  1. Changes
    - Add logging function to track webhook status updates
    - Add trigger to log status changes
*/

-- Create a function to log status changes
CREATE OR REPLACE FUNCTION log_webhook_status()
RETURNS trigger AS $$
BEGIN
  -- Log status changes in a clear format
  RAISE NOTICE E'\n##### Status now: % ######\n', NEW.status;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS webhook_status_logger ON songs;
CREATE TRIGGER webhook_status_logger
  AFTER UPDATE OF status ON songs
  FOR EACH ROW
  EXECUTE FUNCTION log_webhook_status();
````

## File: supabase/migrations/20250219234733_curly_boat.sql
````sql
/*
  # Add theme column to songs table

  1. Changes
    - Add theme column to songs table to support theme-based song generation
    - Make theme column nullable since it's only required for theme-based songs
    - Add check constraint to ensure valid theme values

  2. Notes
    - Theme is only required for theme-based songs, not custom songs
    - Themes are predefined in the application code
*/

DO $$ 
BEGIN
  -- Add theme column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'theme'
  ) THEN
    ALTER TABLE songs ADD COLUMN theme text;

    -- Add check constraint for valid themes
    ALTER TABLE songs ADD CONSTRAINT valid_theme CHECK (
      theme IN (
        'pitchDevelopment',
        'cognitiveSpeech',
        'sleepRegulation',
        'socialEngagement',
        'musicalDevelopment',
        'indianClassical',
        'westernClassical',
        'custom'
      ) OR theme IS NULL
    );
  END IF;
END $$;
````

## File: supabase/migrations/20250220003421_stark_dream.sql
````sql
/*
  # Add theme support to songs table

  1. Changes
    - Add theme column to songs table
    - Make mood column nullable
    - Add check constraint for valid themes

  2. Notes
    - Theme-based songs don't require mood
    - Custom songs still require mood
*/

DO $$ 
BEGIN
  -- Add theme column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'theme'
  ) THEN
    ALTER TABLE songs ADD COLUMN theme text;

    -- Add check constraint for valid themes if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_theme') THEN
      ALTER TABLE songs ADD CONSTRAINT valid_theme CHECK (
        theme IN (
          'pitchDevelopment',
          'cognitiveSpeech',
          'sleepRegulation',
          'socialEngagement',
          'musicalDevelopment',
          'indianClassical',
          'westernClassical',
          'custom'
        ) OR theme IS NULL
      );
    END IF;
  END IF;

  -- Make mood nullable if it's not already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'mood' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE songs ALTER COLUMN mood DROP NOT NULL;
  END IF;

  -- Add constraint to ensure either theme or mood is present if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'theme_or_mood_required') THEN
    ALTER TABLE songs ADD CONSTRAINT theme_or_mood_required 
      CHECK (
        (theme IS NOT NULL) OR 
        (mood IS NOT NULL)
      );
  END IF;

  -- Add constraint to ensure custom theme has mood if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_theme_requires_mood') THEN
    ALTER TABLE songs ADD CONSTRAINT custom_theme_requires_mood
      CHECK (
        theme != 'custom' OR 
        (theme = 'custom' AND mood IS NOT NULL)
      );
  END IF;
END $$;
````

## File: supabase/migrations/20250220004702_mute_union.sql
````sql
/*
  # Remove preset songs functionality

  1. Changes
    - Remove preset-related columns and constraints
    - Clean up any existing preset songs
    - Ensure theme and mood constraints remain intact

  2. Notes
    - Preserves theme-based and custom song functionality
    - Maintains data integrity with existing constraints
*/

DO $$ 
BEGIN
  -- Remove any existing preset songs
  DELETE FROM songs 
  WHERE name ILIKE ANY(ARRAY['%playtime%', '%mealtime%', '%bedtime%', '%potty%']);

  -- Remove preset-related columns if they exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'preset_type'
  ) THEN
    ALTER TABLE songs DROP COLUMN preset_type;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'is_preset'
  ) THEN
    ALTER TABLE songs DROP COLUMN is_preset;
  END IF;

  -- Remove preset-related columns from profiles if they exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preset_songs_generated'
  ) THEN
    ALTER TABLE profiles DROP COLUMN preset_songs_generated;
  END IF;
END $$;
````

## File: supabase/migrations/20250220004802_young_desert.sql
````sql
/*
  # Restore preset song functionality
  
  1. Changes
    - Add preset_type column back to songs table
    - Add is_preset flag back to songs table
    - Add preset_songs_generated back to profiles table
    
  2. Notes
    - Maintains compatibility with theme-based approach
    - Allows tracking of preset song generation status
*/

DO $$ 
BEGIN
  -- Add preset_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'preset_type'
  ) THEN
    ALTER TABLE songs ADD COLUMN preset_type text;
  END IF;

  -- Add is_preset flag if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'is_preset'
  ) THEN
    ALTER TABLE songs ADD COLUMN is_preset boolean DEFAULT false;
  END IF;

  -- Add preset_songs_generated back to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preset_songs_generated'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preset_songs_generated boolean DEFAULT false;
  END IF;

  -- Add constraint for valid preset types
  ALTER TABLE songs DROP CONSTRAINT IF EXISTS valid_preset_type;
  ALTER TABLE songs ADD CONSTRAINT valid_preset_type 
    CHECK (
      preset_type IS NULL OR 
      preset_type IN ('playing', 'eating', 'sleeping', 'pooping')
    );
END $$;
````

## File: supabase/migrations/20250221010539_calm_rain.sql
````sql
/*
  # Add Lyric Generation Support

  1. New Columns
    - `has_user_ideas` (boolean): Tracks if user provided custom lyric ideas
    - `user_lyric_input` (text): Stores the user's original lyric input/ideas
    - `generated_lyrics` (text): Stores the AI-generated lyrics
    - `is_instrumental` (boolean): Indicates if the song is instrumental

  2. Changes
    - Make `lyrics` column nullable since instrumental songs won't have lyrics
    - Add default values for new boolean columns
*/

DO $$ 
BEGIN
  -- Add has_user_ideas if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'has_user_ideas'
  ) THEN
    ALTER TABLE songs ADD COLUMN has_user_ideas boolean DEFAULT false;
  END IF;

  -- Add user_lyric_input if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'user_lyric_input'
  ) THEN
    ALTER TABLE songs ADD COLUMN user_lyric_input text;
  END IF;

  -- Add generated_lyrics if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'generated_lyrics'
  ) THEN
    ALTER TABLE songs ADD COLUMN generated_lyrics text;
  END IF;

  -- Add is_instrumental if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'is_instrumental'
  ) THEN
    ALTER TABLE songs ADD COLUMN is_instrumental boolean DEFAULT false;
  END IF;

  -- Make lyrics column nullable
  ALTER TABLE songs ALTER COLUMN lyrics DROP NOT NULL;
END $$;
````

## File: supabase/migrations/20250221014644_super_mouse.sql
````sql
/*
  # Add voice settings to songs table
  
  1. New Columns
    - voice_type (text): Stores the selected voice type
    - tempo (text): Stores the tempo setting
  
  2. Changes
    - Add constraints for valid voice types and tempos
*/

DO $$ 
BEGIN
  -- Add voice_type if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'voice_type'
  ) THEN
    ALTER TABLE songs ADD COLUMN voice_type text;
    
    -- Add check constraint for valid voice types if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_voice_type') THEN
      ALTER TABLE songs ADD CONSTRAINT valid_voice_type 
        CHECK (voice_type IN ('softFemale', 'calmMale') OR voice_type IS NULL);
    END IF;
  END IF;

  -- Add tempo if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'tempo'
  ) THEN
    ALTER TABLE songs ADD COLUMN tempo text;
    
    -- Add check constraint for valid tempos if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_tempo') THEN
      ALTER TABLE songs ADD CONSTRAINT valid_tempo 
        CHECK (tempo IN ('slow', 'medium', 'fast') OR tempo IS NULL);
    END IF;
  END IF;
END $$;
````

## File: supabase/migrations/20250221014651_warm_sea.sql
````sql
/*
  # Add generation history tracking
  
  1. New Table
    - song_generations: Tracks each generation attempt
      - id (uuid)
      - song_id (uuid)
      - status (song_status)
      - started_at (timestamptz)
      - completed_at (timestamptz)
      - error (text)
      - metadata (jsonb)
  
  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create song_generations table
CREATE TABLE IF NOT EXISTS song_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid REFERENCES songs ON DELETE CASCADE,
  status song_status NOT NULL DEFAULT 'pending',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  error text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE song_generations ENABLE ROW LEVEL SECURITY;

-- Add policies if they don't exist
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'song_generations' 
    AND policyname = 'Users can view own song generations'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view own song generations"
      ON song_generations
      FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_generations.song_id
        AND songs.user_id = auth.uid()
      ))';
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'song_generations' 
    AND policyname = 'Users can insert own song generations'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert own song generations"
      ON song_generations
      FOR INSERT
      WITH CHECK (EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_generations.song_id
        AND songs.user_id = auth.uid()
      ))';
  END IF;
END $$;
````

## File: supabase/migrations/20250222071320_aged_darkness.sql
````sql
/*
  # Create lyric generation errors table

  1. New Tables
    - `lyric_generation_errors`
      - `id` (uuid, primary key)
      - `error_message` (text)
      - `theme` (text, nullable)
      - `mood` (text, nullable)
      - `is_preset` (boolean)
      - `preset_type` (text, nullable)
      - `has_user_ideas` (boolean)
      - `has_user_input` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for authenticated users to insert errors
*/

-- Create the lyric generation errors table
CREATE TABLE IF NOT EXISTS lyric_generation_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  theme text,
  mood text,
  is_preset boolean DEFAULT false,
  preset_type text,
  has_user_ideas boolean DEFAULT false,
  has_user_input boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lyric_generation_errors ENABLE ROW LEVEL SECURITY;

-- Add policies if they don't exist
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lyric_generation_errors' 
    AND policyname = 'Users can insert lyric generation errors'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert lyric generation errors"
      ON lyric_generation_errors
      FOR INSERT
      TO authenticated
      WITH CHECK (true)';
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lyric_generation_errors' 
    AND policyname = 'Users can view lyric generation errors'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view lyric generation errors"
      ON lyric_generation_errors
      FOR SELECT
      TO authenticated
      USING (true)';
  END IF;
END $$;
````

## File: supabase/migrations/20250222223841_rough_cherry.sql
````sql
/*
  # Add song type enum and update songs table

  1. Changes
    - Create song_type enum with values: 'preset', 'theme', 'theme-with-input', 'from-scratch'
    - Add song_type column to songs table
    - Update existing songs to set appropriate song_type based on current flags
    - Remove redundant boolean flags

  2. Rollback Plan
    - Keep has_user_ideas column temporarily for safe rollback if needed
*/

-- Create song_type enum
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'song_type'
  ) THEN
    CREATE TYPE song_type AS ENUM (
      'preset',
      'theme',
      'theme-with-input',
      'from-scratch'
    );
  END IF;
END $$;

-- Add song_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'song_type'
  ) THEN
    ALTER TABLE songs ADD COLUMN song_type song_type;
    
    -- Update existing songs to set appropriate song_type
    UPDATE songs
    SET song_type = CASE
      WHEN is_preset THEN 'preset'::song_type
      WHEN theme IS NOT NULL AND NOT has_user_ideas THEN 'theme'::song_type
      WHEN theme IS NOT NULL AND has_user_ideas THEN 'theme-with-input'::song_type
      ELSE 'from-scratch'::song_type
    END;
    
    -- Make song_type NOT NULL after migration
    ALTER TABLE songs ALTER COLUMN song_type SET NOT NULL;
    
    -- Add index for performance if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE tablename = 'songs' AND indexname = 'idx_songs_song_type'
    ) THEN
      CREATE INDEX idx_songs_song_type ON songs(song_type);
    END IF;
  END IF;
END $$;

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration complete: Added song_type enum and updated songs table';
END $$;
````

## File: supabase/migrations/20250222223949_fading_grass.sql
````sql
/*
  # Update error logging and cleanup redundant flags

  1. Changes
    - Update lyric_generation_errors table to use song_type enum
    - Remove redundant boolean flags from songs table
    - Add constraints to ensure data integrity

  2. Security
    - Maintain existing RLS policies
*/

-- Update lyric_generation_errors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'song_type'
  ) THEN
    ALTER TABLE lyric_generation_errors 
      ADD COLUMN song_type song_type;
  END IF;
END $$;

-- Update existing error records
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'is_preset'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'has_user_ideas'
  ) THEN
    UPDATE lyric_generation_errors
    SET song_type = CASE
      WHEN is_preset THEN 'preset'::song_type
      WHEN theme IS NOT NULL AND NOT has_user_ideas THEN 'theme'::song_type
      WHEN theme IS NOT NULL AND has_user_ideas THEN 'theme-with-input'::song_type
      ELSE 'from-scratch'::song_type
    END
    WHERE song_type IS NULL;
  END IF;
END $$;

-- Remove redundant columns from lyric_generation_errors
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'is_preset'
  ) THEN
    ALTER TABLE lyric_generation_errors DROP COLUMN is_preset;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'has_user_ideas'
  ) THEN
    ALTER TABLE lyric_generation_errors DROP COLUMN has_user_ideas;
  END IF;
END $$;

-- Remove redundant columns from songs
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'has_user_ideas'
  ) THEN
    ALTER TABLE songs DROP COLUMN has_user_ideas;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'songs' AND column_name = 'is_preset'
  ) THEN
    ALTER TABLE songs DROP COLUMN is_preset;
  END IF;
END $$;

-- Add constraints to ensure data integrity
DO $$
BEGIN
  -- Add valid_song_type_theme constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_theme') THEN
    ALTER TABLE songs ADD CONSTRAINT valid_song_type_theme CHECK (
      (song_type IN ('theme', 'theme-with-input') AND theme IS NOT NULL) OR
      (song_type NOT IN ('theme', 'theme-with-input'))
    );
  END IF;
  
  -- Add valid_song_type_mood constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_mood') THEN
    ALTER TABLE songs ADD CONSTRAINT valid_song_type_mood CHECK (
      (song_type = 'from-scratch' AND mood IS NOT NULL) OR
      (song_type != 'from-scratch')
    );
  END IF;
END $$;

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration complete: Updated error logging and cleaned up redundant flags';
END $$;
````

## File: supabase/migrations/20250303195224_add_gender_to_profiles.sql
````sql
/*
  # Add Gender to Profiles Table

  1. Changes
    - Add gender column to profiles table
    - Add CHECK constraint to ensure gender is 'boy', 'girl', or 'other'
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add gender column to profiles table if it doesn't exist
DO $$ 
BEGIN
  -- Add gender if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender text;
    
    -- Add CHECK constraint to ensure valid values if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gender_check') THEN
      ALTER TABLE profiles ADD CONSTRAINT gender_check CHECK (gender IN ('boy', 'girl', 'other'));
    END IF;
  END IF;
END $$;
````

## File: supabase/migrations/20250303204200_database_schema_baseline.sql
````sql
/*
  # Database Schema Baseline
  
  This migration ensures that all tables are created with their current structure,
  without disrupting existing migrations. It uses IF NOT EXISTS clauses to ensure
  it works alongside other migrations.
  
  This file should be run in sequence with other migrations and does not require
  any special handling.
*/

-- Create enum types if they don't exist
DO $$ BEGIN
    -- song_type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'song_type') THEN
        CREATE TYPE song_type AS ENUM ('LULLABY', 'NURSERY', 'CUSTOM');
    END IF;

    -- status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
        CREATE TYPE status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
    END IF;
END $$;

-- Create songs table if it doesn't exist
CREATE TABLE IF NOT EXISTS songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    mood TEXT,
    instrument TEXT,
    voice_type TEXT,
    lyrics TEXT,
    audio_url TEXT,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error TEXT,
    task_id TEXT,
    preset_type TEXT,
    retryable BOOLEAN,
    theme TEXT,
    user_lyric_input TEXT,
    generated_lyrics TEXT,
    is_instrumental BOOLEAN,
    tempo TEXT,
    song_type song_type
);

-- Create song_variations table if it doesn't exist
CREATE TABLE IF NOT EXISTS song_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID REFERENCES songs(id),
    audio_url TEXT,
    title TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status status,
    retryable BOOLEAN
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    daily_generations INTEGER DEFAULT 0,
    last_generation_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    baby_name TEXT,
    preset_songs_generated BOOLEAN DEFAULT FALSE,
    preferred_language TEXT DEFAULT 'en',
    birth_month INTEGER,
    birth_year INTEGER,
    age_group TEXT,
    gender TEXT
);

-- Handle gender column: Make it NOT NULL if it exists
DO $$ 
BEGIN
  -- Check if the column exists and is nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender' 
    AND is_nullable = 'YES'
  ) THEN
    -- First update any NULL values to 'other'
    EXECUTE 'UPDATE profiles SET gender = ''other'' WHERE gender IS NULL';
    -- Then make it NOT NULL
    EXECUTE 'ALTER TABLE profiles ALTER COLUMN gender SET NOT NULL';
  -- If the column doesn't exist yet, add it as NOT NULL with default
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    EXECUTE 'ALTER TABLE profiles ADD COLUMN gender TEXT NOT NULL DEFAULT ''other''';
  END IF;
  
  -- Add CHECK constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'profiles' AND constraint_name = 'gender_check'
  ) THEN
    EXECUTE 'ALTER TABLE profiles ADD CONSTRAINT gender_check CHECK (gender IN (''boy'', ''girl'', ''other''))';
  END IF;
END $$;

-- Create song_generations table if it doesn't exist
CREATE TABLE IF NOT EXISTS song_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID REFERENCES songs(id),
    status status,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lyric_generation_errors table if it doesn't exist
CREATE TABLE IF NOT EXISTS lyric_generation_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_message TEXT,
    theme TEXT,
    mood TEXT,
    preset_type TEXT,
    has_user_input BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    song_type song_type
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_songs_user_id ON songs(user_id);
CREATE INDEX IF NOT EXISTS idx_song_variations_song_id ON song_variations(song_id);
CREATE INDEX IF NOT EXISTS idx_song_generations_song_id ON song_generations(song_id);
````

## File: supabase/migrations/20250304020456_make_gender_mandatory.sql
````sql
/*
  # Make Gender Mandatory in Profiles Table

  1. Changes
    - Update existing NULL gender values to 'other'
    - Make gender column NOT NULL
  
  2. Reason
    - Gender is required for proper pronoun usage in song lyrics
*/

-- First, set all NULL values to 'other' as the default
UPDATE profiles
SET gender = 'other'
WHERE gender IS NULL;

-- Then, alter the column to NOT NULL
ALTER TABLE profiles
ALTER COLUMN gender SET NOT NULL;
````

## File: supabase/migrations/20250306200022_baseline_schema.sql
````sql
/*
  # Baseline Schema
  
  This migration ensures the database has the correct schema structure for a fresh deployment.
  It creates all necessary tables, constraints, types, and functions if they don't already exist.
  All operations are idempotent, so this can be run on both new and existing databases.
  It also cleans up duplicate RLS policies and overrides any conflicting changes from previous migrations.
*/

-- First, drop all existing RLS policies to ensure clean slate
DO $$ 
BEGIN
  -- Drop all policies on profiles table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', policy_name);
    END LOOP;
  END;

  -- Drop all policies on songs table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'songs' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON songs', policy_name);
    END LOOP;
  END;

  -- Drop all policies on song_variations table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'song_variations' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON song_variations', policy_name);
    END LOOP;
  END;

  -- Drop all policies on song_generations table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'song_generations' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON song_generations', policy_name);
    END LOOP;
  END;

  -- Drop all policies on lyric_generation_errors table
  DECLARE
    policy_name text;
  BEGIN
    FOR policy_name IN (
      SELECT policyname FROM pg_policies WHERE tablename = 'lyric_generation_errors' AND schemaname = 'public'
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON lyric_generation_errors', policy_name);
    END LOOP;
  END;
END $$;

-- Create custom types if they don't exist
DO $$
BEGIN
  -- Create song_type enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'song_type') THEN
    CREATE TYPE song_type AS ENUM ('preset', 'theme', 'theme-with-input', 'from-scratch');
  END IF;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    is_premium boolean DEFAULT false,
    daily_generations integer DEFAULT 0,
    last_generation_date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    baby_name text,
    preset_songs_generated boolean DEFAULT false,
    preferred_language text DEFAULT 'en'::text,
    birth_month integer,
    birth_year integer,
    age_group text,
    gender text
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_pkey'
  ) THEN
    ALTER TABLE public.profiles ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_fkey'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add constraints to profiles table if they don't exist
DO $$
BEGIN
  -- Add gender_check constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gender_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT gender_check 
    CHECK (gender IS NULL OR gender IN ('boy', 'girl', 'other'));
  END IF;
  
  -- Add age_group_check constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_age_group_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_age_group_check 
    CHECK (age_group IN ('0-6', '7-12', '13-24'));
  END IF;
  
  -- Add birth_month_check constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_birth_month_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_birth_month_check 
    CHECK (birth_month >= 1 AND birth_month <= 12);
  END IF;
  
  -- Add birth_year_check constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_birth_year_check') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_birth_year_check 
    CHECK (birth_year >= 2020);
  END IF;
END $$;

-- Create songs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.songs (
    id uuid DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text,
    theme text,
    mood text,
    voice_type text,
    tempo text,
    song_type text,
    lyrics text,
    user_id uuid,
    status text DEFAULT 'generating'::text,
    audio_url text,
    user_lyric_input text,
    preset_type text,
    is_instrumental boolean DEFAULT false,
    retryable boolean DEFAULT true,
    error_message text,
    webhook_status text,
    webhook_received_at timestamptz,
    task_id text
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'songs_pkey'
  ) THEN
    ALTER TABLE public.songs ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add NOT NULL constraints if they don't exist
DO $$
BEGIN
  -- Check if name column is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'songs' 
    AND column_name = 'name' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.songs ALTER COLUMN name SET NOT NULL;
  END IF;
  
  -- Check if song_type column is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'songs' 
    AND column_name = 'song_type' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.songs ALTER COLUMN song_type SET NOT NULL;
  END IF;
  
  -- Check if user_id column is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'songs' 
    AND column_name = 'user_id' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.songs ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'songs_user_id_fkey'
  ) THEN
    ALTER TABLE public.songs ADD CONSTRAINT songs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add constraints to songs table if they don't exist
DO $$
BEGIN
  -- Add valid_tempo constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_tempo') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_tempo 
    CHECK (tempo IN ('slow', 'medium', 'fast') OR tempo IS NULL);
  END IF;
  
  -- Add valid_theme constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_theme') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_theme 
    CHECK (theme IN ('pitchDevelopment', 'cognitiveSpeech', 'sleepRegulation', 'socialEngagement', 'musicalDevelopment', 'indianClassical', 'westernClassical', 'custom') OR theme IS NULL);
  END IF;
  
  -- Add theme_or_mood_required constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'theme_or_mood_required') THEN
    ALTER TABLE public.songs ADD CONSTRAINT theme_or_mood_required 
    CHECK (theme IS NOT NULL OR mood IS NOT NULL);
  END IF;
  
  -- Add custom_theme_requires_mood constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_theme_requires_mood') THEN
    ALTER TABLE public.songs ADD CONSTRAINT custom_theme_requires_mood 
    CHECK (theme <> 'custom' OR (theme = 'custom' AND mood IS NOT NULL));
  END IF;
  
  -- Add valid_song_type_theme constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_theme') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_song_type_theme 
    CHECK ((song_type::song_type IN ('theme', 'theme-with-input') AND theme IS NOT NULL) OR song_type::song_type NOT IN ('theme', 'theme-with-input'));
  END IF;
  
  -- Add valid_song_type_mood constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_mood') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_song_type_mood 
    CHECK ((song_type::song_type = 'from-scratch' AND mood IS NOT NULL) OR song_type::song_type <> 'from-scratch');
  END IF;
END $$;

-- Create song_variations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.song_variations (
    id uuid DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    song_id uuid,
    audio_url text,
    status text DEFAULT 'generating'::text,
    error_message text,
    webhook_status text,
    webhook_received_at timestamptz
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'song_variations_pkey'
  ) THEN
    ALTER TABLE public.song_variations ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add NOT NULL constraints if they don't exist
DO $$
BEGIN
  -- Check if song_id column is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'song_variations' 
    AND column_name = 'song_id' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE public.song_variations ALTER COLUMN song_id SET NOT NULL;
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'song_variations_song_id_fkey'
  ) THEN
    ALTER TABLE public.song_variations ADD CONSTRAINT song_variations_song_id_fkey 
    FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create song_generations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.song_generations (
    id uuid DEFAULT gen_random_uuid(),
    song_id uuid,
    status text DEFAULT 'pending'::text,
    started_at timestamptz,
    completed_at timestamptz,
    error text,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'song_generations_pkey'
  ) THEN
    ALTER TABLE public.song_generations ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'song_generations_song_id_fkey'
  ) THEN
    ALTER TABLE public.song_generations ADD CONSTRAINT song_generations_song_id_fkey 
    FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create lyric_generation_errors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lyric_generation_errors (
    id uuid DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    error_message text,
    theme text,
    mood text,
    preset_type text,
    song_type song_type
);

-- Add primary key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lyric_generation_errors_pkey'
  ) THEN
    ALTER TABLE public.lyric_generation_errors ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add song_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lyric_generation_errors' AND column_name = 'song_id'
  ) THEN
    ALTER TABLE public.lyric_generation_errors ADD COLUMN song_id uuid;
  END IF;
END $$;

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lyric_generation_errors_song_id_fkey'
  ) THEN
    ALTER TABLE public.lyric_generation_errors ADD CONSTRAINT lyric_generation_errors_song_id_fkey 
    FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create log_webhook_status function if it doesn't exist
CREATE OR REPLACE FUNCTION public.log_webhook_status()
RETURNS trigger AS $$
BEGIN
  -- Log status changes in a clear format
  RAISE NOTICE E'\n##### Status now: % ######\n', NEW.status;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create handle_user_deletion function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS trigger AS $$
BEGIN
  -- Delete profile (which will cascade to songs and variations)
  DELETE FROM public.profiles WHERE id = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create handle_new_user function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create webhook_status_logger trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'webhook_status_logger'
  ) THEN
    CREATE TRIGGER webhook_status_logger
    BEFORE UPDATE ON public.songs
    FOR EACH ROW
    EXECUTE FUNCTION public.log_webhook_status();
  END IF;
END $$;

-- Create on_auth_user_created trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Create on_auth_user_deleted trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_deleted'
  ) THEN
    CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_deletion();
  END IF;
END $$;

-- Create consistent RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create consistent RLS policies for songs table
CREATE POLICY "Users can view their own songs" 
ON songs FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own songs" 
ON songs FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own songs" 
ON songs FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own songs" 
ON songs FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create RLS policies for song_variations table
CREATE POLICY "Users can view their own song variations" 
ON song_variations FOR SELECT 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own song variations" 
ON song_variations FOR INSERT 
TO authenticated
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own song variations" 
ON song_variations FOR UPDATE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()))
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own song variations" 
ON song_variations FOR DELETE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

-- Create RLS policies for song_generations table
CREATE POLICY "Users can view their own song generations" 
ON song_generations FOR SELECT 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own song generations" 
ON song_generations FOR INSERT 
TO authenticated
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own song generations" 
ON song_generations FOR UPDATE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()))
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own song generations" 
ON song_generations FOR DELETE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

-- Create RLS policies for lyric_generation_errors table
CREATE POLICY "Users can view their own lyric generation errors" 
ON lyric_generation_errors FOR SELECT 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own lyric generation errors" 
ON lyric_generation_errors FOR INSERT 
TO authenticated
WITH CHECK (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own lyric generation errors" 
ON lyric_generation_errors FOR DELETE 
TO authenticated
USING (song_id IN (SELECT id FROM songs WHERE user_id = auth.uid()));

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyric_generation_errors ENABLE ROW LEVEL SECURITY;
````

## File: supabase/migrations/20250306222659_drop_auto_profile_trigger.sql
````sql
/*
  # Drop Automatic Profile Creation Trigger
  
  This migration removes the automatic trigger that creates profiles when users are created.
  This allows the application code to have full control over profile creation.
*/

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Keep the function for reference, but it won't be used automatically
-- We could drop it, but keeping it allows us to manually invoke it if needed
-- DROP FUNCTION IF EXISTS public.handle_new_user();

-- Add a comment to the function to indicate it's no longer used automatically
COMMENT ON FUNCTION public.handle_new_user() IS 'This function was previously used by a trigger to automatically create profiles. It is now kept for reference but not used automatically.';
````

## File: supabase/migrations/20250306224039_allow_null_gender.sql
````sql
/*
  # Allow NULL Values for Gender in Profiles Table

  1. Changes
    - Remove NOT NULL constraint from gender column
    - Update gender_check constraint to allow NULL values
  
  2. Reason
    - Allow users to skip providing gender information
*/

-- First, drop the existing gender_check constraint
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS gender_check;

-- Re-add the constraint to allow NULL values
ALTER TABLE profiles
ADD CONSTRAINT gender_check CHECK (gender IS NULL OR gender IN ('boy', 'girl', 'other'));

-- Remove the NOT NULL constraint from the gender column
ALTER TABLE profiles
ALTER COLUMN gender DROP NOT NULL;
````

## File: supabase/migrations/20250307172057_cleanup_status_fields_and_logs.sql
````sql
-- Drop the song_state_logs table and its related triggers/functions
DROP TABLE IF EXISTS song_state_logs;
DROP TRIGGER IF EXISTS webhook_status_logger ON songs;
DROP FUNCTION IF EXISTS log_status_changes();

-- Remove status columns from song_variations and song_generations tables
ALTER TABLE song_variations DROP COLUMN IF EXISTS status;
ALTER TABLE song_generations DROP COLUMN IF EXISTS status;

-- Add a comment to the songs table to document the state model
COMMENT ON TABLE songs IS 'Songs table with state determined by SongStateService based on task_id, audio_url, and error fields:
- Generating: has task_id, no audio_url, no error
- Completed: has audio_url
- Failed: has error';
````

## File: supabase/migrations/20250316000000_fix_profile_and_song_issues.sql
````sql
/*
  # Fix Profile Creation and Song Update Issues
  
  1. Changes
    - Recreate the missing trigger for automatic profile creation
    - Add fallback mechanisms for profile creation and song updates
    - Clean up existing data to start fresh
    - Add verification functions to prevent future issues
*/

-- First, clean up existing data (commented out for safety - uncomment if needed)
-- DELETE FROM songs;
-- DELETE FROM profiles;

-- Create the handle_new_user function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $func$
BEGIN
  INSERT INTO public.profiles (id, email, baby_name, preferred_language, created_at, preset_songs_generated)
  VALUES (
    new.id, 
    new.email, 
    SPLIT_PART(new.email, '@', 1), -- Default baby name from email
    'en', -- Default language
    NOW(),
    true
  );
  RETURN new;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger
DO $do_block$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END;
$do_block$;

-- Add a check function to verify the trigger is working
CREATE OR REPLACE FUNCTION check_profile_trigger_exists()
RETURNS boolean AS $func$
DECLARE
  trigger_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
    AND tgrelid = 'auth.users'::regclass
  ) INTO trigger_exists;
  
  RETURN trigger_exists;
END;
$func$ LANGUAGE plpgsql;

-- Create a function for fallback profile creation
CREATE OR REPLACE FUNCTION create_profile_fallback(
  user_id UUID,
  user_email TEXT,
  user_baby_name TEXT
) RETURNS VOID AS $func$
BEGIN
  -- Check if profile already exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    -- Insert the profile
    INSERT INTO profiles (
      id, 
      email, 
      baby_name, 
      created_at, 
      preferred_language,
      preset_songs_generated
    ) VALUES (
      user_id,
      user_email,
      user_baby_name,
      NOW(),
      'en',
      true
    );
    
    -- Log the fallback creation
    RAISE NOTICE 'Created fallback profile for user %', user_id;
  ELSE
    RAISE NOTICE 'Profile already exists for user %', user_id;
  END IF;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to force update song audio
CREATE OR REPLACE FUNCTION force_update_song_audio(
  song_id UUID,
  audio_url TEXT
) RETURNS BOOLEAN AS $func$
DECLARE
  success BOOLEAN;
BEGIN
  -- Direct update using a different method
  UPDATE songs
  SET 
    audio_url = force_update_song_audio.audio_url,
    error = NULL,
    task_id = NULL,
    updated_at = NOW()
  WHERE id = song_id;
  
  -- Check if the update was successful
  SELECT EXISTS (
    SELECT 1 FROM songs WHERE id = song_id AND audio_url = force_update_song_audio.audio_url
  ) INTO success;
  
  -- Log the result
  IF success THEN
    RAISE NOTICE 'Successfully forced audio update for song %', song_id;
  ELSE
    RAISE NOTICE 'Failed to force audio update for song %', song_id;
  END IF;
  
  RETURN success;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a function to check for songs with missing audio URLs
CREATE OR REPLACE FUNCTION check_songs_with_missing_audio()
RETURNS TABLE (
  id UUID,
  name TEXT,
  task_id TEXT,
  created_at TIMESTAMPTZ,
  age_hours NUMERIC
) AS $func$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.task_id,
    s.created_at,
    EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 AS age_hours
  FROM songs s
  WHERE s.audio_url IS NULL
  AND s.created_at < NOW() - INTERVAL '1 hour'
  ORDER BY s.created_at DESC;
END;
$func$ LANGUAGE plpgsql;

-- Comprehensive cleanup of all legacy status-related items

-- Drop triggers and functions related to the old status system
DROP TRIGGER IF EXISTS webhook_status_logger ON songs;
DROP TRIGGER IF EXISTS song_state_logger ON songs;
DROP FUNCTION IF EXISTS log_webhook_status();
DROP FUNCTION IF EXISTS log_status_changes();
DROP FUNCTION IF EXISTS log_song_state_changes();

-- Drop unused status columns from songs table
ALTER TABLE songs DROP COLUMN IF EXISTS status;
ALTER TABLE songs DROP COLUMN IF EXISTS webhook_status;
ALTER TABLE songs DROP COLUMN IF EXISTS webhook_received_at;
ALTER TABLE songs DROP COLUMN IF EXISTS error_message; -- App now uses 'error' column

-- Clean up song_variations table
ALTER TABLE song_variations DROP COLUMN IF EXISTS status;
ALTER TABLE song_variations DROP COLUMN IF EXISTS webhook_status;
ALTER TABLE song_variations DROP COLUMN IF EXISTS webhook_received_at;

-- Clean up or drop unused tables
-- The song_generations table is not actively used by the application code
DROP TABLE IF EXISTS song_generations;

-- Drop enum types that are no longer needed
DROP TYPE IF EXISTS song_status;
DROP TYPE IF EXISTS status; -- Old enum from baseline schema
````

## File: supabase/migrations/20250316145618_schema_baseline_complete.sql
````sql
/*
  # Complete Schema Baseline

  This is a comprehensive baseline of the entire database schema.
  It creates all tables, functions, triggers, and types from scratch.
  
  Use this file as the source of truth for the database schema.
  
  All statements are idempotent (using IF EXISTS/IF NOT EXISTS) to ensure
  safe execution in any environment.
*/

-- ==============================================================
-- PART 1: DROP ALL EXISTING TRIGGERS AND FUNCTIONS
-- Make sure to drop dependent objects before their parents
-- ==============================================================

-- Drop all triggers first (they depend on functions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Drop all functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_user_deletion();
DROP FUNCTION IF EXISTS check_profile_trigger_exists();
DROP FUNCTION IF EXISTS create_profile_fallback(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS force_update_song_audio(UUID, TEXT);
DROP FUNCTION IF EXISTS check_songs_with_missing_audio();

-- ==============================================================
-- PART 2: RECREATE TYPE DEFINITIONS
-- ==============================================================

-- Recreate song_type enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'song_type') THEN
    CREATE TYPE song_type AS ENUM ('preset', 'theme', 'theme-with-input', 'from-scratch');
  END IF;
END $$;

-- ==============================================================
-- PART 3: CREATE OR REPLACE FUNCTIONS
-- ==============================================================

-- Create the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $func$
BEGIN
  INSERT INTO public.profiles (id, email, baby_name, preferred_language, created_at, preset_songs_generated)
  VALUES (
    new.id, 
    new.email, 
    SPLIT_PART(new.email, '@', 1), -- Default baby name from email
    'en', -- Default language
    NOW(),
    true
  );
  RETURN new;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the handle_user_deletion function
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS trigger AS $$
BEGIN
  -- Delete profile (which will cascade to songs and variations)
  DELETE FROM public.profiles WHERE id = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create check_profile_trigger_exists function
CREATE OR REPLACE FUNCTION check_profile_trigger_exists()
RETURNS boolean AS $func$
DECLARE
  trigger_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
    AND tgrelid = 'auth.users'::regclass
  ) INTO trigger_exists;
  
  RETURN trigger_exists;
END;
$func$ LANGUAGE plpgsql;

-- Create profile fallback function
CREATE OR REPLACE FUNCTION create_profile_fallback(
  user_id UUID,
  user_email TEXT,
  user_baby_name TEXT
) RETURNS VOID AS $func$
BEGIN
  -- Check if profile already exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    -- Insert the profile
    INSERT INTO profiles (
      id, 
      email, 
      baby_name, 
      created_at, 
      preferred_language,
      preset_songs_generated
    ) VALUES (
      user_id,
      user_email,
      user_baby_name,
      NOW(),
      'en',
      true
    );
    
    -- Log the fallback creation
    RAISE NOTICE 'Created fallback profile for user %', user_id;
  ELSE
    RAISE NOTICE 'Profile already exists for user %', user_id;
  END IF;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to force update song audio
CREATE OR REPLACE FUNCTION force_update_song_audio(
  song_id UUID,
  audio_url TEXT
) RETURNS BOOLEAN AS $func$
DECLARE
  success BOOLEAN;
BEGIN
  -- Direct update using a different method
  UPDATE songs
  SET 
    audio_url = force_update_song_audio.audio_url,
    error = NULL,
    task_id = NULL,
    updated_at = NOW()
  WHERE id = song_id;
  
  -- Check if the update was successful
  SELECT EXISTS (
    SELECT 1 FROM songs WHERE id = song_id AND audio_url = force_update_song_audio.audio_url
  ) INTO success;
  
  -- Log the result
  IF success THEN
    RAISE NOTICE 'Successfully forced audio update for song %', song_id;
  ELSE
    RAISE NOTICE 'Failed to force audio update for song %', song_id;
  END IF;
  
  RETURN success;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a function to check for songs with missing audio URLs
CREATE OR REPLACE FUNCTION check_songs_with_missing_audio()
RETURNS TABLE (
  id UUID,
  name TEXT,
  task_id TEXT,
  created_at TIMESTAMPTZ,
  age_hours NUMERIC
) AS $func$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.task_id,
    s.created_at,
    EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 AS age_hours
  FROM songs s
  WHERE s.audio_url IS NULL
  AND s.created_at < NOW() - INTERVAL '1 hour'
  ORDER BY s.created_at DESC;
END;
$func$ LANGUAGE plpgsql;

-- ==============================================================
-- PART 4: CREATE TABLES
-- ==============================================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  baby_name text,
  birth_month integer,
  birth_year integer,
  age_group text,
  gender text,
  preferred_language text DEFAULT 'en'::text,
  created_at timestamptz DEFAULT now(),
  preset_songs_generated boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  daily_generations integer DEFAULT 0,
  last_generation_date timestamptz
);

COMMENT ON TABLE public.profiles IS 'User profiles containing baby information and preferences';

-- Create songs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  theme text,
  mood text,
  voice_type text,
  tempo text,
  song_type song_type NOT NULL,
  lyrics text,
  audio_url text,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_lyric_input text,
  preset_type text,
  is_instrumental boolean DEFAULT false,
  retryable boolean DEFAULT false,
  error text,
  task_id text,
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.songs IS 'Songs table with state determined by SongStateService based on task_id, audio_url, and error fields:
- Generating: has task_id, no audio_url, no error
- Completed: has audio_url
- Failed: has error';

-- Create song_variations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.song_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  audio_url text,
  title text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  retryable boolean DEFAULT false
);

COMMENT ON TABLE public.song_variations IS 'Variations of songs with different audio renditions';

-- Create lyric_generation_errors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lyric_generation_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  theme text,
  mood text,
  preset_type text,
  has_user_input boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  song_id uuid REFERENCES public.songs(id) ON DELETE CASCADE,
  song_type song_type
);

COMMENT ON TABLE public.lyric_generation_errors IS 'Logs of errors that occur during lyric generation';

-- ==============================================================
-- PART 5: CREATE CONSTRAINTS AND INDEXES
-- ==============================================================

-- Add constraints to songs table if they don't exist
DO $$
BEGIN
  -- Valid tempo constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_tempo') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_tempo
    CHECK (tempo IS NULL OR tempo IN ('slow', 'medium', 'fast'));
  END IF;

  -- Valid theme constraint  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_theme') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_theme
    CHECK (theme IS NULL OR theme IN ('pitchDevelopment', 'cognitiveSpeech', 'sleepRegulation', 'socialEngagement', 'indianClassical', 'westernClassical'));
  END IF;

  -- Theme or mood required constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'theme_or_mood_required') THEN
    ALTER TABLE public.songs ADD CONSTRAINT theme_or_mood_required
    CHECK (
      (song_type IN ('preset', 'theme', 'theme-with-input') AND (theme IS NOT NULL OR mood IS NOT NULL)) OR
      (song_type = 'from-scratch')
    );
  END IF;

  -- Custom theme requires mood constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_theme_requires_mood') THEN
    ALTER TABLE public.songs ADD CONSTRAINT custom_theme_requires_mood
    CHECK (
      (theme IS NULL) OR (theme IS NOT NULL AND mood IS NOT NULL)
    );
  END IF;

  -- Valid song type theme constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_theme') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_song_type_theme
    CHECK (
      (song_type != 'theme' AND song_type != 'theme-with-input') OR
      (song_type IN ('theme', 'theme-with-input') AND theme IS NOT NULL)
    );
  END IF;

  -- Valid song type mood constraint
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_song_type_mood') THEN
    ALTER TABLE public.songs ADD CONSTRAINT valid_song_type_mood
    CHECK (
      (song_type != 'from-scratch') OR
      (song_type = 'from-scratch' AND mood IS NOT NULL)
    );
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'songs' AND indexname = 'idx_songs_user_id'
  ) THEN
    CREATE INDEX idx_songs_user_id ON songs(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'songs' AND indexname = 'idx_songs_song_type'
  ) THEN
    CREATE INDEX idx_songs_song_type ON songs(song_type);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'song_variations' AND indexname = 'idx_song_variations_song_id'
  ) THEN
    CREATE INDEX idx_song_variations_song_id ON song_variations(song_id);
  END IF;
END $$;

-- ==============================================================
-- PART 6: CREATE TRIGGERS
-- ==============================================================

-- Create triggers if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_deleted'
  ) THEN
    CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_user_deletion();
  END IF;
END $$;

-- ==============================================================
-- PART 7: ENABLE ROW LEVEL SECURITY
-- ==============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyric_generation_errors ENABLE ROW LEVEL SECURITY;

-- ==============================================================
-- PART 8: CREATE RLS POLICIES
-- ==============================================================

-- Create RLS policies for profiles table
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_select_policy') THEN
    CREATE POLICY profiles_select_policy ON profiles
    FOR SELECT USING (
      auth.uid() = id
    );
  END IF;

  -- INSERT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_insert_policy') THEN
    CREATE POLICY profiles_insert_policy ON profiles
    FOR INSERT WITH CHECK (
      auth.uid() = id
    );
  END IF;
  
  -- UPDATE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_update_policy') THEN
    CREATE POLICY profiles_update_policy ON profiles
    FOR UPDATE USING (
      auth.uid() = id
    );
  END IF;
  
  -- DELETE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_delete_policy') THEN
    CREATE POLICY profiles_delete_policy ON profiles
    FOR DELETE USING (
      auth.uid() = id
    );
  END IF;
END $$;

-- Create RLS policies for songs table
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'songs_select_policy') THEN
    CREATE POLICY songs_select_policy ON songs
    FOR SELECT USING (
      auth.uid() = user_id
    );
  END IF;

  -- INSERT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'songs_insert_policy') THEN
    CREATE POLICY songs_insert_policy ON songs
    FOR INSERT WITH CHECK (
      auth.uid() = user_id
    );
  END IF;
  
  -- UPDATE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'songs_update_policy') THEN
    CREATE POLICY songs_update_policy ON songs
    FOR UPDATE USING (
      auth.uid() = user_id
    );
  END IF;
  
  -- DELETE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'songs' AND policyname = 'songs_delete_policy') THEN
    CREATE POLICY songs_delete_policy ON songs
    FOR DELETE USING (
      auth.uid() = user_id
    );
  END IF;
END $$;

-- Create RLS policies for song_variations table
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'song_variations' AND policyname = 'song_variations_select_policy') THEN
    CREATE POLICY song_variations_select_policy ON song_variations
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_variations.song_id
        AND songs.user_id = auth.uid()
      )
    );
  END IF;

  -- INSERT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'song_variations' AND policyname = 'song_variations_insert_policy') THEN
    CREATE POLICY song_variations_insert_policy ON song_variations
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_variations.song_id
        AND songs.user_id = auth.uid()
      )
    );
  END IF;
  
  -- UPDATE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'song_variations' AND policyname = 'song_variations_update_policy') THEN
    CREATE POLICY song_variations_update_policy ON song_variations
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_variations.song_id
        AND songs.user_id = auth.uid()
      )
    );
  END IF;
  
  -- DELETE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'song_variations' AND policyname = 'song_variations_delete_policy') THEN
    CREATE POLICY song_variations_delete_policy ON song_variations
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM songs
        WHERE songs.id = song_variations.song_id
        AND songs.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Create RLS policies for lyric_generation_errors table
DO $$
BEGIN
  -- Admin-only SELECT policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lyric_generation_errors' AND policyname = 'lyric_generation_errors_select_policy') THEN
    CREATE POLICY lyric_generation_errors_select_policy ON lyric_generation_errors
    FOR SELECT USING (
      auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
  END IF;

  -- INSERT policy - anyone can insert errors
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lyric_generation_errors' AND policyname = 'lyric_generation_errors_insert_policy') THEN
    CREATE POLICY lyric_generation_errors_insert_policy ON lyric_generation_errors
    FOR INSERT WITH CHECK (true);
  END IF;
  
  -- Admin-only DELETE policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lyric_generation_errors' AND policyname = 'lyric_generation_errors_delete_policy') THEN
    CREATE POLICY lyric_generation_errors_delete_policy ON lyric_generation_errors
    FOR DELETE USING (
      auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
  END IF;
END $$;
````

## File: supabase/.gitignore
````
# Supabase
.branches
.temp

# dotenvx
.env.keys
.env.local
.env.*.local
````

## File: supabase/config.toml
````toml
# For detailed configuration reference documentation, visit:
# https://supabase.com/docs/guides/local-development/cli/config
# A string used to distinguish different Supabase projects on the same host. Defaults to the
# working directory name when running `supabase init`.
project_id = "BabyMusic-AI"

[api]
enabled = true
# Port to use for the API URL.
port = 54321
# Schemas to expose in your API. Tables, views and stored procedures in this schema will get API
# endpoints. `public` and `graphql_public` schemas are included by default.
schemas = ["public", "graphql_public"]
# Extra schemas to add to the search_path of every request.
extra_search_path = ["public", "extensions"]
# The maximum number of rows returns from a view, table, or stored procedure. Limits payload size
# for accidental or malicious requests.
max_rows = 1000

[api.tls]
# Enable HTTPS endpoints locally using a self-signed certificate.
enabled = false

[db]
# Port to use for the local database URL.
port = 54322
# Port used by db diff command to initialize the shadow database.
shadow_port = 54320
# The database major version to use. This has to be the same as your remote database's. Run `SHOW
# server_version;` on the remote database to check.
major_version = 15

[db.pooler]
enabled = false
# Port to use for the local connection pooler.
port = 54329
# Specifies when a server connection can be reused by other clients.
# Configure one of the supported pooler modes: `transaction`, `session`.
pool_mode = "transaction"
# How many server connections to allow per user/database pair.
default_pool_size = 20
# Maximum number of client connections allowed.
max_client_conn = 100

# [db.vault]
# secret_key = "env(SECRET_VALUE)"

[db.migrations]
# Specifies an ordered list of schema files that describe your database.
# Supports glob patterns relative to supabase directory: "./schemas/*.sql"
schema_paths = []

[db.seed]
# If enabled, seeds the database after migrations during a db reset.
enabled = true
# Specifies an ordered list of seed files to load during db reset.
# Supports glob patterns relative to supabase directory: "./seeds/*.sql"
sql_paths = ["./seed.sql"]

[realtime]
enabled = true
# Bind realtime via either IPv4 or IPv6. (default: IPv4)
# ip_version = "IPv6"
# The maximum length in bytes of HTTP request headers. (default: 4096)
# max_header_length = 4096

[studio]
enabled = true
# Port to use for Supabase Studio.
port = 54323
# External URL of the API server that frontend connects to.
api_url = "http://127.0.0.1"
# OpenAI API Key to use for Supabase AI in the Supabase Studio.
openai_api_key = "env(OPENAI_API_KEY)"

# Email testing server. Emails sent with the local dev setup are not actually sent - rather, they
# are monitored, and you can view the emails that would have been sent from the web interface.
[inbucket]
enabled = true
# Port to use for the email testing server web interface.
port = 54324
# Uncomment to expose additional ports for testing user applications that send emails.
# smtp_port = 54325
# pop3_port = 54326
# admin_email = "admin@email.com"
# sender_name = "Admin"

[storage]
enabled = true
# The maximum file size allowed (e.g. "5MB", "500KB").
file_size_limit = "50MiB"

# Image transformation API is available to Supabase Pro plan.
# [storage.image_transformation]
# enabled = true

# Uncomment to configure local storage buckets
# [storage.buckets.images]
# public = false
# file_size_limit = "50MiB"
# allowed_mime_types = ["image/png", "image/jpeg"]
# objects_path = "./images"

[auth]
enabled = true
# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
# in emails.
site_url = "http://127.0.0.1:3000"
# A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
additional_redirect_urls = ["https://127.0.0.1:3000"]
# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 (1 week).
jwt_expiry = 3600
# If disabled, the refresh token will never expire.
enable_refresh_token_rotation = true
# Allows refresh tokens to be reused after expiry, up to the specified interval in seconds.
# Requires enable_refresh_token_rotation = true.
refresh_token_reuse_interval = 10
# Allow/disallow new user signups to your project.
enable_signup = true
# Allow/disallow anonymous sign-ins to your project.
enable_anonymous_sign_ins = false
# Allow/disallow testing manual linking of accounts
enable_manual_linking = false
# Passwords shorter than this value will be rejected as weak. Minimum 6, recommended 8 or more.
minimum_password_length = 6
# Passwords that do not meet the following requirements will be rejected as weak. Supported values
# are: `letters_digits`, `lower_upper_letters_digits`, `lower_upper_letters_digits_symbols`
password_requirements = ""

# Configure one of the supported captcha providers: `hcaptcha`, `turnstile`.
# [auth.captcha]
# enabled = true
# provider = "hcaptcha"
# secret = ""

[auth.email]
# Allow/disallow new user signups via email to your project.
enable_signup = true
# If enabled, a user will be required to confirm any email change on both the old, and new email
# addresses. If disabled, only the new email is required to confirm.
double_confirm_changes = true
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = false
# If enabled, users will need to reauthenticate or have logged in recently to change their password.
secure_password_change = false
# Controls the minimum amount of time that must pass before sending another signup confirmation or password reset email.
max_frequency = "1s"
# Number of characters used in the email OTP.
otp_length = 6
# Number of seconds before the email OTP expires (defaults to 1 hour).
otp_expiry = 3600

# Use a production-ready SMTP server
# [auth.email.smtp]
# enabled = true
# host = "smtp.sendgrid.net"
# port = 587
# user = "apikey"
# pass = "env(SENDGRID_API_KEY)"
# admin_email = "admin@email.com"
# sender_name = "Admin"

# Uncomment to customize email template
# [auth.email.template.invite]
# subject = "You have been invited"
# content_path = "./supabase/templates/invite.html"

[auth.sms]
# Allow/disallow new user signups via SMS to your project.
enable_signup = false
# If enabled, users need to confirm their phone number before signing in.
enable_confirmations = false
# Template for sending OTP to users
template = "Your code is {{ .Code }}"
# Controls the minimum amount of time that must pass before sending another sms otp.
max_frequency = "5s"

# Use pre-defined map of phone number to OTP for testing.
# [auth.sms.test_otp]
# 4152127777 = "123456"

# Configure logged in session timeouts.
# [auth.sessions]
# Force log out after the specified duration.
# timebox = "24h"
# Force log out if the user has been inactive longer than the specified duration.
# inactivity_timeout = "8h"

# This hook runs before a token is issued and allows you to add additional claims based on the authentication method used.
# [auth.hook.custom_access_token]
# enabled = true
# uri = "pg-functions://<database>/<schema>/<hook_name>"

# Configure one of the supported SMS providers: `twilio`, `twilio_verify`, `messagebird`, `textlocal`, `vonage`.
[auth.sms.twilio]
enabled = false
account_sid = ""
message_service_sid = ""
# DO NOT commit your Twilio auth token to git. Use environment variable substitution instead:
auth_token = "env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)"

# Multi-factor-authentication is available to Supabase Pro plan.
[auth.mfa]
# Control how many MFA factors can be enrolled at once per user.
max_enrolled_factors = 10

# Control MFA via App Authenticator (TOTP)
[auth.mfa.totp]
enroll_enabled = false
verify_enabled = false

# Configure MFA via Phone Messaging
[auth.mfa.phone]
enroll_enabled = false
verify_enabled = false
otp_length = 6
template = "Your code is {{ .Code }}"
max_frequency = "5s"

# Configure MFA via WebAuthn
# [auth.mfa.web_authn]
# enroll_enabled = true
# verify_enabled = true

# Use an external OAuth provider. The full list of providers are: `apple`, `azure`, `bitbucket`,
# `discord`, `facebook`, `github`, `gitlab`, `google`, `keycloak`, `linkedin_oidc`, `notion`, `twitch`,
# `twitter`, `slack`, `spotify`, `workos`, `zoom`.
[auth.external.apple]
enabled = false
client_id = ""
# DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead:
secret = "env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)"
# Overrides the default auth redirectUrl.
redirect_uri = ""
# Overrides the default auth provider URL. Used to support self-hosted gitlab, single-tenant Azure,
# or any other third-party OIDC providers.
url = ""
# If enabled, the nonce check will be skipped. Required for local sign in with Google auth.
skip_nonce_check = false

# Use Firebase Auth as a third-party provider alongside Supabase Auth.
[auth.third_party.firebase]
enabled = false
# project_id = "my-firebase-project"

# Use Auth0 as a third-party provider alongside Supabase Auth.
[auth.third_party.auth0]
enabled = false
# tenant = "my-auth0-tenant"
# tenant_region = "us"

# Use AWS Cognito (Amplify) as a third-party provider alongside Supabase Auth.
[auth.third_party.aws_cognito]
enabled = false
# user_pool_id = "my-user-pool-id"
# user_pool_region = "us-east-1"

[edge_runtime]
enabled = true
# Configure one of the supported request policies: `oneshot`, `per_worker`.
# Use `oneshot` for hot reload, or `per_worker` for load testing.
policy = "oneshot"
# Port to attach the Chrome inspector for debugging edge functions.
inspector_port = 8083

# Use these configurations to customize your Edge Function.
# [functions.MY_FUNCTION_NAME]
# enabled = true
# verify_jwt = true
# import_map = "./functions/MY_FUNCTION_NAME/deno.json"
# Uncomment to specify a custom file path to the entrypoint.
# Supported file extensions are: .ts, .js, .mjs, .jsx, .tsx
# entrypoint = "./functions/MY_FUNCTION_NAME/index.ts"
# Specifies static files to be bundled with the function. Supports glob patterns.
# For example, if you want to serve static HTML pages in your function:
# static_files = [ "./functions/MY_FUNCTION_NAME/*.html" ]

[analytics]
enabled = true
port = 54327
# Configure one of the supported backends: `postgres`, `bigquery`.
backend = "postgres"

# Experimental features may be deprecated any time
[experimental]
# Configures Postgres storage engine to use OrioleDB (S3)
orioledb_version = ""
# Configures S3 bucket URL, eg. <bucket_name>.s3-<region>.amazonaws.com
s3_host = "env(S3_HOST)"
# Configures S3 bucket region, eg. us-east-1
s3_region = "env(S3_REGION)"
# Configures AWS_ACCESS_KEY_ID for S3 bucket
s3_access_key = "env(S3_ACCESS_KEY)"
# Configures AWS_SECRET_ACCESS_KEY for S3 bucket
s3_secret_key = "env(S3_SECRET_KEY)"
````

## File: .eslintrc.cjs
````
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    'react/react-in-jsx-scope': 'off',
    // Disable errors for missing React import
    '@typescript-eslint/ban-ts-comment': 'off'
  },
}
````

## File: .gitignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
# Local Netlify folder
.netlify
````

## File: claude_api.md
````markdown
# Anthropic

# Shared

Types:

- <code><a href="./src/resources/shared.ts">APIErrorObject</a></code>
- <code><a href="./src/resources/shared.ts">AuthenticationError</a></code>
- <code><a href="./src/resources/shared.ts">BillingError</a></code>
- <code><a href="./src/resources/shared.ts">ErrorObject</a></code>
- <code><a href="./src/resources/shared.ts">ErrorResponse</a></code>
- <code><a href="./src/resources/shared.ts">GatewayTimeoutError</a></code>
- <code><a href="./src/resources/shared.ts">InvalidRequestError</a></code>
- <code><a href="./src/resources/shared.ts">NotFoundError</a></code>
- <code><a href="./src/resources/shared.ts">OverloadedError</a></code>
- <code><a href="./src/resources/shared.ts">PermissionError</a></code>
- <code><a href="./src/resources/shared.ts">RateLimitError</a></code>

# Messages

Types:

- <code><a href="./src/resources/messages/messages.ts">Base64PDFSource</a></code>
- <code><a href="./src/resources/messages/messages.ts">CacheControlEphemeral</a></code>
- <code><a href="./src/resources/messages/messages.ts">CitationCharLocation</a></code>
- <code><a href="./src/resources/messages/messages.ts">CitationCharLocationParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">CitationContentBlockLocation</a></code>
- <code><a href="./src/resources/messages/messages.ts">CitationContentBlockLocationParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">CitationPageLocation</a></code>
- <code><a href="./src/resources/messages/messages.ts">CitationPageLocationParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">CitationsConfigParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">CitationsDelta</a></code>
- <code><a href="./src/resources/messages/messages.ts">ContentBlock</a></code>
- <code><a href="./src/resources/messages/messages.ts">ContentBlockDeltaEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">ContentBlockParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">ContentBlockSource</a></code>
- <code><a href="./src/resources/messages/messages.ts">ContentBlockSourceContent</a></code>
- <code><a href="./src/resources/messages/messages.ts">ContentBlockStartEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">ContentBlockStopEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">DocumentBlockParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">ImageBlockParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">InputJSONDelta</a></code>
- <code><a href="./src/resources/messages/messages.ts">Message</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageCountTokensTool</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageDeltaEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageDeltaUsage</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageStartEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageStopEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageStreamEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">MessageTokensCount</a></code>
- <code><a href="./src/resources/messages/messages.ts">Metadata</a></code>
- <code><a href="./src/resources/messages/messages.ts">Model</a></code>
- <code><a href="./src/resources/messages/messages.ts">PlainTextSource</a></code>
- <code><a href="./src/resources/messages/messages.ts">RawContentBlockDeltaEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">RawContentBlockStartEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">RawContentBlockStopEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">RawMessageDeltaEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">RawMessageStartEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">RawMessageStopEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">RawMessageStreamEvent</a></code>
- <code><a href="./src/resources/messages/messages.ts">RedactedThinkingBlock</a></code>
- <code><a href="./src/resources/messages/messages.ts">RedactedThinkingBlockParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">SignatureDelta</a></code>
- <code><a href="./src/resources/messages/messages.ts">TextBlock</a></code>
- <code><a href="./src/resources/messages/messages.ts">TextBlockParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">TextCitation</a></code>
- <code><a href="./src/resources/messages/messages.ts">TextCitationParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">TextDelta</a></code>
- <code><a href="./src/resources/messages/messages.ts">ThinkingBlock</a></code>
- <code><a href="./src/resources/messages/messages.ts">ThinkingBlockParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">ThinkingConfigDisabled</a></code>
- <code><a href="./src/resources/messages/messages.ts">ThinkingConfigEnabled</a></code>
- <code><a href="./src/resources/messages/messages.ts">ThinkingConfigParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">ThinkingDelta</a></code>
- <code><a href="./src/resources/messages/messages.ts">Tool</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolBash20250124</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolChoice</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolChoiceAny</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolChoiceAuto</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolChoiceTool</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolResultBlockParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolTextEditor20250124</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolUnion</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolUseBlock</a></code>
- <code><a href="./src/resources/messages/messages.ts">ToolUseBlockParam</a></code>
- <code><a href="./src/resources/messages/messages.ts">Usage</a></code>

Methods:

- <code title="post /v1/messages">client.messages.<a href="./src/resources/messages/messages.ts">create</a>({ ...params }) -> Message</code>
- <code title="post /v1/messages/count_tokens">client.messages.<a href="./src/resources/messages/messages.ts">countTokens</a>({ ...params }) -> MessageTokensCount</code>
- <code>client.messages.<a href="./src/resources/messages.ts">stream</a>(body, options?) -> MessageStream</code>

## Batches

Types:

- <code><a href="./src/resources/messages/batches.ts">DeletedMessageBatch</a></code>
- <code><a href="./src/resources/messages/batches.ts">MessageBatch</a></code>
- <code><a href="./src/resources/messages/batches.ts">MessageBatchCanceledResult</a></code>
- <code><a href="./src/resources/messages/batches.ts">MessageBatchErroredResult</a></code>
- <code><a href="./src/resources/messages/batches.ts">MessageBatchExpiredResult</a></code>
- <code><a href="./src/resources/messages/batches.ts">MessageBatchIndividualResponse</a></code>
- <code><a href="./src/resources/messages/batches.ts">MessageBatchRequestCounts</a></code>
- <code><a href="./src/resources/messages/batches.ts">MessageBatchResult</a></code>
- <code><a href="./src/resources/messages/batches.ts">MessageBatchSucceededResult</a></code>

Methods:

- <code title="post /v1/messages/batches">client.messages.batches.<a href="./src/resources/messages/batches.ts">create</a>({ ...params }) -> MessageBatch</code>
- <code title="get /v1/messages/batches/{message_batch_id}">client.messages.batches.<a href="./src/resources/messages/batches.ts">retrieve</a>(messageBatchId) -> MessageBatch</code>
- <code title="get /v1/messages/batches">client.messages.batches.<a href="./src/resources/messages/batches.ts">list</a>({ ...params }) -> MessageBatchesPage</code>
- <code title="delete /v1/messages/batches/{message_batch_id}">client.messages.batches.<a href="./src/resources/messages/batches.ts">delete</a>(messageBatchId) -> DeletedMessageBatch</code>
- <code title="post /v1/messages/batches/{message_batch_id}/cancel">client.messages.batches.<a href="./src/resources/messages/batches.ts">cancel</a>(messageBatchId) -> MessageBatch</code>
- <code title="get /v1/messages/batches/{message_batch_id}/results">client.messages.batches.<a href="./src/resources/messages/batches.ts">results</a>(messageBatchId) -> JSONLDecoder&lt;MessageBatchIndividualResponse&gt;</code>

# Models

Types:

- <code><a href="./src/resources/models.ts">ModelInfo</a></code>

Methods:

- <code title="get /v1/models/{model_id}">client.models.<a href="./src/resources/models.ts">retrieve</a>(modelId) -> ModelInfo</code>
- <code title="get /v1/models">client.models.<a href="./src/resources/models.ts">list</a>({ ...params }) -> ModelInfosPage</code>

# Beta

Types:

- <code><a href="./src/resources/beta/beta.ts">AnthropicBeta</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaAPIError</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaAuthenticationError</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaBillingError</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaError</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaErrorResponse</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaGatewayTimeoutError</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaInvalidRequestError</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaNotFoundError</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaOverloadedError</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaPermissionError</a></code>
- <code><a href="./src/resources/beta/beta.ts">BetaRateLimitError</a></code>

## Models

Types:

- <code><a href="./src/resources/beta/models.ts">BetaModelInfo</a></code>

Methods:

- <code title="get /v1/models/{model_id}?beta=true">client.beta.models.<a href="./src/resources/beta/models.ts">retrieve</a>(modelId) -> BetaModelInfo</code>
- <code title="get /v1/models?beta=true">client.beta.models.<a href="./src/resources/beta/models.ts">list</a>({ ...params }) -> BetaModelInfosPage</code>

## Messages

Types:

- <code><a href="./src/resources/beta/messages/messages.ts">BetaBase64PDFBlock</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaBase64PDFSource</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaCacheControlEphemeral</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaCitationCharLocation</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaCitationCharLocationParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaCitationContentBlockLocation</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaCitationContentBlockLocationParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaCitationPageLocation</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaCitationPageLocationParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaCitationsConfigParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaCitationsDelta</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaContentBlock</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaContentBlockParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaContentBlockSource</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaContentBlockSourceContent</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaImageBlockParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaInputJSONDelta</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaMessage</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaMessageDeltaUsage</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaMessageParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaMessageTokensCount</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaMetadata</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaPlainTextSource</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaRawContentBlockDeltaEvent</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaRawContentBlockStartEvent</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaRawContentBlockStopEvent</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaRawMessageDeltaEvent</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaRawMessageStartEvent</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaRawMessageStopEvent</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaRawMessageStreamEvent</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaRedactedThinkingBlock</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaRedactedThinkingBlockParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaSignatureDelta</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaTextBlock</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaTextBlockParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaTextCitation</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaTextCitationParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaTextDelta</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaThinkingBlock</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaThinkingBlockParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaThinkingConfigDisabled</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaThinkingConfigEnabled</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaThinkingConfigParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaThinkingDelta</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaTool</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolBash20241022</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolBash20250124</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolChoice</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolChoiceAny</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolChoiceAuto</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolChoiceTool</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolComputerUse20241022</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolComputerUse20250124</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolResultBlockParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolTextEditor20241022</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolTextEditor20250124</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolUnion</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolUseBlock</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaToolUseBlockParam</a></code>
- <code><a href="./src/resources/beta/messages/messages.ts">BetaUsage</a></code>

Methods:

- <code title="post /v1/messages?beta=true">client.beta.messages.<a href="./src/resources/beta/messages/messages.ts">create</a>({ ...params }) -> BetaMessage</code>
- <code title="post /v1/messages/count_tokens?beta=true">client.beta.messages.<a href="./src/resources/beta/messages/messages.ts">countTokens</a>({ ...params }) -> BetaMessageTokensCount</code>

### Batches

Types:

- <code><a href="./src/resources/beta/messages/batches.ts">BetaDeletedMessageBatch</a></code>
- <code><a href="./src/resources/beta/messages/batches.ts">BetaMessageBatch</a></code>
- <code><a href="./src/resources/beta/messages/batches.ts">BetaMessageBatchCanceledResult</a></code>
- <code><a href="./src/resources/beta/messages/batches.ts">BetaMessageBatchErroredResult</a></code>
- <code><a href="./src/resources/beta/messages/batches.ts">BetaMessageBatchExpiredResult</a></code>
- <code><a href="./src/resources/beta/messages/batches.ts">BetaMessageBatchIndividualResponse</a></code>
- <code><a href="./src/resources/beta/messages/batches.ts">BetaMessageBatchRequestCounts</a></code>
- <code><a href="./src/resources/beta/messages/batches.ts">BetaMessageBatchResult</a></code>
- <code><a href="./src/resources/beta/messages/batches.ts">BetaMessageBatchSucceededResult</a></code>

Methods:

- <code title="post /v1/messages/batches?beta=true">client.beta.messages.batches.<a href="./src/resources/beta/messages/batches.ts">create</a>({ ...params }) -> BetaMessageBatch</code>
- <code title="get /v1/messages/batches/{message_batch_id}?beta=true">client.beta.messages.batches.<a href="./src/resources/beta/messages/batches.ts">retrieve</a>(messageBatchId, { ...params }) -> BetaMessageBatch</code>
- <code title="get /v1/messages/batches?beta=true">client.beta.messages.batches.<a href="./src/resources/beta/messages/batches.ts">list</a>({ ...params }) -> BetaMessageBatchesPage</code>
- <code title="delete /v1/messages/batches/{message_batch_id}?beta=true">client.beta.messages.batches.<a href="./src/resources/beta/messages/batches.ts">delete</a>(messageBatchId, { ...params }) -> BetaDeletedMessageBatch</code>
- <code title="post /v1/messages/batches/{message_batch_id}/cancel?beta=true">client.beta.messages.batches.<a href="./src/resources/beta/messages/batches.ts">cancel</a>(messageBatchId, { ...params }) -> BetaMessageBatch</code>
- <code title="get /v1/messages/batches/{message_batch_id}/results?beta=true">client.beta.messages.batches.<a href="./src/resources/beta/messages/batches.ts">results</a>(messageBatchId, { ...params }) -> JSONLDecoder&lt;BetaMessageBatchIndividualResponse&gt;</code>
````

## File: eslint.config.js
````javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error', 
        { 
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_'
        }
      ],
    },
  }
);
````

## File: index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BabyMusic AI - AI-Powered Music for Your Little One</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: LICENSE
````
Creative Commons Attribution-NonCommercial-ShareAlike + Revenue Sharing License (CC BY-NC-SA+RS)
Version 1.0.

1. Permitted Uses
You may use, copy, modify, and distribute this work for non-commercial purposes.
You may share modified versions of this work, provided you credit the original author.
You must distribute any modifications under the same CC BY-NC-SA+RS license.

2. Restrictions
You may not use this work for commercial purposes unless you comply with the revenue-sharing terms.
You may not sell, license, or monetize this work without explicit credit to the original author.
You may not distribute modified versions under a different license.

3. Commercial Use & Revenue Sharing
If you use this work for any commercial purpose, you must share 10% of gross revenue derived from its use.
Commercial use includes, but is not limited to, products, services, SaaS, advertisements, and sponsorships.
Payments must be made quarterly through an agreed-upon method (e.g., PayPal, Stripe, bank transfer).
To obtain a separate commercial license, contact the original author.

4. Attribution Requirement
Credit to the original author is required in any public use, including but not limited to:
Documentation
Software UI / Application footer
README files, About pages, or other visible acknowledgments

5. Enforcement & Termination
Failure to comply with this license (e.g., failure to credit, failure to pay revenue share, or licensing violations) immediately revokes your rights to use this work.
Upon revocation, you must cease all use and distribution of this work.
The original author reserves the right to take legal action for non-compliance.

6. Legal Disclaimer
This work is provided "as is", with no warranties or guarantees of any kind.
The author is not liable for any issues, damages, or legal consequences resulting from its use.

This license is based on the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License, with modifications to include a mandatory revenue-sharing requirement for commercial use.

The original CC BY-NC-SA 4.0 terms can be found at:
https://creativecommons.org/licenses/by-nc-sa/4.0/

Modifications made in this license:

Commercial Use Restriction: Any commercial use requires revenue sharing (see Section 3).
Revenue-Sharing Clause: Users who derive revenue from this work must share 10% of gross revenue with the original author.
Custom Enforcement Terms: This license explicitly states enforcement actions in case of non-compliance.
By using this work, you agree to these additional terms, which supersede conflicting provisions of CC BY-NC-SA 4.0.

This license is referred to as CC BY-NC-SA+RS v1.0 (Attribution-NonCommercial-ShareAlike + Revenue Sharing).
````

## File: netlify.toml
````toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
````

## File: package.json
````json
{
  "name": "babymusic-ai",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "lint:fix": "node scripts/lint/fix-unused-vars.mjs && node scripts/lint/fix-imports.mjs && eslint . --fix",
    "lint:imports": "node scripts/lint/fix-imports.mjs",
    "lint:vars": "node scripts/lint/fix-unused-vars.mjs",
    "preview": "vite preview",
    "supabase": "supabase",
    "deploy:function": "supabase functions deploy piapi-webhook --project-ref ustflrmqamppbghixjyl"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.37.0",
    "@netlify/functions": "^3.0.1",
    "@supabase/supabase-js": "^2.39.0",
    "esbuild": "^0.25.0",
    "glob": "^11.0.1",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/deno": "^2.2.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.18",
    "cssnano": "^7.0.6",
    "dotenv": "^16.4.7",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.5.3",
    "postcss-modules": "^6.0.0",
    "supabase": "^1.145.4",
    "tailwindcss": "^3.4.1",
    "ts-node": "^10.9.2",
    "tsx": "^4.19.3",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^6.1.1"
  }
}
````

## File: postcss.config.js
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
````

## File: README.md
````markdown
# 🎵 Baby Music AI

> AI-powered music generation for your little one's special moments.

Baby Music AI is an innovative web application that creates personalized lullabies and learning songs for children using advanced AI technology. Create unique melodies for every moment of your baby's day, from playtime to bedtime.

## ✨ Features

- 🎹 **AI Music Generation** - Create unique, personalized songs with multiple variations.
- 🌙 **Special Moments** - Dedicated songs for playtime, mealtime, bedtime, and more.
- 🎨 **Customization** - Choose from various moods, instruments, and styles.
- 💫 **Real-time Updates** - Watch your melodies come to life with live generation status.
- 🔄 **Multiple Variations** - Get different versions of each song.
- 🎯 **Easy Management** - Organize and play your collection of melodies.

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase
- **Music Generation**: PIAPI.ai
- **Lyric Generation**: Anthropic Claude API
- **Icons**: Lucide React
- **Deployment**: Netlify

For detailed information about the project's architecture, frontend components, backend services, API integrations, state management, security measures, and deployment instructions, please refer to the [documentation](./docs/README.md).

## 🌐 API Integration

Baby Music AI integrates with two external APIs to provide advanced music and lyric generation capabilities:

- **PIAPI.ai**: A music generation API that creates unique, personalized songs
- **Anthropic Claude**: An AI-powered API for generating song lyrics based on themes and moods

For more details on how these APIs are integrated into the application, see the [API Integration](./docs/api-integration.md) documentation.

## 📄 License

This project is licensed under **CC BY-NC-SA+RS v1.0** (Attribution-NonCommercial-ShareAlike + Revenue Sharing).

- **Personal and Non-Commercial Use:** You are free to use, modify, and share this work for non-commercial purposes as long as you provide proper attribution.
- **Commercial Use:** If you use this work for any commercial purpose (including sales, ads, SaaS, or monetized services), you must **share 10% of gross revenue** with the original author.
- **Derivative Works:** Any modifications or derivatives must be licensed under the same terms (ShareAlike).

### Attribution Requirement

If you use or distribute this project, you must credit the original author in a **visible location**, such as:

- The **UI or footer** of a published application.
- The **README file or documentation** of derivative projects.
- An **"About" section** or similar public acknowledgment.

### Full License Details

For complete terms, refer to the **[LICENSE](./LICENSE)** file.

If you require a **custom commercial license** or an exemption from revenue-sharing, please contact the original author to discuss separate terms.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For detailed guidelines on how to contribute to the project, please refer to the [Contributing](./docs/contributing.md) documentation.

## 🙏 Acknowledgments

- [PIAPI.ai](https://piapi.ai) for music generation
- [Anthropic Claude](https://anthropic.com) for AI-powered lyric generation
- [Supabase](https://supabase.com) for backend services
- [Unsplash](https://unsplash.com) for beautiful images
````

## File: tailwind.config.js
````javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFB5E8',    // Soft pink
        secondary: '#B5DEFF',  // Baby blue
        accent: '#AFF6D6',     // Mint green
        background: {
          light: '#F8F9FF',    // Soft white
          dark: '#2A2D3E'      // Gentle dark
        },
        methodology: '#FF5733'//'#7A7A8C'  // Lighter gray with slight blue tint
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'stars': "url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80')",
      }
    },
  },
  plugins: [],
};
````

## File: tsconfig.app.json
````json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* React */
    "allowJs": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

## File: tsconfig.json
````json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'zustand']
        }
      }
    }
  }
});
````
