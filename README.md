# 🌸 Anime Chat

**Anime Chat** is a customizable anime-themed AI chatbot platform built with **Next.js**, **Prisma**, **Clerk**, **Tailwind CSS**, and **TanStack Query**. It connects to LLMs like **Gemini**, **OpenAI**, or **Ollama**, enabling immersive real-time character-based conversations with anime personas.

🔗 **Live Demo**: [anime-chat-seven.vercel.app](https://anime-chat-seven.vercel.app)

![Anime Chat Banner](https://via.placeholder.com/1200x400?text=Anime+Chat)

## ✨ Features

- 🎭 **Anime-Style AI Personas**: Create and customize unique character behaviors and personalities
- 💬 **Real-Time Chat**: Optimistic UI updates with smooth loading states
- 🧠 **Persistent Memory**: Conversations with full context history
- 🚀 **High-Performance**: Fast data fetching using TanStack Query
- 🔐 **Secure Authentication**: User management via Clerk
- 💾 **Scalable Database**: PostgreSQL with Prisma ORM
- 🎨 **Beautiful UI**: Responsive design with Tailwind CSS

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

## 💻 Key Code Implementations

### Chat API (`/api/chat` Route)

```typescript
// Main POST function for handling chat messages
export const POST = async (req: NextRequest) => {
  try {
    const { userId, prompt, modelName, conversationId } = await req.json();
    
    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not registered." }, { status: 403 });
    
    // Handle conversation state (existing or create new)
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    } else {
      // Create new conversation if none exists
      conversation = await prisma.conversation.create({
        data: {
          user: { connect: { id: userId } },
          model: { connect: { id: model.id } },
          messages: {
            create: [{ role: "user", text: model.basePrompt, modelId: model.id }],
          },
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    }
    
    // Set up chat history for LLM context
    const history = conversation.messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));
    
    // Initialize chat session with Gemini
    const chatSession = ai.startChat({ generationConfig, history });
    
    // Save user message to database
    await prisma.message.create({/*...*/});
    
    // Send message to AI and get response
    let text = "";
    try {
      const result = await chatSession.sendMessage(prompt);
      const response = await result.response;
      text = await response.text();
    } catch (aiError) {
      console.error("AI error:", aiError);
      return NextResponse.json({ error: "AI processing error" }, { status: 500 });
    }
    
    // Save AI response to database
    await prisma.message.create({/*...*/});
    
    return NextResponse.json({ text, conversationId: conversation.id });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
```

### React Chat Hook (`useChatStore.ts`)

```typescript
export const useChatStore = () => {
  const { id: conversationId } = useParams();
  const session = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const userId = session.session?.user.id;
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Fetch conversation details using React Query
  const { data: conversationData, isLoading: isConversationLoading } =
    useQuery<ConversationResponse>({
      queryKey: ["conversation", conversationId],
      queryFn: async () => {
        if (!conversationId) throw new Error("No conversation ID provided");
        const res = await axios.get(`/api/chat?conversationId=${conversationId}`);
        return res.data;
      },
      enabled: !!conversationId,
    });

  // Send message mutation with optimistic updates
  const sendMessageMutation = useMutation<
    MessageResponse,
    Error,
    string,
    MutationContext
  >({
    mutationFn: async (userMessage: string) => {
      // Validation and API call logic
      setIsAiThinking(true);
      const response = await axios.post<MessageResponse>("/api/chat", {
        prompt: userMessage,
        userId,
        modelName: conversationData?.conversation?.model?.name,
        conversationId,
      });
      return response.data;
    },
    
    // Optimistic UI update - show message immediately before server response
    onMutate: async (userMessage) => {
      // Creates temporary messages to show in UI while waiting for response
      // This gives immediate feedback to users
    },
    
    onSuccess: (data, _userMessage, context) => {
      // Update UI with real AI response when received
    },
    
    onError: (_error, _userMessage, context) => {
      // Rollback to previous state if error occurs
    },
  });

  // More utility functions for conversation management...

  return {
    model: conversationData?.conversation?.model,
    history: visibleMessages,
    conversations: conversationsData?.conversations || [],
    sendMessage: (userMessage: string) => sendMessageMutation.mutate(userMessage),
    createNewConversation: (modelName: string) => createConversationMutation.mutate(modelName),
    isLoading: sendMessageMutation.isPending || isConversationLoading,
    isAiThinking,
    refreshMessages,
  };
};
```

### AI Character Model Creation

```typescript
export const POST = async (req: NextRequest) => {
  try {
    const { name, prompt, imageUrl, description, nameOfChar } = JSON.parse(rawBody || "{}");

    // Input validation
    if (!name || !prompt || !nameOfChar || !imageUrl || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create new character model in database
    const model = await prisma.model.create({
      data: {
        name,           // Unique identifier for the model
        basePrompt: prompt,  // Character instructions for the AI
        imageUrl,       // Character avatar 
        description,    // Brief description
        nameOfChar,     // Character's display name
      },
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error("Error creating model:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
```

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

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT — go wild, but don’t summon cursed AI demons.

## ✍️ Created by Khegal, Hydrix

> Built with purpose. Refined through madness. Dreamed into being.
