# 🎵 MelodyNest

> AI-powered music generation for your little one's special moments

MelodyNest is an innovative web application that creates personalized lullabies and learning songs for children using advanced AI technology. Create unique melodies for every moment of your baby's day, from playtime to bedtime.

## ✨ Features

- 🎹 **AI Music Generation** - Create unique, personalized songs with multiple variations
- 🌙 **Special Moments** - Dedicated songs for playtime, mealtime, bedtime, and more
- 🎨 **Customization** - Choose from various moods, instruments, and styles
- 💫 **Real-time Updates** - Watch your melodies come to life with live generation status
- 🔄 **Multiple Variations** - Get different versions of each song
- 🎯 **Easy Management** - Organize and play your collection of melodies

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

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PIAPI_KEY=your_piapi_key
VITE_WEBHOOK_URL=your_webhook_url
VITE_WEBHOOK_SECRET=your_webhook_secret
```

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

## 🏗️ Project Structure

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

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [PIAPI.ai](https://piapi.ai) for music generation
- [Supabase](https://supabase.com) for backend services
- [Unsplash](https://unsplash.com) for beautiful images
