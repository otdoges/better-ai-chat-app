# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 8080
- `npm run build` - Production build 
- `npm run build:dev` - Development build with debug info
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a modern React chat application built with TypeScript and Vite. The app provides a ChatGPT-like interface with support for multiple AI providers (Groq and Google).

### Key Components Structure

- **ChatInterface** (`src/components/chat/ChatInterface.tsx`) - Main chat component orchestrating conversations, message handling, and AI integration
- **ChatMessage** (`src/components/chat/ChatMessage.tsx`) - Individual message rendering with syntax highlighting and model statistics
- **ChatSidebar** (`src/components/chat/ChatSidebar.tsx`) - Conversation history and navigation
- **ChatInput** (`src/components/chat/ChatInput.tsx`) - Message input with image upload support
- **SettingsDialog** (`src/components/chat/SettingsDialog.tsx`) - API key management and settings

### Core Libraries

- **AI Integration**: Uses `ai` SDK with `@ai-sdk/groq` and `@ai-sdk/google` for streaming responses
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme provider
- **State Management**: React hooks with persistent storage via IndexedDB
- **Data Persistence**: Custom IndexedDB wrapper (`src/lib/indexeddb.ts`) for conversations and settings

### Data Flow

1. **Conversations** are stored in IndexedDB with full message history
2. **AI Models** are defined in `src/lib/ai-models.ts` with comprehensive metadata
3. **API Clients** are initialized in `src/lib/ai-client.ts` with support for custom API keys
4. **Message streaming** uses the AI SDK's streaming capabilities with real-time token statistics

### Key Features

- Multi-provider AI support (Groq/Google models)
- Image upload and multimodal chat capabilities
- Conversation persistence with IndexedDB
- Real-time streaming responses with performance metrics
- Dark/light theme support
- Export/import functionality for chat data
- Custom API key configuration per provider

### Environment Variables

Required for functionality:
- `VITE_GROQ_API_KEY` - Groq API key (can be overridden in settings)
- `VITE_GOOGLE_API_KEY` - Google API key (can be overridden in settings)

### Testing and Quality

The project uses ESLint for code quality. Always run `npm run lint` before committing changes to ensure code standards compliance.

### Model Selection System

The app includes an extensive model catalog with categorization (production/preview/experimental), capability flags (chat/reasoning/vision/audio), and provider routing. Model metadata is centralized in `src/lib/ai-models.ts`.