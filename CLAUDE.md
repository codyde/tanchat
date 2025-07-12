# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the Vite development server with hot reload (typically on port 3001)
- `npm run build` - Build the application for production using Vite
- `npm start` - Start the production server using Vite

## Project Architecture

This is a TanStack Chat application built with modern React frameworks and AI integration.

### Tech Stack
- **Framework**: TanStack Start (full-stack React framework)
- **State Management**: TanStack Store (centralized, type-safe state)
- **Routing**: TanStack Router (file-based routing)
- **Styling**: Tailwind CSS v4 (beta)
- **AI Integration**: Anthropic Claude API via AI SDK
- **Error Tracking**: Sentry (both client and server)
- **Build Tool**: Vite 6.x (migrated from Vinxi)

### Key Dependencies
- `@tanstack/react-start` - Meta-framework for React applications
- `@tanstack/react-store` - State management with granular subscriptions
- `ai` - Vercel AI SDK v5 Beta (canary.24) for enhanced streaming and multi-provider support
- `@ai-sdk/anthropic` - Anthropic provider for AI SDK v5 (canary.19)
- `@ai-sdk/openai` - OpenAI provider for AI SDK v5 (canary.20)
- `react-markdown` - Markdown rendering with syntax highlighting
- `zod` - Required peer dependency for AI SDK v5

### Project Structure
```
src/
├── components/            # Reusable UI components
├── routes/               # File-based routing (TanStack Router)
│   ├── __root.tsx       # Root layout component
│   └── index.tsx        # Main chat interface
├── store/               # TanStack Store configuration
│   ├── store.ts        # Main store with actions/selectors
│   └── hooks.ts        # Store hooks for components
├── utils/              # Utility functions
│   └── ai.ts          # AI integration and server functions
├── client.tsx         # Client-side entry point
├── ssr.tsx           # Server-side rendering entry point
├── router.tsx         # Router configuration
├── routeTree.gen.ts   # Generated route tree (auto-generated)
└── index.css          # Global styles
```

## State Management Architecture

The application uses **TanStack Store** for global state management instead of React Context/useState for performance and organization benefits:

### Store Structure (`src/store/store.ts`)
```typescript
interface State {
  prompts: Prompt[]              // System prompts for AI customization
  conversations: Conversation[]  // Chat conversations with messages
  currentConversationId: string | null
  isLoading: boolean
  selectedModel: string         // Current AI model selection
}
```

### Key Store Actions
- `createPrompt()` - Create custom system prompts
- `setPromptActive()` - Activate/deactivate prompts
- `addConversation()` - Create new chat conversations
- `addMessage()` - Add messages to conversations
- `setSelectedModel()` - Change AI model (Claude 3.5/4 Sonnet)

### Store Benefits
- **Granular subscriptions**: Components only re-render when specific state slices change
- **Type safety**: Full TypeScript integration with state shape
- **Centralized logic**: All state mutations happen through actions
- **Performance**: Avoids React Context re-render issues

## AI Integration (`src/utils/ai.ts`)

### Server Function
- `genAIResponse()` - Server-side function using TanStack Start's `createServerFn`
- **AI SDK v5**: Latest canary with enhanced streaming and multi-provider support
- Custom system prompt layering (default + user prompts)
- Comprehensive error handling and Sentry integration

### Multi-Provider Support
**Anthropic Models:**
- Claude 4 Sonnet (`claude-4-sonnet-20250514`) - Most capable with reasoning
- Claude 3.7 Sonnet (`claude-3-7-sonnet-20250219`) - Fast and capable
- Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`) - Balanced performance

**OpenAI Models:**
- o3-pro (`o3-pro-2025-06-10`) - Most capable reasoning model (requires Tier 4+ API access)
- o3 (`o3-2025-04-16`) - Advanced reasoning model 
- o3-mini (`o3-mini-2025-01-31`) - Fast reasoning model with function calling support

### Features
- **AI SDK v5 Canary.24**: Latest streaming architecture with UIMessage parts and enhanced protocols
- **Auto-provider detection**: Automatic provider selection based on model
- **Reasoning support**: Enhanced reasoning for o3 and Claude 4 models
- **Custom system prompts**: User-configurable AI behavior
- **Markdown formatting**: Rich text responses with syntax highlighting
- **Error resilience**: Provider-specific error handling and API key validation
- **Updated streaming**: v5 data stream response format with improved parsing

## Routing (TanStack Router)

- File-based routing system with `src/routes/` directory
- Type-safe route definitions
- Auto-generated route tree (`src/routeTree.gen.ts`)
- Root layout in `src/routes/__root.tsx` with global navigation

## Environment Variables

Required environment variables:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
VITE_SENTRY_DSN=your_sentry_dsn  # Optional for error tracking
```

## Key Development Patterns

### Server Functions
Use TanStack Start's `createServerFn` for server-side operations:
```typescript
export const myServerFn = createServerFn({ method: 'GET' })
  .validator((data: MyData) => data)
  .handler(async ({ data }) => {
    // Server-side logic
  })
```

### Store Usage
Access store state with granular selectors:
```typescript
import { useStore } from '@tanstack/react-store'
import { store, selectors } from '../store/store'

// Only re-renders when conversations change
const conversations = useStore(store, selectors.getConversations)
```

### Error Handling
- Sentry integration for both client and server
- Server-side error tracking in AI functions
- User-friendly error messages for rate limits and API failures

## Styling

- **Tailwind CSS v4** (beta version)
- Configuration in `postcss.config.mjs`
- Component-based styling approach
- Lucide React icons for UI elements

## Build Configuration

- **Vite 6.x**: Direct Vite integration with TanStack Start plugin
- TypeScript support with path aliases via `vite-tsconfig-paths`
- TanStack Start plugin handles routing and SSR automatically
- Optimized bundling with external SQLite dependencies
- Development server with hot reload and production builds