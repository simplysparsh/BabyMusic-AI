# Baby Music AI Documentation

Welcome to the comprehensive documentation for the Baby Music AI project! This documentation is designed to provide a deep dive into the codebase, architecture, and features of the application.

## Table of Contents

- [Architecture Overview](./architecture.md)
  - Includes Progressive Web App (PWA) Integration details
- [Frontend Components](./frontend.md)
- [Backend Services](./backend.md)
- [API Integration](./api-integration.md)
- [Authentication & Onboarding](./auth-onboarding.md)
- [State Management](./state-management.md)
- [Security](./security.md)
- [Deployment](./deployment.md)
- [Utility & Maintenance Scripts](./utility-scripts.md)
- [Contributing Guidelines](./contributing.md)

## Project Structure

The project follows a modular structure with clear separation of concerns:

```bash
src/
├── components/     # UI components organized by feature
├── data/           # Static data and configurations
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries and API clients
├── pages/          # Main application pages/routes
├── services/       # Business logic services
├── store/          # State management (Zustand)
├── types/          # TypeScript type definitions
└── utils/          # Helper utilities
```

## Key Features Implementation

- **Authentication**: Full user authentication flow with signup, signin, and profile management implemented with Supabase Auth
- **Onboarding**: Multi-step onboarding process to collect baby profile information after signup
- **Song Generation**: AI-powered music generation with PIAPI.ai and lyrics by Anthropic Claude
- **Song Management**: User can create, save, and manage personalized songs

Each section provides detailed explanations and code examples to help you understand and navigate the project effectively. Whether you're a new contributor or an experienced developer, this documentation will serve as your guide to the Baby Music AI codebase.

If you have any questions or suggestions for improving the documentation, please don't hesitate to open an issue or submit a pull request. Happy coding!
