# Project Backup Checkpoint

## Project Overview
MelodyNest - An AI-powered music generation application for creating personalized lullabies and learning songs.

## Version Information
- Checkpoint Date: 2025-02-10
- Git Hash: Not applicable (running in WebContainer)
- Environment: WebContainer Node.js runtime

## Core Features
1. AI Music Generation with multiple variations
2. Real-time status updates via webhooks
3. User authentication
4. Song management with playback controls
5. Batch deletion capability

## Technical Stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- State Management: Zustand
- Database: Supabase
- Music Generation: PIAPI.ai

## Environment Configuration
```env
VITE_SUPABASE_URL=https://ustflrmqamppbghixjyl.supabase.co
VITE_SUPABASE_ANON_KEY=[supabase-anon-key]
VITE_PIAPI_KEY=[piapi-key]
VITE_WEBHOOK_URL=[webhook-url]
WEBHOOK_SECRET=[webhook-secret]
```

## Dependencies
```json
{
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.39.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2",
    "supabase": "^1.145.4"
  }
}
```

## Database Schema

### Tables
1. profiles
   - User profiles with premium status and usage tracking
2. songs
   - Main songs table with task tracking
   - Added task_id column for webhook correlation
3. song_variations
   - Stores multiple variations of generated songs
   - Links to parent song via song_id

### Schema Details

#### profiles
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  is_premium boolean DEFAULT false,
  daily_generations integer DEFAULT 0,
  last_generation_date timestamptz,
  created_at timestamptz DEFAULT now()
);
```

#### songs
```sql
CREATE TABLE songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mood text NOT NULL,
  instrument text NOT NULL,
  voice_type text,
  lyrics text,
  audio_url text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  task_id text,
  error text
);
```

#### song_variations
```sql
CREATE TABLE song_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid REFERENCES songs NOT NULL,
  audio_url text NOT NULL,
  title text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
```

## TypeScript Types

### Core Types
```typescript
export type MusicMood = 'calm' | 'playful' | 'learning' | 'energetic';
export type Instrument = 'piano' | 'harp' | 'strings' | 'whiteNoise';
export type VoiceType = 'softFemale' | 'calmMale' | 'gentleChorus';
export type AgeGroup = '0-6' | '6-12' | '12-24';

export interface Song {
  id: string;
  name: string;
  mood: MusicMood;
  instrument: Instrument;
  voice?: VoiceType;
  lyrics?: string;
  audioUrl?: string;
  createdAt: Date;
  userId: string;
  variations?: SongVariation[];
}

export interface SongVariation {
  id: string;
  songId: string;
  audioUrl: string;
  title?: string;
  metadata?: {
    tags?: string;
    prompt?: string;
  };
  createdAt: Date;
}
```

## API Configuration

### PIAPI Integration
- Base URL: https://api.piapi.ai/api/v1
- Model: music-s
- Task Type: generate_music_custom
- Webhook Support: Enabled with signature verification

### Supabase Configuration
- Project URL: https://ustflrmqamppbghixjyl.supabase.co
- Edge Functions: Enabled
- Real-time: Enabled for songs and variations tables


## Key Components

### Frontend Components
1. MusicGenerator
   - Handles music generation requests
   - Supports multiple moods and instruments
2. SongList
   - Displays songs with variations
   - Supports playback and deletion
3. AuthModal
   - Handles user authentication
   - Email/password based login/signup

### Backend Services
1. Supabase Edge Function (piapi-webhook)
   - Processes webhook callbacks from PIAPI
   - Updates song status and variations
   - Implements security checks

### State Management
1. authStore
   - User authentication state
   - Profile management
2. songStore
   - Song list management
   - Real-time updates via Supabase subscriptions
   - Batch deletion support

## Security Measures
1. Row Level Security (RLS) policies on all tables
2. Webhook signature verification
3. Timestamp validation for webhooks
4. Service role key for webhook processing

## Real-time Features
1. Song status updates
2. Variation additions
3. Database changes subscription

## Current Project State
- All core features implemented
- Multiple variations support added
- Webhook integration complete
- Delete all functionality implemented
- Real-time updates working

## Backup Notes
This checkpoint represents a stable version with all major features working. Key improvements include:

### Core Features Status
- Multiple variations support
- Webhook integration
- Real-time updates
- Batch deletion
- Error handling improvements

### Known Issues
None at this checkpoint

### Recovery Steps
1. Ensure all environment variables are set correctly
2. Run `npm install` to install dependencies
3. Start the development server with `npm run dev`
4. Deploy the webhook function with `npm run deploy:function`
5. Verify Supabase connection and database schema
6. Test authentication and music generation

### Testing Checklist
- [ ] User authentication (sign up/sign in)
- [ ] Music generation with variations
- [ ] Real-time updates
- [ ] Webhook processing
- [ ] Batch deletion
- [ ] Error handling
- [ ] Audio playback