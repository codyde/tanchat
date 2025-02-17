# TanStack Chat Application

A modern chat application built with TanStack Router and Claude AI integration, featuring a clean and responsive interface.

## Features

- 💬 AI-powered chat conversations using Claude 3.5 Sonnet
- 📝 Markdown support for structured and formatted responses
- 💾 Local storage persistence for chat history
- ⚡ Real-time message updates
- 🎨 Modern UI with Tailwind CSS
- ⚙️ Customizable system prompts and settings
- 🔍 Conversation history management
- 📊 Error tracking with Sentry integration

## Architecture

### Tech Stack
- **Frontend Framework**: TanStack Start
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS
- **Database**: SQL.js (in-browser SQLite)
- **AI Integration**: Anthropic's Claude API
- **Error Tracking**: Sentry
- **Build Tool**: Vite + Vinxi

### Project Structure
```
app/
├── components/         # Reusable UI components
├── routes/            # Application routes
├── utils/
│   ├── ai.ts         # AI integration logic
│   └── db.ts         # Database operations
├── client.tsx         # Client entry point
├── router.tsx         # Router configuration
└── index.css         # Global styles
```

### Database Schema
The application uses an in-browser SQLite database with the following tables:
- `conversations`: Stores chat conversations
- `messages`: Stores individual messages
- `prompts`: Manages system prompts
- `settings`: Application settings
- `user_settings`: User-specific settings

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SENTRY_DSN=your_sentry_dsn
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables as described above

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

6. Start production server:
   ```bash
   npm start
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

Key dependencies include:
- @anthropic-ai/sdk: ^0.33.1
- @tanstack/react-router: ^1.105.0
- @tanstack/start: ^1.105.3
- react: ^19.0.0
- sql.js: ^1.12.0
- tailwindcss: ^4.0.0-beta.9
- vinxi: ^0.5.3

For a complete list of dependencies, see `package.json`.
