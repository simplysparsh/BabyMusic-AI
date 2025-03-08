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
