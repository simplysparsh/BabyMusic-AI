# 🎵 TuneLoom

> Personalized music generation for your little one's special moments.

TuneLoom is an innovative web application that creates personalized lullabies and learning songs for children using advanced music technology. Create unique melodies for every moment of your baby's day, from playtime to bedtime.

## ✨ Features

- 🎹 **Music Generation** - Create unique, personalized songs with multiple variations.
- 🌙 **Special Moments** - Dedicated songs for playtime, mealtime, bedtime, and more.
- 🎨 **Customization** - Choose from various moods, instruments, and styles.
- 💫 **Real-time Updates** - Watch your melodies come to life with live generation status.
- 🔄 **Multiple Variations** - Get different versions of each song.
- 🎯 **Easy Management** - Organize and play your collection of melodies.

## 🚀 Getting Started / Running Locally

To get a local copy up and running, follow these simple steps:

1.  **Clone the repository:**
    ```sh
    git clone <repository-url-here>
    cd tuneloom
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Run the interactive setup script. This will guide you through creating a `.env.local` file with the necessary API keys and configuration for the frontend.
    ```sh
    npx tsx scripts/setup-env.ts
    ```
    For backend Supabase function variables, refer to the [Deployment Documentation](./docs/deployment.md#environment-variables-and-database).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

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

TuneLoom integrates with two external APIs to provide advanced music and lyric generation capabilities:

- **PIAPI.ai**: A music generation API that creates unique, personalized songs
- **Anthropic Claude**: For generating song lyrics based on themes and moods

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
- [Anthropic Claude](https://anthropic.com) for lyric generation
- [Supabase](https://supabase.com) for backend services
- [Unsplash](https://unsplash.com) for beautiful images