# 🌸 Anime Chat

**Anime Chat** is a customizable anime-themed AI chatbot platform built with **Next.js**, **Prisma**, **Clerk**, **Tailwind CSS**, and **TanStack Query**. It connects to LLMs like **Gemini**, **OpenAI**, or **Ollama**, enabling immersive real-time character-based conversations with anime personas.

![Anime Chat Banner](https://via.placeholder.com/1200x400?text=Anime+Chat)

## ✨ Features

- 🎭 **Anime-Style AI Personas**: Create and customize unique character behaviors and personalities
- 💬 **Real-Time Chat**: Optimistic UI updates with smooth loading states
- 🧠 **Persistent Memory**: Conversations with full context history
- 🚀 **High-Performance**: Fast data fetching using TanStack Query
- 🔐 **Secure Authentication**: User management via Clerk
- 💾 **Scalable Database**: PostgreSQL with Prisma ORM
- 🎨 **Beautiful UI**: Responsive design with Tailwind CSS
- 📱 **Mobile-Friendly**: Works seamlessly on all devices

## 🧱 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL via Prisma
- **Authentication**: Clerk
- **State Management**: TanStack Query + Axios
- **Styling**: Tailwind CSS
- **LLM Integration**: Gemini API / OpenAI / Ollama

## 📁 Project Structure

```
/app                   → Next.js app router and UI components
  /chat                → Chat interface pages
  /api                 → API route handlers
    /chat              → Chat and conversation API
    /models            → Character models API
    /user              → User management API
    /history           → Conversation history API
/components            → Reusable UI components
/hooks                 → Custom React hooks
  /useChatStore.ts     → Chat state management
/lib                   → Utility functions and types
  /types.ts            → TypeScript definitions
/prisma                → Database schema and migrations
  /schema.prisma       → Database model definitions
```

## 💾 Database Schema

The application uses Prisma with PostgreSQL for data persistence with the following main models:

- **User**: User accounts linked with Clerk authentication
- **Model**: AI character definitions with persona instructions
- **Conversation**: Chat sessions between users and AI characters
- **Message**: Individual messages within conversations

## 🔌 API Endpoints

### Chat API (`/api/chat`)

- `POST`: Send a message to an AI character
- `GET`: Retrieve conversation history
- `DELETE`: Clear conversation history

### Models API (`/api/models`)

- `POST`: Create a new AI character model
- `GET`: List available character models

### User History API (`/api/history`)

- `GET`: Get conversation history for a specific user

## 🧠 How the Chat Works

The application uses a custom `useChatStore` hook built with TanStack Query to manage chat state. Key features include:

1. **Optimistic Updates**: Messages appear instantly with loading indicators
2. **Context Management**: Each AI response maintains conversation context
3. **Error Handling**: Automatic retries and fallbacks
4. **Persistence**: Conversations are saved to the database

The chat interface communicates with the chosen LLM (Gemini in the provided code) through API handlers in the `/api/chat` endpoints.

## 🔧 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/anime-chat.git
cd anime-chat

# 2. Install dependencies
npm install
# or
pnpm install
# or
yarn install

# 3. Set up environment variables
cp .env.example .env
# Then fill in:
# - DATABASE_URL
# - CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
# - AI_API_KEY (for Gemini, OpenAI, etc.)

# 4. Set up the database
npx prisma generate
npx prisma db push

# 5. Start the development server
npm run dev
# or
pnpm dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application running.

## 🚀 Deployment

The application can be deployed on Vercel with minimal configuration:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy!

For the database, we recommend:
- [Neon](https://neon.tech) for PostgreSQL
- [PlanetScale](https://planetscale.com) as an alternative

## 🔐 Authentication Setup

The application uses Clerk for authentication. To set up:

1. Create a Clerk account at [clerk.dev](https://clerk.dev)
2. Create a new application in the Clerk dashboard
3. Add authentication methods (email, social logins, etc.)
4. Copy your API keys to the `.env` file

## 🎭 Creating AI Characters

Characters are defined with:
- **Name**: Character identity
- **Image URL**: Character avatar
- **Description**: Brief character overview
- **Base Prompt**: Detailed character instructions for the AI

## 🤝 Contributing

Anime Chat is still in early development! PRs and issues are welcome — especially if you love anime, code, or AI.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT — go wild, but don’t summon cursed AI demons.

## ✍️ Created by Khegal, Hydrix

> Built with purpose. Refined through madness. Dreamed into being.
