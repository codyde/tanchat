# TanStack Chat Application

Am example chat application built with TanStack Start, TanStack Store, and Claude AI.

## .env Updates

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
```

## ✨ Features

### AI Capabilities
- 🤖 Multi-provider AI support: Anthropic Claude and OpenAI models
- 🧠 Advanced reasoning models: Claude 4/3.7 Sonnet, OpenAI o3/o3-pro/o3-mini
- 📝 Rich markdown formatting with syntax highlighting
- 🎯 Customizable system prompts for tailored AI behavior
- 🔄 Real-time streaming responses with AI SDK v5

### User Experience
- 🎨 Modern UI with Tailwind CSS and Lucide icons
- 🔍 Conversation management and history
- 🔐 Secure API key management
- 📋 Markdown rendering with code highlighting

### Technical Features
- 📦 Centralized state management with TanStack Store
- 🔌 Extensible architecture for multiple AI providers
- 🛠️ TypeScript for type safety

## Architecture

### Tech Stack
- **Frontend Framework**: TanStack Start
- **Routing**: TanStack Router
- **State Management**: TanStack Store
- **Styling**: Tailwind CSS
- **AI Integration**: Anthropic's Claude API

### Project Structure
```
app/
├── components/         # Reusable UI components
├── routes/            # Application routes
├── store/
│   ├── store.ts      # Core state management
│   └── hooks.ts      # Custom store hooks
├── utils/
│   └── ai.ts         # AI integration logic
├── global-middleware.ts # Global middleware configuration
├── middleware.ts      # Custom middleware
├── api.ts            # API configurations
├── client.tsx        # Client entry point
├── router.tsx        # Router configuration
├── routeTree.gen.ts  # Generated route tree
├── ssr.tsx          # Server-side rendering setup
└── index.css         # Global styles
```

### Application State
The application uses TanStack Store for state management with the following structure:
- **Conversations**: Manages chat conversations and messages
  ```typescript
  interface Conversation {
    id: string
    title: string
    messages: Message[]
  }
  ```
- **Prompts**: Controls system prompts
  ```typescript
  interface Prompt {
    id: string
    name: string
    content: string
    is_active: boolean
    created_at: number
  }
  ```
- **Application State**: Tracks current conversation and loading states

### Middleware
The application implements several middleware layers:
- **Sentry Integration**: Global error tracking and monitoring
- **Logging**: Custom logging middleware for debugging
- **Route Handling**: TanStack Router middleware for navigation

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SENTRY_DSN=your_sentry_dsn
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tanchat.git
   cd tanchat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create and configure your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values:
   ```env
   VITE_SENTRY_DSN=your_sentry_dsn
   ANTHROPIC_API_KEY=your_anthropic_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Key Workflows

1. **Chat Conversations**
   - Create new conversations
   - Send messages to Claude AI
   - View conversation history
   - Delete conversations

2. **System Prompts**
   - Create and manage custom system prompts
   - Enable/disable prompts
   - Customize AI behavior

3. **Settings Management**
   - Configure application settings
   - Manage user preferences
   - Customize AI response formatting

## Dependencies

### TanStack Suite
- **@tanstack/react-router**: ^1.105.0 - Type-safe routing solution
- **@tanstack/react-store**: ^0.7.0 - Powerful state management
- **@tanstack/store**: ^0.7.0 - Core store functionality
- **@tanstack/start**: ^1.111.3 - Project bootstrapping and configuration

### UI and Rendering
- **react**: ^19.0.0
- **react-dom**: ^19.0.0
- **tailwindcss**: ^4.0.0-beta.9
- **lucide-react**: ^0.473.0 - Beautiful icons
- **react-markdown**: ^9.0.3 - Markdown rendering
- **highlight.js**: ^11.11.1 - Code syntax highlighting

### Markdown Processing
- **rehype-highlight**: ^7.0.1
- **rehype-raw**: ^7.0.0
- **rehype-sanitize**: ^6.0.0

### AI Integration
- **@anthropic-ai/sdk**: ^0.33.1

### Error Tracking
- **@sentry/react**: ^9.1.0
- **@sentry/node**: ^9.1.0
- **@sentry/profiling-node**: ^9.1.0

### Development Tools
- **typescript**: ^5.7.3
- **@vitejs/plugin-react**: ^4.3.4
- **vinxi**: ^0.5.3

For a complete list of dependencies, see `package.json`.

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure your Anthropic API key is correctly set in the `.env` file
   - Verify the API key has sufficient permissions

2. **State Management Issues**
   - Check browser console for store-related errors
   - Verify conversation state updates
   - Clear browser storage if experiencing state inconsistencies

3. **Build Issues**
   - Make sure all dependencies are installed: `npm install`
   - Clear npm cache: `npm cache clean --force`
   - Check for TypeScript compilation errors

## Roadmap

### Phase 1: Core Enhancements
- [ ] Implement streaming responses from Claude
- [ ] Add BetterAuth authentication system
- [ ] Refactor sidebar UI/UX
- [ ] Implement API key management in settings

### Phase 2: Provider Integration
- [ ] Add OpenAI provider support
- [ ] Add Google Gemini provider support
- [ ] Support for multi-modal inputs (images/audio)

### Phase 3: Social Features
- [ ] Implement conversation sharing
- [ ] Add collaborative chat features
- [ ] Enable public/private conversation toggles

### Phase 4: Infrastructure
- [ ] Setup Sentry in middleware
- [ ] Implement comprehensive error handling
- [ ] Add automated testing suite

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TanStack](https://tanstack.com/) for their excellent React framework
- [Anthropic](https://anthropic.com/) for Claude AI integration
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- All contributors who have helped shape this project

