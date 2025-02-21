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
- **Icons**: Lucide React
- **Deployment**: Netlify

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- npm
- Supabase account
- PIAPI.ai API key

### Environment Setup

#### Development

Create a `.env.local` file in the root directory with your development environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PIAPI_KEY=your_piapi_key
VITE_WEBHOOK_URL=your_webhook_url  # Only needed for testing with webhook.site
VITE_WEBHOOK_SECRET=your_webhook_secret
```

Note: `.env.local` is gitignored and should not be committed to version control.

Note: The `VITE_WEBHOOK_URL` variable is only required when testing with webhook.site. In production, the webhook endpoint is automatically handled by the Supabase Edge Function.

#### Production

For production deployment, configure the following variables in Netlify's dashboard:

1. `VITE_SUPABASE_URL` - Your Supabase project URL
2. `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
3. `VITE_PIAPI_KEY` - Your PIAPI.ai API key
4. `VITE_WEBHOOK_SECRET` - Your webhook secret key

To set up environment variables in Netlify:

1. Go to your site's dashboard in Netlify
2. Navigate to Site settings > Build & deploy > Environment
3. Click "Edit variables"
4. Add each environment variable with its corresponding value
5. Make sure to mark sensitive variables as "Sensitive" for added security

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure.

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
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

### Supabase Integration

- Real-time database updates
- Secure authentication
- File storage for audio files

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
- [Supabase](https://supabase.com) for backend services
- [Unsplash](https://unsplash.com) for beautiful images
