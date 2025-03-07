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

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- npm
- Supabase account
- PIAPI.ai API key
- Anthropic Claude API key

## Environment Setup

This application requires several environment variables to function properly. These variables should be defined in different places depending on the environment:

### Local Development
Create a `.env.local` file in the root directory with the following variables:

```
# Feature flags
VITE_DISABLE_SIGNUP=false

# Supabase configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API keys
VITE_CLAUDE_API_KEY=your_claude_api_key
VITE_PIAPI_KEY=your_piapi_key
VITE_WEBHOOK_SECRET=your_webhook_secret
```

### Production Deployment
For production, set these environment variables in:
- **Netlify**: Environment variables section in the Netlify dashboard
- **Supabase**: Secrets section in the Supabase dashboard for Edge Functions

### Accessing Environment Variables in Code
In Vite applications, environment variables are accessed directly using the `import.meta.env` object:

```typescript
// Access environment variables directly
const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

### Option 1: Using the Setup Script

Run the following command to use our interactive setup script:

```bash
npx tsx scripts/setup-env.ts
```

The script will guide you through setting up all required environment variables and create a `.env.local` file for you.

### Option 2: Manual Setup

Create a `.env.local` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PIAPI_KEY=your_piapi_key
VITE_CLAUDE_API_KEY=your_claude_api_key
VITE_WEBHOOK_SECRET=your_webhook_secret
```

## Utility Scripts

The project includes several utility scripts to help manage song generation, environment setup, and security checks. For detailed information about these scripts, see the [scripts README](./scripts/README.md).

## Development

To start the development server:

```bash
npm run dev
```

## Building for Production

To build the application for production:

```bash
npm run build
```

## Security Best Practices

- Never hardcode API keys or secrets in your code
- Always use environment variables for sensitive information
- Regularly check for hardcoded secrets using the provided script
- Keep your `.env.local` file secure and never commit it to version control

## 🏗️ Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
│   ├── claude.ts     # Anthropic Claude API integration
│   ├── piapi.ts      # PIAPI.ai music generation
│   └── supabase.ts   # Supabase client configuration
├── services/         # Business logic services
├── store/            # Zustand state management
└── types/            # TypeScript type definitions
```

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Webhook signature verification
- Secure authentication flow
- Real-time data protection

## 🎨 UI/UX Features

- Responsive design for all devices
- Beautiful animations and transitions
- Real-time feedback and status updates
- Intuitive music playback controls
- Clean and modern interface

## 📦 Core Components

### MusicGenerator

- Handles music generation requests
- Supports multiple moods and instruments
- Real-time generation status

### SongList

- Displays generated songs with variations
- Playback controls
- Download and share options

### PresetSongs

- Special moment presets
- Customized for your baby
- Quick access to common scenarios

## 🔄 State Management

The application uses Zustand for state management with the following stores:

- `authStore`: User authentication and profile management
- `songStore`: Song list and generation status
- `audioStore`: Audio playback control
- `errorStore`: Global error handling

## 🌐 API Integration

### PIAPI Integration

- Base URL: https://api.piapi.ai/api/v1
- Supports custom music generation
- Webhook integration for status updates

### Anthropic Claude API Integration

- Uses `@anthropic-ai/sdk` for AI-powered lyric generation
- Generates personalized song lyrics based on themes, moods, and user input
- Handles rate limiting and error fallbacks to ensure reliable content generation
- Secured with API key authentication

### Supabase Integration

- Real-time database updates
- Secure authentication
- File storage for audio files

The project is linked to a Supabase instance with the following details:

- Project ID: `ustflrmqamppbghixjyl`
- Edge Functions: Deployed and operational

### Setting Up Supabase Project

```bash
# Link to the Supabase project
supabase link --project-ref ustflrmqamppbghixjyl

# Deploy an edge function (if needed)
supabase functions deploy your-function-name --no-verify-jwt

# Push database migrations
supabase db push --include-all

# Set environment variables from .env.local
supabase secrets set --env-file .env.local --project-ref ustflrmqamppbghixjyl
```

## 📱 Progressive Features

- Offline playback support
- Background audio playback
- Push notifications for completed generations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

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

## 🙏 Acknowledgments

- [PIAPI.ai](https://piapi.ai) for music generation
- [Anthropic Claude](https://anthropic.com) for AI-powered lyric generation
- [Supabase](https://supabase.com) for backend services
- [Unsplash](https://unsplash.com) for beautiful images